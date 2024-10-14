package com.urambank.uram.entities;

import com.urambank.uram.dto.AccountDTO;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "ACCOUNT_TB")
public class AccountEntity {

    @Id
    @Column
    private int accountNo;

    @Column
    private String accountNumber;

    @Column
    private int userNo;

<<<<<<< HEAD
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "depositNo")  // deposit 테이블과의 FK 관계 설정
    private DepositEntity deposit;

=======
>>>>>>> origin/main
    @Column
    private int depositNo;

    @Column
    private int accountBalance;

    @Column
    private int accountLimit;

    @Column
    private String accountPW;

    @Column
    private String accountState;

    @Column
    private Date accountOpen;

    @Column
<<<<<<< HEAD
    private Date accountClose;
=======
    private String bankName;









>>>>>>> origin/main

}
