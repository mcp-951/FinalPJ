package com.urambank.uram.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class AutoTransferDTO {
    private int autoTransNo;
    private int accountNo;
    private int receiveAccountNo;
    private int autoSendPrice;
    private LocalDate reservationDate; // LocalDate로 변경
    private String reservationState;
    private LocalDate deleteDate;
    private LocalDate startDate;  // 이체 시작일
    private LocalDate endDate;    // 이체 종료일
    private int transferDay; // 매월 이체할 날 (예: 1, 10, 20 등)
    private String toBankName;
    private char autoAgreement;

    private AccountDTO fromAccountDTO;      // 출금 계좌 정보
    private AccountDTO toAccountDTO;        // 내부 입금 계좌 정보 (선택적)
    private OutAccountDTO outAccountDTO;    // 외부 입금 계좌 정보 (선택적)

}
