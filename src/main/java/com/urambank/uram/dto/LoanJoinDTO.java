package com.urambank.uram.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
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
}

