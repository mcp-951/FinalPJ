package com.urambank.uram.entities;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.*;

import java.sql.Date;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "LoanJoin_TB")
public class LoanJoinEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int loanJoinNo;

    @Column(nullable = false)
    private int loanAmount;

    private int remainingLoanAmount;

    @Column(nullable = false)
    private int loanPeriod;

    @Column(nullable = false)
    private String repaymentMethod;

    @Column(nullable = false)
    private int loanTransferDay;

    @Column(nullable = false)
    private Date loanJoinDay;

    private Date loanFinishDay;

    @Column(nullable = false, columnDefinition = "VARCHAR(20) DEFAULT 'Y'")
    private String loanStatus;

    @Column(nullable = false)
    private int loanNo;

    @Column(nullable = false)
    private int userNo;

    @Column(nullable = false)
    private int accountNo;

    @Column(nullable = false)
    private String loanName;


}
