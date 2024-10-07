package com.ict03.urambank.repository;

import com.ict03.urambank.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<ProductEntity, Integer> {

    // productNo로 Product 정보를 가져오는 메서드
    ProductEntity findByProductNo(int productNo);
}
