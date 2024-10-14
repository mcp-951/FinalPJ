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
<<<<<<< HEAD
    private String bankName;
=======
>>>>>>> origin/main
    private int accountBalance;
    private int accountLimit;
    private String accountPW;
    private String accountState;
    private Date accountOpen;
<<<<<<< HEAD
    private Date accountClose;
=======
    private String bankName;
>>>>>>> origin/main

    public static AccountDTO toAccountDTO(AccountEntity accountEntity) {
        AccountDTO accountDTO = new AccountDTO();
        accountDTO.setAccountNo(accountEntity.getAccountNo());
        accountDTO.setAccountNumber(accountEntity.getAccountNumber());
        accountDTO.setUserNo(accountEntity.getUserNo());
<<<<<<< HEAD

        // depositNo는 accountEntity에서 바로 가져오지 않고, DepositEntity에서 참조
        if (accountEntity.getDeposit() != null) {
            accountDTO.setDepositNo(accountEntity.getDeposit().getDepositNo());
        }

=======
        accountDTO.setDepositNo(accountDTO.getDepositNo());
>>>>>>> origin/main
        accountDTO.setAccountBalance(accountEntity.getAccountBalance());
        accountDTO.setAccountLimit(accountEntity.getAccountLimit());
        accountDTO.setAccountPW(accountEntity.getAccountPW());
        accountDTO.setAccountState(accountEntity.getAccountState());
        accountDTO.setAccountOpen(accountEntity.getAccountOpen());
<<<<<<< HEAD
        accountDTO.setAccountClose(accountEntity.getAccountClose());
=======
        accountDTO.setBankName(accountEntity.getBankName());
>>>>>>> origin/main

        return accountDTO;
    }

}
