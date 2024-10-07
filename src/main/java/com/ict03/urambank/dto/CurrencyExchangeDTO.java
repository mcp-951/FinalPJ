package com.ict03.urambank.dto;

import lombok.*;

import java.sql.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class CurrencyExchangeDTO {
    private int tradeNo;
    private int userNo;
    private int accountNo;
    private String selectCountry;
    private float exchangeRate;
    private Date tradeDate;
    private String pickupPlace;
    private int tradePrice;
    private int tradeAmount;
    private Date receiveDate;
}
