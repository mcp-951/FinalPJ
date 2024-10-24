package com.urambank.uram.repository;

import com.urambank.uram.entities.SupportEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupportRepository extends JpaRepository<SupportEntity, Integer> {

    // 특정 사용자의 삭제되지 않은 문의글 조회
    List<SupportEntity> findAllByUserIdAndIsDeleted(Integer userId, String isDeleted);

    // 삭제되지 않은 모든 문의글 조회
    List<SupportEntity> findAllByIsDeleted(String isDeleted);
}
