package com.urambank.uram.dto;

import com.urambank.uram.entities.AccountEntity;
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
    private String accountNumber;
    private int userNo;
    private int depositNo;
    private int accountBalance;
    private int accountLimit;
    private String accountPW;
    private String accountState;
    private Date accountOpen;
    private String bankName;

    public static AccountDTO toAccountDTO(AccountEntity accountEntity) {
        AccountDTO accountDTO = new AccountDTO();
        accountDTO.setAccountNo(accountEntity.getAccountNo());
        accountDTO.setAccountNumber(accountEntity.getAccountNumber());
        accountDTO.setUserNo(accountEntity.getUserNo());
        accountDTO.setDepositNo(accountDTO.getDepositNo());
        accountDTO.setAccountBalance(accountEntity.getAccountBalance());
        accountDTO.setAccountLimit(accountEntity.getAccountLimit());
        accountDTO.setAccountPW(accountEntity.getAccountPW());
        accountDTO.setAccountState(accountEntity.getAccountState());
        accountDTO.setAccountOpen(accountEntity.getAccountOpen());
        accountDTO.setBankName(accountEntity.getBankName());

        return accountDTO;
    }
}
