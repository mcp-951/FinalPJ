package com.urambank.uram.repository;

import com.urambank.uram.entities.CoinListEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoinListRepository extends JpaRepository<CoinListEntity, Integer> {
}
