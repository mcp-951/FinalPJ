package com.urambank.uram.dto;

import lombok.*;

import java.sql.Date;
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
    private String receiveAccountNo;
    private int autoSendPrice;
    private LocalDate reservationDate;
    private String reservationState;
    private char autoShow;
    private LocalDate deleteDate;
    private LocalDate startDate; // 변경
    private LocalDate endDate;  // 이체 종료 날짜
    private int transferDay; // 이체일 (예: 매달 며칠에 이체할지)
    private String toBankName;
}
