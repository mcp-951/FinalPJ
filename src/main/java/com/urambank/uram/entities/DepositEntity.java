package com.urambank.uram.entities;

import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "deposit_TB")
public class DepositEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int depositNo;  // 상품 번호 (자동 증가)

    @Column(nullable = false, length = 100)
    private String depositName;  // 상품 이름

    @Column(nullable = false)
    private int depositCategory;  // 상품 카테고리 (1: 예금, 2: 적금)

    @Column(nullable = false)
    private float depositRate;  // 이자율

    @Column(columnDefinition = "TEXT")
    private String depositContent;  // 상품 설명

    @Column(length = 255)
    private String depositIMG;  // 상품 이미지 URL
}
