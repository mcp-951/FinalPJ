package com.urambank.uram.repository;

import com.urambank.uram.entities.AutoTransferEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AutoTransferRepository extends JpaRepository<AutoTransferEntity, Integer> {
}
