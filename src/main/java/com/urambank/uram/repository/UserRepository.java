package com.urambank.uram.repository;

import com.urambank.uram.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUserId(String userId); // userId로 User 엔티티 찾기
}
