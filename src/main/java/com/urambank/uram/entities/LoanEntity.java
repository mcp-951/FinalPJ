package com.urambank.uram.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.sql.Date;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "LOAN_TB")
public class LoanEntity {
    @Id
    @Column(name = "loanNo")
    private int loanNo;

    @Column(name = "userNo")
    private int userNo;

    @Column(name = "loanJoinDate")
    private Date loanJoinDate; //가입일

    @Column(name = "repaymentType")
    private String repaymentType; // 상환방식

    @Column(name = "loanProductNo")
    private int loanProductNo; //대출상품 번호

    @Column(name = "loanAmount")
    private int loanAmount; //대출 원금

    @Column(name = "loanInterest")
    private int loanInterest; //대출 이자

    @Column(name = "interestRate")
    private double interestRate; //이율

    @Column(name = "loanTern")
    private int loanTern; //기간

    @Column(name = "repaymentAmount")
    private int repaymentAmount; // 갚은 원금

    @Column(name = "repaymentInterest")
    private int repaymentInterest; // 갚은 이자

    @Column(name = "loanStatus")
    private String loanStatus; // 대출 상
}
