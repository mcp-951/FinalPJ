package com.urambank.uram.repository;

import com.urambank.uram.entities.LoanJoinEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LoanJoinRepository extends JpaRepository<LoanJoinEntity, Integer> {
    // userNo와 loanStatus로 LoanJoinEntity를 찾는 메서드
    List<LoanJoinEntity> findByUser_UserNoAndLoanStatus(int userNo, String loanStatus);
    // 수정: User 엔티티의 userNo를 참조하도록 수정

    // loanNo로 LoanJoinEntity를 찾는 메서드
    List<LoanJoinEntity> findByLoan_LoanNo(int loanNo); // Loan 엔티티의 loanNo 필드를 참조

    // userNo로 LoanJoinEntity 목록을 찾는 메서드 추가
    List<LoanJoinEntity> findByUser_UserNo(int userNo);
    // 수정: User 엔티티의 userNo를 참조하도록 수정

    // userNo와 loanJoinNo로 대출 찾기
    @Query("SELECT l FROM LoanJoinEntity l WHERE l.user.userNo = :userNo AND l.loanJoinNo = :loanJoinNo")
    Optional<LoanJoinEntity> findByUser_UserNoAndLoanJoinNo(@Param("userNo") int userNo, @Param("loanJoinNo") int loanJoinNo);
    // 수정: userNo는 User 엔티티의 userNo 필드를 참조해야 함
}
