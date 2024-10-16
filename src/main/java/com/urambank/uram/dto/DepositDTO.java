package com.urambank.uram.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class DepositDTO {
    private int depositNo;        // 상품 번호
    private String depositName;   // 상품 이름
    private int depositCategory;  // 상품 카테고리 (1: 예금, 2: 적금)
    private float depositRate;    // 이자율
    private String depositContent;// 상품 설명
    private String depositIMG;    // 상품 이미지 URL
    private char depositState;

}