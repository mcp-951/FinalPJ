package com.urambank.uram.repository;

import com.urambank.uram.entities.LogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

public interface LogRepository extends JpaRepository<LogEntity, Integer> {

    @Query("SELECT COALESCE(SUM(l.sendPrice), 0) FROM LogEntity l WHERE l.sendAccountNumber = :accountNumber AND l.sendDate = :today AND l.logState = 'SUCCESS'")
    Integer sumTodayTransfers(@Param("accountNumber") int accountNumber, @Param("today") Date today);

    @Query("SELECT l FROM LogEntity l WHERE (l.sendAccountNumber = :accountNumber OR l.receiveAccountNumber = :accountNumber) AND l.logState = 'SUCCESS'")
    List<LogEntity> findByAccountNumberAndLogState(@Param("accountNumber") int accountNumber);




}

