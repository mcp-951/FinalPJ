package com.urambank.uram.repository;

import com.urambank.uram.entities.AccountEntity;
import com.urambank.uram.entities.DepositEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Modifying;

@Repository
public interface DepositRepository extends JpaRepository<DepositEntity, Integer>{


    List<DepositEntity> findByDepositCategoryAndDepositState(int depositCategory, char depositState);

    int countByDepositCategoryAndDepositState(int depositCategory, char depositState);

    // DepositState 값을 'N'으로 업데이트하여 "삭제" 처리
    @Modifying
    @Transactional
    @Query("UPDATE DepositEntity d SET d.depositState = 'N' WHERE d.depositNo = :depositNo")
    void updateDepositStateToN(@Param("depositNo") int depositNo);

    int countByDepositState(char state);

    // loanState가 "Y"인 대출 상품을 페이징 처리하여 반환하는 메서드
    Page<DepositEntity> findByDepositState(Character depositState, Pageable pageable);
    Optional<DepositEntity> findById(Integer depositNo);

}
