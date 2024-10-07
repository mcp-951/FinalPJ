package com.ict03.urambank.dto;

import lombok.*;

import java.sql.Date;

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
    private Date reservationDate;
    private String reservationState;
    private char autoShow;
    private Date deleteDate;
}
