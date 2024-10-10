package com.urambank.uram.repository;

import com.urambank.uram.entities.SupportEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupportRepository extends JpaRepository<SupportEntity, Integer> {

    // 특정 사용자의 문의 목록을 페이징으로 조회
    Page<SupportEntity> findByUserNo(Integer userNo, Pageable pageable);
}
