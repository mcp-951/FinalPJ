package com.urambank.uram.repository;

import com.urambank.uram.entities.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<AccountEntity, Integer> {
    AccountEntity findFirstByUserNo(int userNo);
    AccountEntity findById(int accountNo);
}
