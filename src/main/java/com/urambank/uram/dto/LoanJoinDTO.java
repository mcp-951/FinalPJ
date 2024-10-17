package com.urambank.uram.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class LoanJoinDTO {
    private int loanJoinNo;
    private int loanAmount;
    private int remainingLoanAmount;
    private int loanPeriod;
    private String repaymentMethod;
    private int loanTransferDay;
    private LocalDateTime loanJoinDay;
    private LocalDate loanFinishDay;
    private String loanStatus;
    private int loanNo;
    private int userNo;
    private int accountNo;
    private String transferAccount;
    private String loanName;
}
