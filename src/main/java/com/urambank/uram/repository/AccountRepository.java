package com.urambank.uram.repository;

import com.urambank.uram.dto.AccountDTO;
import com.urambank.uram.entities.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AccountRepository extends JpaRepository<AccountEntity, Long> {

//    @Query("SELECT a.accountNo, a.accountNumber, a.accountBalance, a.accountOpen, " +
//            "a.product.productNo, a.product.productName, a.product.productPeriod " +
//            "FROM AccountEntity a WHERE a.accountState = 'NORMAL' AND a.user.userId = :userId")
//    List<Object[]> findAllAccountWithProductNameAndActiveByUserId(@Param("userId") Long userId);


    // 'NORMAL' 상태의 모든 계좌와 관련된 정보를 조회
    @Query("SELECT a FROM AccountEntity a JOIN FETCH a.product p WHERE a.accountState = 'NORMAL'")
    List<AccountEntity> findAllWithProductAndActive();

    // 특정 productNo에 해당하는 'NORMAL' 상태의 계좌 조회
    @Query("SELECT a FROM AccountEntity a JOIN a.product p WHERE p.productNo = :productNo AND a.accountState = 'NORMAL'")
    List<AccountEntity> findByProductProductNoAndActive(@Param("productNo") int productNo);

    // productName으로 'NORMAL' 상태의 계좌 조회
    @Query("SELECT a FROM AccountEntity a JOIN a.product p WHERE p.productName = :productName AND a.accountState = 'NORMAL'")
    List<AccountEntity> findByProductProductNameAndActive(@Param("productName") String productName);

    @Query("SELECT a FROM AccountEntity a JOIN FETCH a.product p WHERE a.accountNumber = :accountNumber AND a.accountState = :accountState AND a.userNo = :userNo")
    AccountEntity findAccountDetailWithProduct(@Param("accountNumber") int accountNumber, @Param("accountState") String accountState, @Param("userNo") int userNo);

    @Query("SELECT a.accountNo, a.accountNumber, a.accountBalance, a.accountOpen, " +
            "a.product.productNo, a.product.productName, a.product.productPeriod " +
            "FROM AccountEntity a WHERE a.accountState = 'NORMAL' AND a.userNo = :userNo")
    List<Object[]> findAllAccountWithProductNameAndActive(@Param("userNo") int userNo);

    @Query("SELECT a FROM AccountEntity a WHERE a.accountNo = :accountNo")
    AccountEntity findByAccountNo(@Param("accountNo") int accountNo);

    // 계좌 번호로 계좌를 찾는 메서드 추가
    @Query("SELECT a FROM AccountEntity a WHERE a.accountNumber = :accountNumber AND a.accountState = 'NORMAL'")
    AccountEntity findByAccountNumber(@Param("accountNumber") int accountNumber);

    @Query("SELECT a FROM AccountEntity a WHERE a.accountNumber = :accountNumber AND a.bankName = :bankName AND a.accountState = 'NORMAL'")
    AccountEntity findByAccountNumberAndBankName(@Param("accountNumber") int accountNumber, @Param("bankName") String bankName);

    // accountNo와 상태로 계좌 조회
    @Query("SELECT a FROM AccountEntity a WHERE a.accountNo = :accountNo AND a.accountState = :state")
    AccountEntity findByAccountNoAndState(@Param("accountNo") int accountNo, @Param("state") String state);

    // accountNo와 은행명으로 계좌 조회
    @Query("SELECT a FROM AccountEntity a WHERE a.accountNo = :accountNo AND a.bankName = :bankName AND a.accountState = 'NORMAL'")
    AccountEntity findByAccountNoAndBankName(@Param("accountNo") int accountNo, @Param("bankName") String bankName);









}
