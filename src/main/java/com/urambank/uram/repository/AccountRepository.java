package com.urambank.uram.repository;

import com.urambank.uram.dto.AccountDTO;
import com.urambank.uram.entities.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<AccountEntity, Integer> {

//    @Query("SELECT a.accountNo, a.accountNumber, a.accountBalance, a.accountOpen, " +
//            "a.product.productNo, a.product.productName, a.product.productPeriod " +
//            "FROM AccountEntity a WHERE a.accountState = 'NORMAL' AND a.user.userId = :userId")
//    List<Object[]> findAllAccountWithProductNameAndActiveByUserId(@Param("userId") Long userId);

    List<AccountEntity> findByUserNo(int userNo);

<<<<<<< HEAD
    @Query("SELECT a.accountNo, a.accountNumber, a.accountBalance, a.accountOpen, a.accountClose, " +
            "a.deposit.depositNo, a.deposit.depositName " +
            "FROM AccountEntity a JOIN a.deposit d WHERE d.depositCategory = :depositCategory AND a.accountState = 'NORMAL'")
    List<Object[]> findByDepositCategoryAndActive(@Param("depositCategory") int depositCategory);

    // 특정 계좌 정보와 관련된 deposit 정보를 조회
    @Query("SELECT a FROM AccountEntity a JOIN FETCH a.deposit d WHERE a.accountNumber = :accountNumber AND a.accountState = :accountState AND a.userNo = :userNo")
    AccountEntity findAccountDetailWithDeposit(@Param("accountNumber") String accountNumber, @Param("accountState") String accountState, @Param("userNo") int userNo);


    // 자사 계좌 유효성 확인
    @Query("SELECT a FROM AccountEntity a WHERE a.accountNumber = :accountNumber AND a.accountState = :accountState")
    AccountEntity findAccount(@Param("accountNumber") String accountNumber,  // accountNumber를 String으로 변경
                              @Param("accountState") String accountState);


    // 'NORMAL' 상태의 계좌만 조회하여 필요한 정보 반환
    @Query("SELECT a.accountNo, a.accountNumber, a.accountBalance, a.accountOpen, a.accountClose, " +
            "a.deposit.depositNo, a.deposit.depositName " +
            "FROM AccountEntity a WHERE a.accountState = 'NORMAL' AND a.userNo = :userNo")
    List<Object[]> findAllAccountWithDepositAndActive(@Param("userNo") int userNo);


=======
//    // 'NORMAL' 상태의 모든 계좌와 관련된 정보를 조회
//    @Query("SELECT a FROM AccountEntity a JOIN FETCH a.product p WHERE a.accountState = 'NORMAL'")
//    List<AccountEntity> findAllWithProductAndActive();
//
//    // 특정 productNo에 해당하는 'NORMAL' 상태의 계좌 조회
//    @Query("SELECT a FROM AccountEntity a JOIN a.product p WHERE p.productNo = :productNo AND a.accountState = 'NORMAL'")
//    List<AccountEntity> findByProductProductNoAndActive(@Param("productNo") int productNo);
//
//    // productName으로 'NORMAL' 상태의 계좌 조회
//    @Query("SELECT a FROM AccountEntity a JOIN a.product p WHERE p.productName = :productName AND a.accountState = 'NORMAL'")
//    List<AccountEntity> findByProductProductNameAndActive(@Param("productName") String productName);
//
//    @Query("SELECT a FROM AccountEntity a JOIN FETCH a.product p WHERE a.accountNumber = :accountNumber AND a.accountState = :accountState AND a.userNo = :userNo")
//    AccountEntity findAccountDetailWithProduct(@Param("accountNumber") String accountNumber, @Param("accountState") String accountState, @Param("userNo") int userNo);
//
//    @Query("SELECT a FROM AccountEntity a JOIN FETCH a.product p WHERE a.accountNumber = :accountNumber AND a.accountState = :accountState")
//    AccountEntity findAccount(@Param("accountNumber") String accountNumber, @Param("accountState") String accountState);
//
//
//    // 'NORMAL' 상태의 계좌만 조회하여 필요한 정보 반환
//    @Query("SELECT a.accountNo, a.accountNumber, a.accountBalance, a.accountOpen, " +
//            "a.product.productNo, a.product.productName,a.product.productPeriod " +
//            "FROM AccountEntity a WHERE a.accountState = 'NORMAL' AND a.userNo = :userNo")
//    List<Object[]> findAllAccountWithProductNameAndActive(@Param("userNo") int userNo);
//
>>>>>>> origin/main
    @Query("SELECT a FROM AccountEntity a WHERE a.accountNo = :accountNo")
    AccountEntity findByAccountNo(@Param("accountNo") int accountNo);

    // 계좌 번호로 계좌를 찾는 메서드
    @Query("SELECT a FROM AccountEntity a WHERE a.accountNumber = :accountNumber AND a.accountState = 'NORMAL'")
<<<<<<< HEAD
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
=======
    AccountEntity findByAccountNumber(@Param("accountNumber") String accountNumber);
//
//    @Query("SELECT a FROM AccountEntity a WHERE a.accountNumber = :accountNumber AND a.bankName = :bankName AND a.accountState = 'NORMAL'")
//    AccountEntity findByAccountNumberAndBankName(@Param("accountNumber") String accountNumber, @Param("bankName") String bankName);
//
//    // accountNo와 상태로 계좌 조회
//    @Query("SELECT a FROM AccountEntity a WHERE a.accountNo = :accountNo AND a.accountState = :state")
//    AccountEntity findByAccountNoAndState(@Param("accountNo") int accountNo, @Param("state") String state);
//
//    // accountNo와 은행명으로 계좌 조회
//    @Query("SELECT a FROM AccountEntity a WHERE a.accountNo = :accountNo AND a.bankName = :bankName AND a.accountState = 'NORMAL'")
//    AccountEntity findByAccountNoAndBankName(@Param("accountNo") int accountNo, @Param("bankName") String bankName);
>>>>>>> origin/main


    // accountNo로 accountNumber 조회
    @Query("SELECT a.accountNumber FROM AccountEntity a WHERE a.accountNo = :accountNo")
    String findAccountNumberByAccountNo(@Param("accountNo") int accountNo);  // Integer 대신 String으로 변경

    // accountNo와 bankName으로 accountNumber 조회
    @Query("SELECT a.accountNumber FROM AccountEntity a WHERE a.accountNo = :accountNo AND a.bankName = :bankName")
    String findAccountNumberByAccountNoAndBankName(@Param("accountNo") int accountNo, @Param("bankName") String bankName);  // Integer 대신 String으로 변경





}
