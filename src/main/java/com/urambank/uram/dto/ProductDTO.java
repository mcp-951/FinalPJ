package com.urambank.uram.dto;

import lombok.*;
import com.urambank.uram.entities.ProductEntity;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

    private int productNo;  // 상품 번호
    private String productName;  // 상품 이름
    private String productCategory;  // 예금, 적금, 대출 구분 (int 타입으로 변경)
    private float productRate;  // 이자율
    private String productContent;  // 상품 소개
    private int productPeriod;
    private String viewState;  // 상품 상태 (기본값 'y')
    private String productIMG;  // 상품 이미지 URL

    public ProductDTO(ProductEntity productEntity) {
        this.productNo = productEntity.getProductNo();
        this.productName = productEntity.getProductName();
        this.productCategory = productEntity.getProductCategory();
        this.productRate = productEntity.getProductRate();
        this.productContent = productEntity.getProductContent();
        this.viewState = productEntity.getViewState();
        this.productIMG = productEntity.getProductIMG();
    }

    // 정적 메서드로 변환하는 방식 유지
    public static ProductDTO toProductDTO(ProductEntity productEntity) {
        return new ProductDTO(productEntity);
    }
}
