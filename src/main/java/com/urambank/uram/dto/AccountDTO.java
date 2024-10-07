package com.urambank.uram.dto;

import com.ict03.urambank.entity.AccountEntity;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class AccountDTO {
    private int accountNo;
    private int accountNumber;
    private int userNo;
    private int productNo;
    private String bankName;
    private int accountBalance;
    private int accountLimit;
    private int accountMax;
    private int accountPW;
    private String accountState;
    private Date accountOpen;

    public static AccountDTO toAccountDTO(AccountEntity accountEntity) {
        AccountDTO accountDTO = new AccountDTO();
        accountDTO.setAccountNo(accountEntity.getAccountNo());
        accountDTO.setAccountNumber(accountEntity.getAccountNumber());
        accountDTO.setUserNo(accountEntity.getUserNo());
        accountDTO.setProductNo(accountEntity.getProduct().getProductNo());
        accountDTO.setAccountBalance(accountEntity.getAccountBalance());
        accountDTO.setAccountLimit(accountEntity.getAccountLimit());
        accountDTO.setAccountMax(accountEntity.getAccountMax());
        accountDTO.setAccountPW(accountEntity.getAccountPW());
        accountDTO.setAccountState(accountEntity.getAccountState());
        accountDTO.setAccountOpen(accountEntity.getAccountOpen());

        return accountDTO;
    }
}
