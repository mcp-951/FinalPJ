package com.urambank.uram.service;

import com.urambank.uram.entities.AccountEntity;
import com.urambank.uram.entities.LoanEntity;
import com.urambank.uram.entities.LoanJoinEntity;
import com.urambank.uram.entities.LoanAutoTransferEntity; // LoanAutoTransferEntity로 변경
import com.urambank.uram.entities.LogEntity;
import com.urambank.uram.repository.AccountRepository;
import com.urambank.uram.repository.LoanJoinRepository;
import com.urambank.uram.repository.LoanRepository;
import com.urambank.uram.repository.LoanAutoTransferRepository; // LoanAutoTransferRepository로 변경
import com.urambank.uram.repository.LogRepository;
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
public class LoanAutoTransferService { // 서비스 이름 변경

    private static final Logger logger = LoggerFactory.getLogger(LoanAutoTransferService.class);

    private final LoanAutoTransferRepository loanAutoTransferRepository; // LoanAutoTransferRepository로 변경
    private final LoanJoinRepository loanJoinRepository;
    private final AccountRepository accountRepository;
    private final LoanRepository loanRepository;
    private final LogRepository logRepository;

    // 매일 자정에 자동이체를 처리하는 스케줄링 메서드
    @Scheduled(cron = "0 0 0 * * ?") // 매일 0시에 실행
    @Transactional
    public void processLoanAutoTransfers() { // 메서드 이름 변경
        // 오늘 날짜에 해당하는 이체를 가져옴
        List<LoanAutoTransferEntity> transfers = loanAutoTransferRepository.findByTransferDayAndAutoShow(LocalDate.now().getDayOfMonth(), 'Y');

        for (LoanAutoTransferEntity transfer : transfers) {
            try {
                // 자동이체가 시작되는 날짜가 오늘 날짜보다 이전인지 확인
                if (transfer.getStartDate().isBefore(LocalDate.now()) || transfer.getStartDate().isEqual(LocalDate.now())) {
                    // LoanJoinEntity를 loanJoinNo로 조회
                    LoanJoinEntity loanJoin = loanJoinRepository.findById(transfer.getLoanJoinNo())
                            .orElseThrow(() -> new IllegalArgumentException("LoanJoinEntity not found for loanJoinNo: " + transfer.getLoanJoinNo()));

                    // 로그 추가: loanJoinNo 값 확인
                    logger.info("Processing transfer with LoanJoinNo: {}", transfer.getLoanJoinNo());

                    // 이체할 금액, 계좌 정보 가져오기
                    int transferAmount = calculateRepayment(loanJoin);
                    AccountEntity sourceAccount = accountRepository.findByAccountNo(loanJoin.getAccountNo());

                    // 잔액이 충분한지 확인
                    if (sourceAccount.getAccountBalance() >= transferAmount) {
                        // 출금 계좌에서 금액 차감
                        sourceAccount.setAccountBalance(sourceAccount.getAccountBalance() - transferAmount);

                        // 대출 계좌의 남은 금액 차감
                        loanJoin.setRemainingLoanAmount(loanJoin.getRemainingLoanAmount() - transferAmount);

                        // 로그 기록
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
                        log.setSendAccountNumber(String.valueOf(loanJoin.getAccountNo())); // 출금계좌
                        log.setReceiveAccountNumber("987-65-43210"); // 수신계좌 고정
                        log.setSendPrice(transferAmount); // 출금 금액
                        log.setSendDate(java.sql.Date.valueOf(LocalDate.now())); // 출금 날짜
                        log.setLogState("SUCCESS"); // 로그 상태
                        logRepository.save(log); // 로그 저장
                    } else {
                        // 잔액 부족
                        logger.warn("자동이체 실패 (잔액 부족): {}", transfer.getAutoTransNo());
                        transfer.setReservationState("실패");
                    }

                    // 변경된 이체 정보 및 대출 정보 저장
                    loanAutoTransferRepository.save(transfer);
                    loanJoinRepository.save(loanJoin);
                    accountRepository.save(sourceAccount);

                } else {
                    // 이체가 아직 시작되지 않음
                    logger.info("자동이체 시작일 전: {}", transfer.getAutoTransNo());
                }

            } catch (Exception e) {
                // 오류 발생 시 로그 출력
                logger.error("자동이체 처리 중 오류 발생: {}", transfer.getAutoTransNo(), e);
                transfer.setReservationState("실패");
                loanAutoTransferRepository.save(transfer);
            }
        }

        // 자동 이체 데이터 확인 (DB에서 저장된 데이터를 로그로 출력)
        transfers.forEach(t -> logger.info("자동이체 데이터: {}", t));
    }

    // 상환 금액 계산 (원리금균등상환, 원금균등상환, 원금만기일시상환)
    private int calculateRepayment(LoanJoinEntity loanJoin) {
        LoanEntity loan = loanRepository.findByLoanNo(loanJoin.getLoanNo());

        double rate = loan.getLoanRate() / 12 / 100.0; // 월 이자율 계산
        int amount = loanJoin.getLoanAmount();
        int months = loanJoin.getLoanPeriod();
        double balance = loanJoin.getRemainingLoanAmount();

        // 상환방식에 따른 계산
        switch (loanJoin.getRepaymentMethod()) {
            case "원리금균등상환":
                double monthlyPayment = (amount * rate) / (1 - Math.pow(1 + rate, -months));
                return (int) Math.round(monthlyPayment);

            case "원금균등상환":
                int principalPayment = amount / months;
                double interest = balance * rate;
                return (int) Math.round(principalPayment + interest);

            case "원금만기일시상환":
                if (months == 1) {
                    return (int) Math.round(amount + (amount * rate));
                } else {
                    return (int) Math.round(amount * rate); // 마지막 회차 전까지는 이자만
                }

            default:
                throw new IllegalArgumentException("잘못된 상환방식입니다.");
        }
    }
}
