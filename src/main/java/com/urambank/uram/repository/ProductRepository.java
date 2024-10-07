package com.urambank.uram.repository;

import com.urambank.uram.entities.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<ProductEntity, Integer> {
}
