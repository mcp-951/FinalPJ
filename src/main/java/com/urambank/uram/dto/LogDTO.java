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
<<<<<<< HEAD
    private String sendAccountNumber;
    private String receiveAccountNumber;
=======
    private String sendAccountNo;
    private String receiveAccountNo;
>>>>>>> origin/main
    private int sendPrice;
    private Date sendDate;
    private String logState;
}
