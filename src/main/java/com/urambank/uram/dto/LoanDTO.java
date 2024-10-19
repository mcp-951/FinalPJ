package com.urambank.uram.dto;


import lombok.*;

import java.sql.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class LoanDTO {

    private int loanNo;
    private int userNo;
    private Date loanJoinDate; //가입일
    private String repaymentType; // 상환방식
    private int loanProductNo; //대출상품 번호
    private int loanAmount; //대출 원금
    private int loanInterest; //대출 이자
    private double interestRate; //이율
    private int loanTern; //기간
    private int repaymentAmount; // 갚은 원금
    private int repaymentInterest; // 갚은 이자
    private String loanStatus; // 대출 상태(노말 = 갚는중, 중도 상환 등 그런거 있을 예정)
}
