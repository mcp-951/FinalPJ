package com.urambank.uram.repository;

import com.urambank.uram.entities.LogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface LogRepository extends JpaRepository<LogEntity, Integer> {

    // sendAccountNo로 로그 데이터를 찾는 쿼리 메서드
    static List<LogEntity> findBySendAccountNo(int sendAccountNo) {
        return null;
    }

    // receiveAccountNo로 로그 데이터를 찾는 쿼리 메서드 추가
    static List<LogEntity> findByReceiveAccountNo(int receiveAccountNo) {
        return null;
    }

    // 필요 시 날짜별로 로그 데이터를 찾는 메서드
    List<LogEntity> findBySendDate(Date sendDate);
}
