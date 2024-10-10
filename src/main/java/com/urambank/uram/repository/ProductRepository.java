package com.urambank.uram.repository;

import com.urambank.uram.entities.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface ProductRepository extends JpaRepository<ProductEntity, Integer> {

    ProductEntity findById(int productNo);


    List<ProductEntity> findByProductCategoryAndViewState(String category, String y);

    int countByProductCategoryAndViewState(String category, String y);
}