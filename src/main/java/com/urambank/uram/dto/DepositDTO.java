package com.urambank.uram.dto;

import com.urambank.uram.entities.DepositEntity;
import jakarta.persistence.Column;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepositDTO {
    private int depositNo;
    private String accountNo;
    private String depositName;
    private float depositRate;
    private String depositContent;
    private int depositCategory;
    private char depositState;
    private String depositPw;
    private int depositBalance;
    private int depositPeriod;
    private int depositTransferDay;
    private LocalDate depositJoinDay;   // LocalDate로 변경
    private LocalDate depositFinishDay; // LocalDate로 변경
    private int userNo;
    private String accountNumber;

    private float depositMinimumRate; // 최소이자율
    private float depositMaximumRate; // 최대이자율
    private int depositMinimumDate; // 최소가입일
    private int depositMaximumDate; // 최대가입일
    private int depositMinimumAmount; // 가입최소금액
    private int depositMaximumAmount; // 가입최대금액
    private String depositCharacteristic; // 상품 특징

    public static DepositDTO toDepositDTO(DepositEntity depositEntity) {
        return DepositDTO.builder()
                .depositNo(depositEntity.getDepositNo())
                .depositName(depositEntity.getDepositName())
                .depositMaximumRate(depositEntity.getDepositMaximumRate())
                .depositMinimumAmount(depositEntity.getDepositMinimumAmount())
                .depositMaximumAmount(depositEntity.getDepositMaximumAmount())
                .depositMinimumDate(depositEntity.getDepositMinimumDate())
                .depositMaximumDate(depositEntity.getDepositMaximumDate())
                .depositCategory(depositEntity.getDepositCategory())
                .build();
    }

}
