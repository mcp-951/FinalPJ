package com.urambank.uram.repository;

import com.urambank.uram.entities.LoanEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanRepository extends JpaRepository<LoanEntity, Integer> {
    LoanEntity findByLoanProductNoAndUserNo(int productNo, int userNo);

    int countByLoanStatus(String normal);
}
