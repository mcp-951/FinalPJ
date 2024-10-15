package com.urambank.uram.repository;

import com.urambank.uram.entities.DepositEntity; // DepositEntity를 import합니다.

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepositRepository extends JpaRepository<DepositEntity, Integer> {

    // loanState가 "Y"인 대출 상품을 페이징 처리하여 반환하는 메서드
    Page<DepositEntity> findByDepositState(Character depositState, Pageable pageable);

}
