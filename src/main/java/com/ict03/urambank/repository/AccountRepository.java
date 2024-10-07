package com.ict03.urambank.repository;

import com.ict03.urambank.dto.AccountDTO;
import com.ict03.urambank.entity.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<AccountEntity, Long> {

    // 'NORMAL' 상태의 모든 계좌와 관련된 정보를 조회
    @Query("SELECT a FROM AccountEntity a JOIN FETCH a.product p WHERE a.accountState = 'NORMAL'")
    List<AccountEntity> findAllWithProductAndActive();

    // 특정 productNo에 해당하는 'NORMAL' 상태의 계좌 조회
    @Query("SELECT a FROM AccountEntity a JOIN a.product p WHERE p.productNo = :productNo AND a.accountState = 'NORMAL'")
    List<AccountEntity> findByProductProductNoAndActive(@Param("productNo") int productNo);

    // productName으로 'NORMAL' 상태의 계좌 조회
    @Query("SELECT a FROM AccountEntity a JOIN a.product p WHERE p.productName = :productName AND a.accountState = 'NORMAL'")
    List<AccountEntity> findByProductProductNameAndActive(@Param("productName") String productName);

    @Query("SELECT a FROM AccountEntity a JOIN FETCH a.product p WHERE a.accountNumber = :accountNumber AND a.accountState = :accountState")
    AccountEntity findAccountDetailWithProduct(@Param("accountNumber") int accountNumber, @Param("accountState") String accountState);


    // 'NORMAL' 상태의 계좌만 조회하여 필요한 정보 반환
    @Query("SELECT a.accountNo, a.accountNumber, a.accountBalance, a.accountOpen, " +
            "a.product.productNo, a.product.productName, a.product.productPeriod " +
            "FROM AccountEntity a WHERE a.accountState = 'NORMAL'")
    List<Object[]> findAllAccountWithProductNameAndActive();


}
