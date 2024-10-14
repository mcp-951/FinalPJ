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
@Table(name = "CURRENCY_EXCHANGE_TB")
public class CurrencyExchangeEntity {

    @Id
    @Column
    private int tradeNo;

    @Column
    private int userNo;

    @Column
    private int accountNo;

    @Column
    private String selectCountry;

    @Column
    private float exchangeRate;

    @Column
    private Date tradeDate;

    @Column
    private String pickUpPlace;

    @Column
    private int tradePrice;

    @Column
    private int tradeAmount;

    @Column
    private Date receiveDate;
}
