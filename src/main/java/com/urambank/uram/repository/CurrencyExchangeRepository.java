package com.urambank.uram.repository;

import com.urambank.uram.entities.CurrencyExchangeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CurrencyExchangeRepository extends JpaRepository<CurrencyExchangeEntity, Integer> {
}
