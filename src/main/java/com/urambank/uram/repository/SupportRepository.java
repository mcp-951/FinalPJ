package com.urambank.uram.repository;

<<<<<<< HEAD
import com.urambank.uram.entities.Support;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SupportRepository extends JpaRepository<Support, Integer> {
    List<Support> findAllByUserId(Integer userId);
=======
import com.urambank.uram.entities.SupportEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupportRepository extends JpaRepository<SupportEntity, Integer> {

    // 특정 사용자의 문의 목록을 페이징으로 조회
    Page<SupportEntity> findByUserNo(Integer userNo, Pageable pageable);
>>>>>>> 50b13222d0394431ef705665178103e286840219
}
