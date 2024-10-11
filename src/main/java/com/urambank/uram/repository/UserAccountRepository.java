package com.urambank.uram.repository;

import com.urambank.uram.entities.AccountEntity;
import com.urambank.uram.entities.UserAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserAccountRepository extends JpaRepository<UserAccountEntity, Long> {
    // userId를 기반으로 계좌 정보를 찾는 메소드
    List<UserAccountEntity> findByUser_UserNo(Integer userId);

    AccountEntity findByAccountNoAndState(Integer transferAccount, String normal);

    AccountEntity findByAccountNo(Integer loanAccount);
}
