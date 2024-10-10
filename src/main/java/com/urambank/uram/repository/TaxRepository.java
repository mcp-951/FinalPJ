package com.urambank.uram.repository;

import com.urambank.uram.entities.TaxEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaxRepository extends JpaRepository<TaxEntity, Integer> {
    List<TaxEntity> findByUserNo(int userNo);
}
