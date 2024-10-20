package com.urambank.uram.repository;

import com.urambank.uram.entities.LoanProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanProductRepository extends JpaRepository<LoanProductEntity,Integer> {
    List<LoanProductEntity> findByViewPoint(char viewPoint);
    LoanProductEntity findByLoanProductNo(int productNo);

}
