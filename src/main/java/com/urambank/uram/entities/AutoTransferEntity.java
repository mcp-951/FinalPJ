package com.urambank.uram.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.sql.Date;
import java.time.LocalDate;


@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "AUTO_TRANSFER_TB")
public class AutoTransferEntity {

    @Id
    @Column(name = "autoTransNo")
    private int autoTransNo;

    @Column(name = "accountNo")
    private int accountNo;

    @Column(name = "receiveAccountNo")
    private int receiveAccountNo;

    @Column(name = "autoSendPrice")
    private int autoSendPrice;

    @Column(nullable = false, name ="reservationDate" )
    private LocalDate reservationDate; // LocalDate로 변경

    @Column(name = "reservationState")
    private String reservationState;

    @Column(name = "deleteDate")
    private LocalDate deleteDate;

    // 추가된 필드
    @Column(name = "startDate")
    private LocalDate startDate;  // 이체 시작일

    @Column(name = "endDate")
    private LocalDate endDate;    // 이체 종료일

    @Column(name = "transferDay")
    private int transferDay; // 매월 이체할 날 (예: 1, 10, 20 등)

    @Column(name = "toBankName")
    private String toBankName;

    @Column(name = "autoAgreement")
    private char autoAgreement;
}