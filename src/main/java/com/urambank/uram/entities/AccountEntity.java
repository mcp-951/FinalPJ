package com.urambank.uram.entities;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "ACCOUNT_TB")
public class AccountEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "accountNo")
    private int accountNo;

    @Column(name = "accountNumber")
    private String accountNumber;

    @Column(name = "userNo")
    private int userNo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "depositNo")  // deposit 테이블과의 FK 관계 설정
    private DepositEntity deposit;

    @Column(name = "bankName")
    private String bankName;

    @Column(name = "accountBalance")
    private int accountBalance;

    @Column(name = "accountLimit")
    private int accountLimit;

    @Column(name = "accountPW")
    private String accountPW;

    @Column(name = "accountState")
    private String accountState;

    @Column(name = "accountOpen")
    private Date accountOpen;

    @Column(name = "accountClose")
    private Date accountClose;

    @Column(name = "accountRate")
    private double accountRate;

    @Column(name = "agreement")
    private char agreement;

    @Column(name = "withdrawal")
    private Character withdrawal;


}
