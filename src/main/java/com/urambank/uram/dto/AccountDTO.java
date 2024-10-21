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
    private String accountNumber;
    private int userNo;
    private int depositNo;       // depositNo 필드 유지
    private String bankName;
    private int accountBalance;
    private int accountLimit;
    private String accountPW;
    private String accountState;
    private Date accountOpen;
    private Date accountClose;
    private double accountRate;   // 이자율(double) 추가
    private Character agreement;  // 약정 여부(Character) 추가
    private Character withdrawal; // 출금 여부(Character) 추가
}
