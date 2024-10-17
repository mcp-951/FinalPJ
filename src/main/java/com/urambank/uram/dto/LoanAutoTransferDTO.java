package com.urambank.uram.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class LoanAutoTransferDTO {

    private int autoTransNo;          // 자동이체 고유 번호
    private int accountNo;            // 송금 계좌 번호 (출금 계좌)
    private int receiveAccountNo;     // 수취 계좌 번호 (적금 또는 대출 계좌)
    private int autoSendPrice;        // 이체 금액
    private LocalDate reservationDate;  // 이체 예약일
    private String reservationState;  // 예약 상태
    private char autoShow;            // 이체 표시 여부
    private LocalDate deleteDate;     // 이체 삭제일
    private LocalDate startDate;      // 이체 시작일
    private LocalDate endDate;        // 이체 종료일
    private int transferDay;          // 매월 이체할 날
    private String toBankName;        // 수취 은행 이름
    private int loanJoinNo;           // 대출 가입 고유 번호
}
