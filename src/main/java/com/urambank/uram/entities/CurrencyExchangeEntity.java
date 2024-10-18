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
    @Column(name = "tradeNo")
    private int tradeNo;

    @Column(name = "userNo")
    private int userNo;

    @Column(name = "accountNo")
    private int accountNo;

    @Column(name = "selectCountry")
    private String selectCountry;

    @Column(name = "exchangeRate")
    private float exchangeRate;

    @Column(name = "tradeDate")
    private Date tradeDate;

    @Column(name = "pickupPlace")
    private String pickupPlace;

    @Column(name = "tradePrice")
    private int tradePrice;

    @Column(name = "tradeAmount")
    private int tradeAmount;

    @Column(name = "receiveDate")
    private Date receiveDate;

}
