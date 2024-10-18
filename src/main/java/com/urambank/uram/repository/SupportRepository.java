package com.urambank.uram.repository;

import com.urambank.uram.entities.SupportEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SupportRepository extends JpaRepository<SupportEntity, Integer> {
    List<SupportEntity> findAllByUserId(Integer userId);
}
