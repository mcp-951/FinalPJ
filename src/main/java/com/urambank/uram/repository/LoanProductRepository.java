package com.urambank.uram.repository;


import com.urambank.uram.entities.LoanProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface LoanProductRepository extends JpaRepository<LoanProductEntity,Integer> {
    List<LoanProductEntity> findByViewPoint(char viewPoint);
    LoanProductEntity findByLoanProductNo(int productNo);

    // viewPoint를 'N'으로 업데이트하는 메서드 추가
    @Modifying
    @Transactional
    @Query("UPDATE LoanProductEntity l SET l.viewPoint = 'N' WHERE l.loanProductNo = :loanProductNo")
    void updateLoanViewPointToN(int loanProductNo);
}
