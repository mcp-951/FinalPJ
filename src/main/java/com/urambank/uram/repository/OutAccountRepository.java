package com.urambank.uram.repository;

import com.urambank.uram.entities.OutAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OutAccountRepository extends JpaRepository<OutAccountEntity, Integer> {

    // 모든 외부 계좌 정보를 가져오는 쿼리
    @Query("SELECT o FROM OutAccountEntity o WHERE o.oAccountState = 'NORMAL'")
    List<OutAccountEntity> findAllNormalOutAccounts();

    @Query("SELECT o FROM OutAccountEntity o WHERE o.oAccountNumber = :oAccountNumber AND o.oBankName = :oBankName AND o.oAccountState = :oAccountState")
    OutAccountEntity findByOAccountNumberAndOBankNameAndOAccountState(
            @Param("oAccountNumber") int oAccountNumber,
            @Param("oBankName") String oBankName,
            @Param("oAccountState") String oAccountState);

    // OutAccountRepository.java
    @Query("SELECT o FROM OutAccountEntity o WHERE o.oAccountNumber = :oAccountNumber AND o.oBankName = :oBankName AND o.oAccountState = 'NORMAL'")
    OutAccountEntity findByOAccountNumberAndOBankName(@Param("oAccountNumber") int oAccountNumber, @Param("oBankName") String oBankName);

    // OAccountNo와 OBankName으로 OutAccountEntity를 조회하는 메서드 정의
    @Query("SELECT o FROM OutAccountEntity o WHERE o.oAccountNo = :oAccountNo AND o.oBankName = :oBankName")
    OutAccountEntity findByOAccountNoAndOBankName(@Param("oAccountNo") int oAccountNo, @Param("oBankName") String oBankName);


}
