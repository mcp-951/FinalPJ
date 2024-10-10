package com.urambank.uram.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserAccountDTO {

    private int accountNo;       // 계좌 번호 (PK)
    private String accountNumber;   // 계좌 번호
    private int userNo;          // 사용자 번호 (FK)
    private int productNo;       // 상품 번호 (FK)
    private int accountBalance;  // 계좌 잔액
    private int accountLimit;    // 계좌 한도
    private int accountMax;      // 최대 금액
    private String accountPW;       // 계좌 비밀번호
    private String accountState; // 계좌 상태
    private String accountOpen;  // 계좌 개설일
    private String bankName;     // 은행 이름

    // 추가적인 필드가 필요한 경우 필요에 맞게 추가 가능

    // 생성자
    public UserAccountDTO(int accountNo, String accountNumber, int userNo, int productNo, int accountBalance, int accountLimit, int accountMax, String accountPW, String accountState, String accountOpen, String bankName) {
        this.accountNo = accountNo;
        this.accountNumber = accountNumber;
        this.userNo = userNo;
        this.productNo = productNo;
        this.accountBalance = accountBalance;
        this.accountLimit = accountLimit;
        this.accountMax = accountMax;
        this.accountPW = accountPW;
        this.accountState = accountState;
        this.accountOpen = accountOpen;
        this.bankName = bankName;
    }
}
