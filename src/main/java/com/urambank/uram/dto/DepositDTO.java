package com.urambank.uram.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepositDTO {
    private int depositNo;
    private String accountNo;
    private String depositName;
    private String depositContent;
    private int depositCategory;
    private char depositState;
    private String depositPw;
    private int depositBalance;
    private int depositPeriod;
    private int depositTransferDay;
    private LocalDate depositJoinDay;   // LocalDate로 변경
    private LocalDate depositFinishDay; // LocalDate로 변경
    private int userNo;
    private String accountNumber;

    public DepositDTO(int depositNo, String depositName, int depositCategory, String depositContent, char depositState) {
    }
}
