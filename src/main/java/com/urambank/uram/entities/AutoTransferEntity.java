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
    @Column
    private int autoTransNo;

    @Column
    private int accountNo;

    @Column
    private int receiveAccountNo;

    @Column
    private int autoSendPrice;

    @Column(nullable = false)
    private LocalDate reservationDate; // LocalDate로 변경

    @Column
    private String reservationState;

    @Column(nullable = false, columnDefinition = "CHAR(1) DEFAULT 'Y'")
    private char autoShow;

    @Column
    private LocalDate deleteDate;

    // 추가된 필드
    @Column
    private LocalDate startDate;  // 이체 시작일

    @Column
    private LocalDate endDate;    // 이체 종료일

    @Column
    private int transferDay; // 매월 이체할 날 (예: 1, 10, 20 등)

    @Column
    private String toBankName;
}