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
@Table(name = "ACCOUNT_TB")
public class AccountEntity {
    @Id
    @Column
    private int accountNo;

    @Column
    private int accountNumber;

    @Column
    private int userNo;

    @Column
    private int productNo;

    @Column
    private int accountLimit;

    @Column
    private int accountMax;

    @Column
    private int accountPW;

    @Column
    private String accountState;

    @Column
    private Date accountOpen;


    public void setProductName(String productName) {
    }
}
