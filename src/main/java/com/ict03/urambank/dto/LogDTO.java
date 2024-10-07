package com.ict03.urambank.dto;

import lombok.*;

import java.sql.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class LogDTO {
    private int logNo;
    private int sendAccountNo;
    private int receiveAccountNo;
    private int sendPrice;
    private Date sendDate;
    private String logState;
}
