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
    private String bankName;










}
