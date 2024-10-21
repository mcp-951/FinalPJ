package com.urambank.uram.service;

import com.urambank.uram.dto.AccountDTO;
import com.urambank.uram.entities.AutoTransferEntity;
import com.urambank.uram.entities.AccountEntity;
import com.urambank.uram.entities.OutAccountEntity;
import com.urambank.uram.repository.AutoTransferRepository;
import com.urambank.uram.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DepositAutoTransferService {
    private static final Logger logger = LoggerFactory.getLogger(DepositAutoTransferService.class);

    private final AutoTransferRepository autoTransferRepository;
    private final AccountRepository accountRepository;

    /**
     * 매월 1일마다 자동이체를 실행하는 스케줄러
     */
    @Scheduled(cron = "0 0 0 * * ?") // 매월 1일 00:00에 실행
    public void executeAutoTransfers() {
        LocalDate today = LocalDate.now();
        List<AutoTransferEntity> transfers = autoTransferRepository.findByTransferDay(today.getDayOfMonth());

        for (AutoTransferEntity transfer : transfers) {
            processAutoTransfer(transfer);
        }
    }

    /**
     * 자동이체 로직
     */
    private void processAutoTransfer(AutoTransferEntity transfer) {
        try {
            AccountEntity sendeAccount = accountRepository.findById(transfer.getAccountNo())
                    .orElseThrow(() -> new IllegalArgumentException("송금 계좌를 찾을 수 없습니다."));
            AccountEntity receiveAccount = accountRepository.findById(transfer.getReceiveAccountNo())
                    .orElseThrow(() -> new IllegalArgumentException("수신 계좌를 찾을 수 없습니다."));

            // 송금 계좌 잔액 확인
            if (sendeAccount.getAccountBalance() < transfer.getAutoSendPrice()) {
                logger.error("송금 계좌 잔액이 부족합니다. AccountNo: {}", sendeAccount.getAccountNo());
                transfer.setReservationState("FAILED");
                autoTransferRepository.save(transfer);
                return;
            }

            // 송금 계좌에서 금액 차감
            sendeAccount.setAccountBalance(sendeAccount.getAccountBalance() - transfer.getAutoSendPrice());
            accountRepository.save(sendeAccount);

            // 수신 계좌에 금액 추가
            receiveAccount.setAccountBalance(receiveAccount.getAccountBalance() + transfer.getAutoSendPrice());
            accountRepository.save(receiveAccount);

            // 이체 성공 처리
            transfer.setReservationState("SUCCESS");
            autoTransferRepository.save(transfer);

            logger.info("자동이체 완료. 송금 계좌: {}, 수신 계좌: {}, 금액: {}",
                    sendeAccount.getAccountNo(), receiveAccount.getAccountNo(), transfer.getAutoSendPrice());

        } catch (Exception e) {
            logger.error("자동이체 처리 중 오류 발생: {}", e.getMessage());
            // 오류 발생 시 상태를 "FAILED"로 설정
            transfer.setReservationState("FAILED");
            autoTransferRepository.save(transfer);
        }
    }
}
