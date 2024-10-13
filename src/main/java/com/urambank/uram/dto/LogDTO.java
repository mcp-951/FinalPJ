package com.urambank.uram.dto;

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
    private String sendAccountNo;
    private String receiveAccountNo;
    private int sendPrice;
    private Date sendDate;
    private String logState;
}
