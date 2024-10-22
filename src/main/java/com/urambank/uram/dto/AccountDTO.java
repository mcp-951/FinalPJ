package com.urambank.uram.dto;

import com.urambank.uram.entities.AccountEntity;
import lombok.*;

import java.sql.Date;

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
    private String bankName;
    private int accountBalance;
    private int accountLimit;
    private String accountPW;
    private String accountState;
    private Date accountOpen;
    private Date accountClose;
<<<<<<< HEAD
    private double accountRate;   // 이자율(double) 추가
    private Character agreement;  // 약정 여부(Character) 추가
    private Character withdrawal; // 출금 여부(Character) 추가
=======
    private Character withdrawal;
>>>>>>> origin/chaerim

    public static AccountDTO toAccountDTO(AccountEntity accountEntity) {
        AccountDTO accountDTO = new AccountDTO();
        accountDTO.setAccountNo(accountEntity.getAccountNo());
        accountDTO.setAccountNumber(accountEntity.getAccountNumber());
        accountDTO.setUserNo(accountEntity.getUserNo());

        // depositNo는 accountEntity에서 바로 가져오지 않고, DepositEntity에서 참조
        if (accountEntity.getDeposit() != null) {
            accountDTO.setDepositNo(accountEntity.getDeposit().getDepositNo());
        }

        accountDTO.setAccountBalance(accountEntity.getAccountBalance());
        accountDTO.setAccountLimit(accountEntity.getAccountLimit());
        accountDTO.setAccountPW(accountEntity.getAccountPW());
        accountDTO.setAccountState(accountEntity.getAccountState());
        accountDTO.setAccountOpen(accountEntity.getAccountOpen());
        accountDTO.setAccountClose(accountEntity.getAccountClose());
        accountDTO.setWithdrawal(accountEntity.getWithdrawal());

        return accountDTO;
    }
}
