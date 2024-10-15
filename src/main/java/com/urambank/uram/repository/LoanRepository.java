package com.urambank.uram.repository;

import com.urambank.uram.entities.LoanEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface LoanRepository extends JpaRepository<LoanEntity, Integer> {

    // loanNo로 LoanEntity를 찾는 메서드 선언
    LoanEntity findByLoanNo(int loanNo);

    @Query("SELECT l.loanName FROM LoanEntity l WHERE l.loanNo = :loanNo")
    String findLoanNameByLoanNo(@Param("loanNo") int loanNo);

    // loanState가 "Y"인 대출 상품을 페이징 처리하여 반환하는 메서드
    Page<LoanEntity> findByLoanState(Character loanState, Pageable pageable);
}
