package com.urambank.uram.repository;

import com.urambank.uram.entities.LogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface LogRepository extends JpaRepository<LogEntity, Integer> {
    List<LogEntity> findBySendDate(Date sendDate);
}
