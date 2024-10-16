package com.urambank.uram.repository;

import com.urambank.uram.dto.AccountDTO;
import com.urambank.uram.entities.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<AccountEntity, Long> {

    List<AccountEntity> findByUserNo(int userNo);

    // 전체 계좌 반환
    @Query("SELECT a.accountNo, a.accountNumber, a.accountBalance, a.accountOpen, a.accountClose, " +
            "a.deposit.depositNo, a.deposit.depositName " +
            "FROM AccountEntity a WHERE a.accountState = 'NORMAL' AND a.userNo = :userNo")
    List<Object[]> findAllAccountWithDepositAndActive(@Param("userNo") int userNo);

    // 예금 계좌만 반환
    @Query("SELECT a.accountNo, a.accountNumber, a.accountBalance, a.accountOpen, a.accountClose, d.depositNo, d.depositName, d.depositCategory " +
            "FROM AccountEntity a " +
            "JOIN a.deposit d " +
            "WHERE a.userNo = :userNo AND a.accountState = 'NORMAL' AND d.depositCategory = 1")
    List<Object[]> findAllDepositCategoryOneAccounts(@Param("userNo") int userNo);

    // 카테고리별 계좌
    @Query("SELECT a.accountNo, a.accountNumber, a.accountBalance, a.accountOpen, a.accountClose, " +
            "a.deposit.depositNo, a.deposit.depositName " +
            "FROM AccountEntity a JOIN a.deposit d " +
            "WHERE d.depositCategory = :depositCategory AND a.accountState = 'NORMAL' AND a.userNo = :userNo")
    List<Object[]> findByDepositCategoryAndActiveAndUser(
            @Param("depositCategory") int depositCategory,
            @Param("userNo") int userNo
    );

    // 계좌 상세
    @Query("SELECT a FROM AccountEntity a JOIN FETCH a.deposit d WHERE a.accountNumber = :accountNumber AND a.accountState = :accountState AND a.userNo = :userNo")
    AccountEntity findAccountDetailWithDeposit(@Param("accountNumber") String accountNumber, @Param("accountState") String accountState, @Param("userNo") int userNo);

    // 계좌 유효성 확인
    @Query("SELECT a FROM AccountEntity a WHERE a.accountNumber = :accountNumber AND a.accountState = :accountState")
    AccountEntity findAccount(@Param("accountNumber") String accountNumber,
                              @Param("accountState") String accountState);

    @Query("SELECT a FROM AccountEntity a WHERE a.accountNo = :accountNo")
    AccountEntity findByAccountNo(@Param("accountNo") int accountNo);

    // 계좌 번호로 계좌를 찾는 메서드
    @Query("SELECT a FROM AccountEntity a WHERE a.accountNumber = :accountNumber AND a.accountState = 'NORMAL'")
    Optional<AccountEntity> findByAccountNumber(@Param("accountNumber") String accountNumber);

    // 내부 계좌 조회
    @Query("SELECT a FROM AccountEntity a WHERE a.accountNumber = :accountNumber AND a.bankName = :bankName")
    AccountEntity findByAccountNumberAndBankName(@Param("accountNumber") String accountNumber,  // accountNumber를 String으로 변경
                                                 @Param("bankName") String bankName);


    // accountNo와 상태로 계좌 조회
    @Query("SELECT a FROM AccountEntity a WHERE a.accountNo = :accountNo AND a.accountState = :state")
    AccountEntity findByAccountNoAndState(@Param("accountNo") int accountNo, @Param("state") String state);

    // accountNo와 은행명으로 계좌 조회
    @Query("SELECT a FROM AccountEntity a WHERE a.accountNo = :accountNo AND a.bankName = :bankName AND a.accountState = 'NORMAL'")
    AccountEntity findByAccountNoAndBankName(@Param("accountNo") int accountNo, @Param("bankName") String bankName);


    // accountNo로 accountNumber 조회
    @Query("SELECT a.accountNumber FROM AccountEntity a WHERE a.accountNo = :accountNo")
    String findAccountNumberByAccountNo(@Param("accountNo") int accountNo);  // Integer 대신 String으로 변경

    // accountNo와 bankName으로 accountNumber 조회
    @Query("SELECT a.accountNumber FROM AccountEntity a WHERE a.accountNo = :accountNo AND a.bankName = :bankName")
    String findAccountNumberByAccountNoAndBankName(@Param("accountNo") int accountNo, @Param("bankName") String bankName);  // Integer 대신 String으로 변경




}
