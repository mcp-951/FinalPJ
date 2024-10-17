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
public class DepositAutoTransferService {

    private static final Logger logger = LoggerFactory.getLogger(DepositAutoTransferService.class);

    private final AutoTransferRepository autoTransferRepository;
    private final AccountRepository accountRepository;
    private final LogRepository logRepository;

//    // 매일 자정에 자동이체를 처리하는 스케줄링 메서드
//    @Scheduled(cron = "0 0 0 * * ?") // 매일 0시에 실행
//    @Transactional
//    public void processDepositAutoTransfers() {
//        List<AutoTransferEntity> transfers = autoTransferRepository.findByTransferDayAndAutoShow(LocalDate.now().getDayOfMonth(), 'Y');
//
//        for (AutoTransferEntity transfer : transfers) {
//            try {
//                // depositJoin 체크
//                DepositJoinEntity depositJoin = transfer.getDepositJoin();
//                if (depositJoin == null) {
//                    logger.warn("DepositJoinEntity가 null입니다. AutoTransferNo: {}", transfer.getAutoTransNo());
//                    continue; // 또는 적절한 오류 처리
//                }
//
//                // 이후 로직
//                if (transfer.getStartDate().isBefore(LocalDate.now()) || transfer.getStartDate().isEqual(LocalDate.now())) {
//                    logger.info("Processing deposit transfer with DepositJoinNo: {}", depositJoin.getDepositJoinNo());
//
//                    // 이체할 금액을 depositJoin의 depositBalance로 가져오기
//                    int transferAmount = depositJoin.getDepositBalance(); // 이체할 금액을 depositBalance로 설정
//                    AccountEntity sourceAccount = depositJoin.getAccount();
//
//                    // 출금 계좌에서 금액 차감 및 입금 계좌에서 금액 추가
//                    if (sourceAccount != null && sourceAccount.getAccountBalance() >= transferAmount) {
//                        // 출금 계좌에서 금액 차감
//                        sourceAccount.setAccountBalance(sourceAccount.getAccountBalance() - transferAmount);
//                        logger.info("자동이체 성공: {}, 금액: {}", transfer.getAutoTransNo(), transferAmount);
//
//                        // DepositJoinEntity의 remainingDepositAmount 증가
//                        depositJoin.setRemainingDepositAmount(depositJoin.getRemainingDepositAmount() + transferAmount);
//
//                        // 입금 계좌 정보 가져오기
//                        AccountEntity depositAccount = accountRepository.findByDepositAccountNumber(depositJoin.getDepositAccountNumber())
//                                .orElseThrow(() -> new IllegalArgumentException("입금 계좌를 찾을 수 없습니다."));
//
//                        // 입금 계좌에 금액 추가
//                        depositAccount.setAccountBalance(depositAccount.getAccountBalance() + transferAmount);
//
//                        // 로그 생성
//                        LogEntity log = new LogEntity();
//                        log.setSendAccountNumber(sourceAccount.getAccountNumber());
//                        log.setReceiveAccountNumber(depositJoin.getDepositAccountNumber());
//                        log.setSendPrice(transferAmount);
//                        log.setSendDate(java.sql.Date.valueOf(LocalDate.now()));
//                        log.setLogState("SUCCESS");
//                        logRepository.save(log);
//
//                        // 변경된 이체 정보 및 적금 정보 저장
//                        autoTransferRepository.save(transfer);
//                        depositJoinRepository.save(depositJoin);
//                        accountRepository.save(sourceAccount);
//
//                        // 입금 계좌 정보 저장
//                        accountRepository.save(depositAccount); // 입금 계좌 정보 저장
//
//                    } else {
//                        // 잔액 부족
//                        logger.warn("자동이체 실패 (잔액 부족): {}", transfer.getAutoTransNo());
//                        transfer.setReservationState("실패");
//                    }
//
//                    // 자동이체 기간이 끝나면 autoShow를 'N'으로 변경
//                    if (transfer.getEndDate().isBefore(LocalDate.now())) {
//                        transfer.setAutoShow('N');
//                        autoTransferRepository.save(transfer);
//                        logger.info("자동이체 기간 종료: {}", transfer.getAutoTransNo());
//
//                        // 자동이체 종료 후 이자 계산 및 출금 계좌에 추가
//                        double totalInterest = calculateDailyInterest(depositJoin) * (LocalDate.now().getDayOfMonth() - transfer.getEndDate().getDayOfMonth());
//                        sourceAccount.setAccountBalance(sourceAccount.getAccountBalance() + (int) totalInterest);
//                        accountRepository.save(sourceAccount);
//                    }
//
//                } else {
//                    logger.info("자동이체 시작일 전: {}", transfer.getAutoTransNo());
//                }
//
//            } catch (Exception e) {
//                logger.error("자동이체 처리 중 오류 발생: {}", transfer.getAutoTransNo(), e);
//                transfer.setReservationState("실패");
//                autoTransferRepository.save(transfer);
//            }
//        }
//    }
//
//
//
//    // 적금 이자를 계산하는 메서드 추가
//    private int calculateDepositInterest(DepositJoinEntity depositJoin) {
//        DepositEntity deposit = depositJoin.getDeposit();
//        if (deposit == null) {
//            throw new IllegalArgumentException("Deposit 정보가 없습니다.");
//        }
//
//        double rate = deposit.getDepositRate() / 12 / 100; // 월 이자율 계산
//        int depositAmount = depositJoin.getDepositBalance(); // 가입 금액
//
//        // 월 이자 계산
//        double monthlyInterest = depositAmount * rate;
//        return (int) Math.round(monthlyInterest); // 반올림하여 정수 반환
//    }
//
//    // 일 단위 이자를 계산하는 메서드
//    private double calculateDailyInterest(DepositJoinEntity depositJoin) {
//        DepositEntity deposit = depositJoin.getDeposit();
//        if (deposit == null) {
//            throw new IllegalArgumentException("Deposit 정보가 없습니다.");
//        }
//
//        double rate = deposit.getDepositRate() / 100; // 연 이자율 계산
//        int depositAmount = depositJoin.getDepositBalance(); // 가입 금액
//
//        // 일 단위 이자 계산
//        double dailyInterest = (depositAmount * rate) / 365;
//        return dailyInterest; // 일 단위 이자 반환
//    }
}
