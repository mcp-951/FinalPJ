package com.urambank.uram.repository;

import com.urambank.uram.entities.LoanAutoTransferEntity; // LoanAutoTransferEntity 추가
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LoanAutoTransferRepository extends JpaRepository<LoanAutoTransferEntity, Integer> { // JpaRepository 상속

    // 특정 날짜의 자동이체를 조회하는 메서드
    List<LoanAutoTransferEntity> findByTransferDayAndAutoShow(int transferDay, char autoShow); // 자동이체 설정 여부 및 날짜 기준 조회
}
