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

//    // Entity에서 DTO로 변환
//    public static DepositDTO toDepositDTO(DepositEntity depositEntity) {
//        DepositDTO depositDTO = new DepositDTO();
//        depositDTO.setDepositNo(depositEntity.getDepositNo());
//        depositDTO.setDepositName(depositEntity.getDepositName());
//        depositDTO.setDepositCategory(depositEntity.getDepositCategory());
//        depositDTO.setDepositRate(depositEntity.getDepositRate());
//        depositDTO.setDepositContent(depositEntity.getDepositContent());
//        depositDTO.setDepositIMG(depositEntity.getDepositIMG());
//
//        return depositDTO;
//    }
}