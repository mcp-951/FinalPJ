package com.ict03.urambank.repository;

import com.ict03.urambank.entity.AutoTransferEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AutoTransferRepository extends JpaRepository<AutoTransferEntity, Integer> {
}
