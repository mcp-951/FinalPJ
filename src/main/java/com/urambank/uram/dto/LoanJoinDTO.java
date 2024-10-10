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
    private String loanAccount;
    private String transferAccount;
    private LocalDate joinDay;
    private LocalDate finishDay;
    private String userId;


}
