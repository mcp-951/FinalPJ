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
    private int accountNumber;

    @Column
    private int userNo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "productNo", referencedColumnName = "productNo")
    private ProductEntity product;

    @Column
    private String bankName;

    @Column
    private int accountBalance;

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

    public static AccountEntity toAccountEntity(AccountDTO accountDTO) {
        return AccountEntity.builder()
                .accountNo(accountDTO.getAccountNo())
                .accountNumber(accountDTO.getAccountNumber())
                .userNo(accountDTO.getUserNo())
                .product(ProductEntity.builder().productNo(accountDTO.getProductNo()).build()) // productNo만 설정
                .accountBalance(accountDTO.getAccountBalance())
                .accountLimit(accountDTO.getAccountLimit())
                .accountMax(accountDTO.getAccountMax())
                .accountPW(accountDTO.getAccountPW())
                .accountState(accountDTO.getAccountState())
                .accountOpen(accountDTO.getAccountOpen())
                .build();
    }
}
