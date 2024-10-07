package com.ict03.urambank.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "COINLIST_TB")
public class CoinListEntity {
    @Id
    @Column
    private int coinNo;

    @Column
    private String coinName;

    @Column
    private String coinNick;

    @Column
    private float coinPrice;

    @Column
    private String coinTotalPrice;

    @Column
    private float coinIncrease;
}
