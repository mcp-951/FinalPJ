package com.urambank.uram.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoanJoinDTO {

    private String productName;
    private String repaymentMethod;
    private Integer loanAmount;
    private Double interestRate;
    private Integer loanPeriod;
    private Integer loanAccount;
    private Integer transferAccount;
    private LocalDate joinDay;
    private LocalDate finishDay;
    private Integer userNo;
    private Integer transferDay; // 추가 필요
    private Integer remainingLoanAmount; // 추가 필요
    private Integer repaymentAccount;


}
