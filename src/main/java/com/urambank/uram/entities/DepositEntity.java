package com.urambank.uram.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "deposit_TB")
public class DepositEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "depositNo")
    private int depositNo;

    @Column(name = "depositCategory", nullable = false)
    private int depositCategory;

    @Column(name = "depositContent", length = 255)
    private String depositContent;

    @Column(name = "depositIMG", length = 255)
    private String depositIMG;

    @Column(name = "depositName", length = 255)
    private String depositName;

    @Column(name = "depositState", nullable = false, columnDefinition = "char(1) default 'Y'")
    private char depositState;

    @Column(name = "depositCharacteristic", length = 255)
    private String depositCharacteristic;

    @Column(name = "depositMaximumAmount", nullable = false)
    private int depositMaximumAmount;

    @Column(name = "depositMaximumDate", nullable = false)
    private int depositMaximumDate;

    @Column(name = "depositMaximumRate", nullable = false)
    private float depositMaximumRate;

    @Column(name = "depositMinimumAmount", nullable = false)
    private int depositMinimumAmount;

    @Column(name = "depositMinimumDate", nullable = false)
    private int depositMinimumDate;

    @Column(name = "depositMinimumRate", nullable = false)
    private float depositMinimumRate;

}
