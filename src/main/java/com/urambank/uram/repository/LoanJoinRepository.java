package com.urambank.uram.repository;

import com.urambank.uram.entities.LoanJoinEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LoanJoinRepository extends JpaRepository<LoanJoinEntity, Integer> {
    // userNo와 loanStatus로 LoanJoinEntity를 찾는 메서드
    List<LoanJoinEntity> findByUserNoAndLoanStatus(int userNo, String loanStatus);

    // loanNo로 LoanJoinEntity를 찾는 메서드
    List<LoanJoinEntity> findByLoanNo(int loanNo);

    // userNo로 LoanJoinEntity 목록을 찾는 메서드 추가
    List<LoanJoinEntity> findByUserNo(int userNo);

    // userNo와 loanJoinNo로 대출 찾기
    @Query("SELECT l FROM LoanJoinEntity l WHERE l.userNo = :userNo AND l.loanJoinNo = :loanJoinNo")
    Optional<LoanJoinEntity> findByUserNoAndLoanJoinNo(@Param("userNo") int userNo, @Param("loanJoinNo") int loanJoinNo);
}
