package com.urambank.uram.repository;

import com.urambank.uram.entities.AutoTransferEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AutoTransferRepository extends JpaRepository<AutoTransferEntity, Integer> {

    // 활성 상태의 모든 자동이체 예약 조회
    @Query("SELECT a FROM AutoTransferEntity a WHERE a.reservationState = 'ACTIVE'")
    List<AutoTransferEntity> findAllActiveAutoTransfers();

    // userNo에 해당하는 활성 상태의 자동이체 예약 조회
    @Query("SELECT a FROM AutoTransferEntity a WHERE a.accountNo IN (SELECT acc.accountNo FROM AccountEntity acc WHERE acc.userNo = :userNo) AND a.reservationState = 'ACTIVE'")
    List<AutoTransferEntity> findAllActiveAutoTransfersByUserNo(@Param("userNo") int userNo);


    // 특정 계좌의 모든 자동이체 정보를 가져오는 쿼리
    @Query("SELECT a FROM AutoTransferEntity a WHERE a.accountNo = :accountNo")
    List<AutoTransferEntity> findByAccountNo(@Param("accountNo") int accountNo);

    // 매월 이체일과 자동이체 활성 상태('Y')인 항목들을 찾는 메서드
    List<AutoTransferEntity> findByTransferDay(int transferDay);
}
