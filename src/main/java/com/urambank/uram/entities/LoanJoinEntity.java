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
@Table(name = "loanJoin_TB")  // 테이블 이름이 맞는지 확인하세요
public class LoanJoinEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long loanId;

    private String productName;

    private String repaymentMethod;

    private Integer loanAmount;

    private Integer loanPeriod;

    private Double interestRate;

    private String loanAccount;

    private String transferAccount;

    private LocalDate joinDay;

    private LocalDate finishDay;

    private String userId;

}
