package com.ict03.urambank.repository;

import com.ict03.urambank.entity.LogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

public interface LogRepository extends JpaRepository<LogEntity, Integer> {

    // 거래 상태가 "SUCCESS"인 내역만 조회
    @Query("SELECT l FROM LogEntity l WHERE (l.sendAccountNo = :accountNumber OR l.receiveAccountNo = :accountNumber) AND l.logState = 'SUCCESS'")
    List<LogEntity> findByAccountNumberAndLogState(@Param("accountNumber") int accountNumber);

    @Query("SELECT COALESCE(SUM(l.sendPrice), 0) FROM LogEntity l WHERE l.sendAccountNo = :accountNumber AND l.sendDate = :today AND l.logState = 'SUCCESS'")
    Integer sumTodayTransfers(@Param("accountNumber") int accountNumber, @Param("today") Date today);


}

