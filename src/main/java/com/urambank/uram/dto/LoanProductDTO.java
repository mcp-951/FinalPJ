package com.urambank.uram.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class LoanProductDTO {
    private int loanProductNo;
    private String loanProductTitle; //상품명
    private int loanMaxLimit; // 대출 최대한도
    private int loanMinLimit; // 대출 최소한도
    private int loanMaxTern; // 대출 최대 기간
    private int loanMinTern; // 대출 최소 기간
    private int minInterestRate; // 최소 이율
    private double maxInterestRate; // 최대 이율
    private double earlyRepaymentFee; // 중도 상환 수수료
    private int minCreditScore; // 가입 최소 신용등급
    private char viewPoint; // 삭제 시 안보임 표시하는 것
}
