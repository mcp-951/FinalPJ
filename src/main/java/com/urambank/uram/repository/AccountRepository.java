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
    AccountEntity findByAccountNumber(String accountNumber);

}
