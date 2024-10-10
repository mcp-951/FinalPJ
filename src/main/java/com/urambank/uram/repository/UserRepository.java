package com.urambank.uram.repository;

import com.urambank.uram.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

// 데이터베이스와 상호작용하여 사용자 정보를 쉽게 처리할 수 있도록 하는 Spring Data JPA의 기능을 활용하기 위함
public interface UserRepository extends JpaRepository<User, Integer> {

    User findByUserId(String userId);
    // 특정 상태에 따른 회원 조회 (NORMAL, STOP, END)
    List<User> findAllByState(char state); // 상태에 따라 조회하는 메서드

    User findByUserNo(int userNo);

}
