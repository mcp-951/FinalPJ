package com.urambank.uram.repository;

import com.urambank.uram.entities.CurrencyExchangeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CurrencyExchangeRepository extends JpaRepository<CurrencyExchangeEntity, Integer> {
    @Query("SELECT e FROM CurrencyExchangeEntity e WHERE e.userNo = :userNo")
    List<CurrencyExchangeEntity> findByUserNo(@Param("userNo") int userNo);

}
