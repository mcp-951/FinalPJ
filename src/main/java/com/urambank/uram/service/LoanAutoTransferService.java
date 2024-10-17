package com.urambank.uram.service;

import com.urambank.uram.entities.*;
import com.urambank.uram.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanAutoTransferService {

    private static final Logger logger = LoggerFactory.getLogger(LoanAutoTransferService.class);

    private final LoanAutoTransferRepository loanAutoTransferRepository;
    private final LoanJoinRepository loanJoinRepository;
    private final AccountRepository accountRepository;
    private final LoanRepository loanRepository;
    private final LogRepository logRepository;

    // 매일 자정에 자동이체를 처리하는 스케줄링 메서드
    @Scheduled(cron = "0 0 0 * * ?") // 매일 0시에 실행
    @Transactional
    public void processLoanAutoTransfers() {
        List<LoanAutoTransferEntity> transfers = loanAutoTransferRepository.findByTransferDayAndAutoShow(LocalDate.now().getDayOfMonth(), 'Y');

        for (LoanAutoTransferEntity transfer : transfers) {
            try {
                if (transfer.getStartDate().isBefore(LocalDate.now()) || transfer.getStartDate().isEqual(LocalDate.now())) {

                    // LoanJoinEntity를 loanJoinNo로 조회
                    LoanJoinEntity loanJoin = loanJoinRepository.findById(transfer.getLoanJoin().getLoanJoinNo())
                            .orElseThrow(() -> new IllegalArgumentException("LoanJoinEntity not found for loanJoinNo: " + transfer.getLoanJoin().getLoanJoinNo()));

                    logger.info("Processing transfer with LoanJoinNo: {}", transfer.getLoanJoin().getLoanJoinNo());

                    // 이체할 금액, 계좌 정보 가져오기
                    int transferAmount = calculateRepayment(loanJoin);
                    AccountEntity sourceAccount = loanJoin.getAccount();

                    if (sourceAccount != null && sourceAccount.getAccountBalance() >= transferAmount) {
                        // 출금 계좌에서 금액 차감
                        sourceAccount.setAccountBalance(sourceAccount.getAccountBalance() - transferAmount);

                        // 대출 계좌의 남은 금액 차감
                        loanJoin.setRemainingLoanAmount(loanJoin.getRemainingLoanAmount() - transferAmount);

                        logger.info("자동이체 성공: {}, 금액: {}", transfer.getAutoTransNo(), transferAmount);

                        // 상태 업데이트
                        transfer.setReservationState("성공");

                        // remainingLoanAmount가 0이면 loanStatus와 autoShow를 "N"으로 설정
                        if (loanJoin.getRemainingLoanAmount() <= 0) {
                            loanJoin.setLoanStatus("N");
                            transfer.setAutoShow('N');
                            logger.info("대출 상환 완료: LoanJoinNo = {}", loanJoin.getLoanJoinNo());
                        }

                        // 로그 생성
                        LogEntity log = new LogEntity();
                        log.setSendAccountNumber(sourceAccount.getAccountNumber()); // 출금계좌
                        log.setReceiveAccountNumber("987-65-43210"); // 수신계좌 고정
                        log.setSendPrice(transferAmount); // 출금 금액
                        log.setSendDate(java.sql.Date.valueOf(LocalDate.now())); // 출금 날짜
                        log.setLogState("SUCCESS"); // 로그 상태
                        logRepository.save(log); // 로그 저장

                    } else {
                        // 잔액 부족
                        logger.warn("자동이체 실패 (잔액 부족): {}", transfer.getAutoTransNo());
                        transfer.setReservationState("FAIL");
                    }

                    // 변경된 이체 정보 및 대출 정보 저장
                    loanAutoTransferRepository.save(transfer);
                    loanJoinRepository.save(loanJoin);
                    accountRepository.save(sourceAccount);

                } else {
                    logger.info("자동이체 시작일 전: {}", transfer.getAutoTransNo());
                }

            } catch (Exception e) {
                logger.error("자동이체 처리 중 오류 발생: {}", transfer.getAutoTransNo(), e);
                transfer.setReservationState("실패");
                loanAutoTransferRepository.save(transfer);
            }
        }
    }

    // 이체할 금액 계산 메서드 추가
    private int calculateRepayment(LoanJoinEntity loanJoin) {
        LoanEntity loan = loanJoin.getLoan();
        if (loan == null) {
            throw new IllegalArgumentException("Loan 정보가 없습니다.");
        }

        double rate = loan.getLoanRate() / 12 / 100; // 월 이자율 계산
        int loanAmount = loanJoin.getLoanAmount();
        int months = loanJoin.getLoanPeriod();
        double balance = loanJoin.getRemainingLoanAmount();

        switch (loanJoin.getRepaymentMethod()) {
            case "원리금균등상환":
                double monthlyPayment = (loanAmount * rate) / (1 - Math.pow(1 + rate, -months));
                return (int) Math.round(monthlyPayment);
            case "원금균등상환":
                int principalPayment = loanAmount / months;
                double interest = balance * rate;
                return (int) Math.round(principalPayment + interest);
            case "원금만기일시상환":
                return (months == 1) ? (int) Math.round(loanAmount + (loanAmount * rate)) : (int) Math.round(loanAmount * rate);
            default:
                throw new IllegalArgumentException("잘못된 상환방식입니다.");
        }
    }
}
