package com.urambank.uram.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class ProductDTO {
    private int productNo;
    private String productName;
    private String productCategory;
    private float productRate;
    private int productPeriod;
    private String productContent;
    private String productIMG;
    private String viewState;  // 추가된 필드
    private String repaymentType;  // 추가된 필드
}
