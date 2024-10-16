package com.urambank.uram.repository;

import com.urambank.uram.entities.AccountEntity;
import com.urambank.uram.entities.DepositEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Modifying;

@Repository
public interface DepositRepository extends JpaRepository<DepositEntity, Integer>{

    // 적금 카테고리가 3이고 depositState가 'Y'인 값만 조회하는 메서드 추가
    List<DepositEntity> findByDepositCategoryAndDepositState(int depositCategory, char depositState);

    // DepositState 값을 'n'으로 업데이트하여 "삭제" 처리
    @Modifying
    @Transactional
    @Query("UPDATE DepositEntity d SET d.depositState = 'n' WHERE d.depositNo = :depositNo")
    void updateDepositStateToN(@Param("depositNo") int depositNo);

    int countByDepositState(char state);

}
