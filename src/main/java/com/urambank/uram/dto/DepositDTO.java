package com.urambank.uram.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class DepositDTO {
    private int depositNo;                // 예금 번호
    private String depositName;           // 예금 이름
    private int depositCategory;          // 예금 카테고리
    private String depositContent;        // 예금 설명
    private String depositIMG;            // 예금 이미지

    private char depositState;            // 예금 상태 (기본값: 'Y')
    private String depositCharacteristic; // 예금 특성
    private int depositMaximumAmount;     // 최대 예치 금액
    private int depositMaximumDate; // 최대 기간
    private float depositMaximumRate;     // 최대 금리
    private int depositMinimumAmount;     // 최소 예치 금액
    private int depositMinimumDate; // 최소 기간
    private float depositMinimumRate;     // 최소 금리

    public DepositDTO(int depositNo, String depositName, int depositCategory, String depositContent, char depositState) {
        this.depositNo = depositNo;
        this.depositName = depositName;
        this.depositCategory = depositCategory;
        this.depositContent = depositContent;
        this.depositState = depositState;
    }

}
