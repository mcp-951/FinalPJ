package com.urambank.uram.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;


@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "LOANPRODUCT_TB")
public class LoanProductEntity {
    @Id
    @Column(name = "loanProductNo")
    private int loanProductNo;

    @Column(name = "loanProductTitle")
    private String loanProductTitle;

    @Column(name = "loanMaxLimit")
    private int loanMaxLimit;

    @Column(name = "loanMinLimit")
    private int loanMinLimit;

    @Column(name = "loanMaxTern")
    private int loanMaxTern;

    @Column(name = "loanMinTern")
    private int loanMinTern;

    @Column(name = "minInterestRate")
    private int minInterestRate;

    @Column(name = "maxInterestRate")
    private double maxInterestRate;

    @Column(name = "earlyRepaymentFee")
    private double earlyRepaymentFee;

    @Column(name = "minCreditScore")
    private int minCreditScore;

    @Column(name = "viewPoint")
    private char viewPoint;
}
