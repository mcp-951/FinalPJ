package com.urambank.uram.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class CoinListDTO {
    private int coinNo;
    private String coinName;
    private String coinNick;
    private float coinPrice;
    private String coinTotalPrice;
    private float coinIncrease;
}
