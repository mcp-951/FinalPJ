package com.urambank.uram.repository;

import com.urambank.uram.entities.TaxEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaxRepository extends JpaRepository<TaxEntity, Integer> {
    List<TaxEntity> findByUserNo(int userNo);
    List<TaxEntity> findByUserNoAndTaxCategory(int userNo, String taxCategory);

    // findByTaxNo는 단일 객체를 반환하는 메서드로 수정
    Optional<TaxEntity> findByTaxNo(int taxNo);

    TaxEntity findLastMonthTaxByUserNo(int userNo);
}
