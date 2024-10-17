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

    @Column(nullable = false)
    private int remainingLoanAmount;

    @Column(nullable = false)
    private int loanPeriod;

    @Column(nullable = false)
    private String repaymentMethod;

    @Column(nullable = false)
    private int loanTransferDay;

    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDate loanJoinDay;

    @Column
    private LocalDate loanFinishDay;

    @Column(nullable = false, columnDefinition = "VARCHAR(20) DEFAULT 'Y'")
    private String loanStatus;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "loanNo")
    private LoanEntity loan;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "accountNo")
    private AccountEntity account;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "userNo")
    private User user;

    @Column
    private String loanName;

}
