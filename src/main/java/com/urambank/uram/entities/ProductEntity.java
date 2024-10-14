package com.urambank.uram.entities;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "PRODUCT_TB")
public class ProductEntity {

    @Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private int productNo;  // 상품 번호 (PK)

@Column(nullable = false, length = 50)
private String productName;  // 상품 이름

@Column(nullable = false)
private String productCategory;  // 예금, 적금, 대출 구분 (int 타입으로 변경)

@Column(nullable = false)
private float productRate;  // 이자율

@Column(nullable = false, length = 255)
private String productContent;  // 상품 소개

@Column(nullable = false)
private int productPeriod;

@Column(nullable = false, length = 1, columnDefinition = "CHAR(1) DEFAULT 'y'")
private String viewState;  // 상품 상태 (기본값 'y')

@Column(length = 255)
private String productIMG;  // 상품 이미지 URL
}
