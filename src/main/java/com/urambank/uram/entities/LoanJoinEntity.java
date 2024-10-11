package com.urambank.uram.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "loanJoin_TB")
public class LoanJoinEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long loanJoinNo;  // loanId 필드를 loanJoinNo로 변경

    private String productName;
    private String repaymentMethod;
    private Integer loanAmount;
    private Integer loanPeriod;
    private Double interestRate;
    private Integer loanAccount;
    private Integer transferAccount;
    private LocalDate joinDay;
    private LocalDate finishDay;
    private Integer userNo;  // userNo는 외래 키로 참조
    private Integer transferDay;
    private Integer remainingLoanAmount;
}