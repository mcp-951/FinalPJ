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
@Table(name = "TAX_TB")
public class TaxEntity {
    @Id
    @Column
    private int taxNo;

    @Column
    private int fee1;

    @Column
    private int fee2;

    @Column
    private int fee3;

    @Column
    private int basicFee1;

    @Column
    private int basicFee2;

    @Column
    private int basicFee3;

    @Column
    private char taxState;

    @Column
    private Date taxDeadLine;

    @Column
    private Date taxWriteDate;

    @Column
    private int userNo;
}
