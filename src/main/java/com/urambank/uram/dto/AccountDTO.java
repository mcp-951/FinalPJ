package com.urambank.uram.dto;

import lombok.*;

import java.sql.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class AccountDTO {
    private int accountNo;
    private int accountNumber;
    private int userNo;
    private int productNo;
    private int accountLimit;
    private int accountMax;
    private int accountPW;
    private String accountState;
    private Date accountOpen;
}
