package com.urambank.uram.repository;

import com.urambank.uram.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

// 데이터베이스와 상호작용하여 사용자 정보를 쉽게 처리할 수 있도록 하는 Spring Data JPA의 기능을 활용하기 위함
public interface UserRepository extends JpaRepository<User, Integer> {

    User findByUserId(String userId);

}
