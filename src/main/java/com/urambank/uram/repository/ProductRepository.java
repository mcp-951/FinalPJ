package com.urambank.uram.repository;

import com.urambank.uram.entities.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<ProductEntity, Integer> {

    // productNo로 Product 정보를 가져오는 메서드
    ProductEntity findByProductNo(int productNo);

    // 특정 카테고리와 상태('y')인 상품 조회
    List<ProductEntity> findByProductCategoryAndViewState(String productCategory, String viewState);

    // 특정 카테고리와 상태('y')인 상품 개수
    int countByProductCategoryAndViewState(String productCategory, String viewState);

}
