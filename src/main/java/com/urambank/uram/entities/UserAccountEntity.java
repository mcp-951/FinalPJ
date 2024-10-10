package com.urambank.uram.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "ACCOUNT_TB")
public class UserAccountEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int accountNo;       // 계좌 번호 (PK)

    @Column(nullable = false)
    private String accountNumber;   // 계좌 번호

    @ManyToOne(fetch = FetchType.LAZY) // 사용자와 다대일 관계, 지연 로딩
    @JoinColumn(name = "userNo", nullable = false)
    private User user;           // 사용자 (FK)

    @ManyToOne(fetch = FetchType.LAZY) // 상품과 다대일 관계, 지연 로딩
    @JoinColumn(name = "productNo", nullable = false)
    private ProductEntity product; // 상품 (FK)

    @Column(nullable = false)
    private int accountBalance;  // 계좌 잔액

    @Column(nullable = false)
    private int accountLimit;    // 계좌 한도

    @Column(nullable = false)
    private int accountMax;      // 최대 금액

    @Column(nullable = false)
    private String accountPW;       // 계좌 비밀번호

    @Column(nullable = false, length = 10)
    private String accountState; // 계좌 상태 (기본값 'NORMAL')

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date accountOpen;    // 계좌 개설일

    @Column(nullable = false, length = 50)
    private String bankName;     // 은행 이름 (기본값 '우람은행')


}
