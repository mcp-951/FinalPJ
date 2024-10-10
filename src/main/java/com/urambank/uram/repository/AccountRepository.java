package com.urambank.uram.repository;

import com.urambank.uram.entities.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<AccountEntity, Integer> {
    List<AccountEntity> findByUserNo(int userNo);
    AccountEntity findByAccountNumber(Integer accountNumber);
    // 계좌 번호로 계좌를 찾는 메서드
    //AccountEntity findByAccountNo(Integer accountNo);

//    // Account_TB와 Product_TB를 조인하여 accountBalance와 product 정보를 가져옴
////    @Query(value = "SELECT a.account_number, a.account_balance, p.product_name, p.product_category " +
////            "FROM Account_TB a " +
////            "JOIN Product_TB p ON a.product_no = p.product_no " +
////            "WHERE a.user_no = :userNo", nativeQuery = true)
////    List<Object[]> findAccountsAndProductsByUserNo(@Param("userNo") int userNo);
}
