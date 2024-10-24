package com.urambank.uram.entities;

import jakarta.persistence.*;
import lombok.*;


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
    private int depositNo; // 상품 번호 (자동 증가)

    @Column(name = "depositName")
    private String depositName; // 상품 이름

    @Column(name = "depositMinimumRate")
    private float depositMinimumRate; // 최소이자율

    @Column(name = "depositMaximumRate")
    private float depositMaximumRate; // 최대이자율

    @Column(name = "depositMinimumDate")
    private int depositMinimumDate; // 최소가입일

    @Column(name = "depositMaximumDate")
    private int depositMaximumDate; // 최대가입일

    @Column(name = "depositMinimumAmount")
    private int depositMinimumAmount; // 가입최소금액

    @Column(name = "depositMaximumAmount")
    private int depositMaximumAmount; // 가입최대금액

    @Column(name = "depositContent")
    private String depositContent; // 상품 설명

    @Column(name = "depositCharacteristic")
    private String depositCharacteristic; // 상품 특징

    @Column(name = "depositCategory")
    private int depositCategory; // 예금 1, 적금 2

    @Column(name = "depositState")
    private Character depositState; // 상품 상태 (Y: 활성, N: 비활성)
}
