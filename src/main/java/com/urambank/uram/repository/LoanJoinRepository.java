package com.urambank.uram.repository;

import com.urambank.uram.entities.LoanJoinEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface LoanJoinRepository extends JpaRepository<LoanJoinEntity, Integer> {

    List<LoanJoinEntity> findAllActiveLoanJoins();
}

