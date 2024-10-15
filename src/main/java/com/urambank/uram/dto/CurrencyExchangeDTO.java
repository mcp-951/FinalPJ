package com.urambank.uram.dto;

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
    private float exchangeRate;
    private String selectCountry;
    private Date tradeDate;
    private String pickUpPlace;
    private int tradePrice;
    private int tradeAmount;
    private Date receiveDate;
}
