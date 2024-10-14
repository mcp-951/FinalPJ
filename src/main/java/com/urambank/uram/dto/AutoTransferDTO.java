package com.urambank.uram.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class AutoTransferDTO {
    private int autoTransNo;                // 자동이체 번호
    private int accountNo;                  // 출금 계좌 번호 (출금 계좌)
    private int receiveAccountNo;           // 입금 계좌 번호 (내부 또는 외부 계좌)
    private int autoSendPrice;              // 이체 금액
    private LocalDate reservationDate;      // 예약 날짜
    private String reservationState;        // 예약 상태
    private char autoShow;                  // 이체 노출 여부
    private LocalDate deleteDate;           // 삭제 날짜
    private LocalDate startDate;            // 이체 시작일
    private LocalDate endDate;              // 이체 종료일
    private int transferDay;                // 매월 이체일
    private String toBankName;              // 입금 은행 이름 (내부 계좌일 경우 null, 외부 계좌일 경우 은행명)

    // 추가된 필드: 출금 계좌 및 입금 계좌 정보
    private AccountDTO fromAccountDTO;      // 출금 계좌 정보
    private AccountDTO toAccountDTO;        // 내부 입금 계좌 정보 (선택적)
    private OutAccountDTO outAccountDTO;    // 외부 입금 계좌 정보 (선택적)
}
