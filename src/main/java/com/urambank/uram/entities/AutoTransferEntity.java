package com.urambank.uram.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.sql.Date;


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

    @Column
    private Date reservationDate;

    @Column
    private String reservationState;

    @Column
    private char autoShow;

    @Column
    private Date deleteDate;
}
