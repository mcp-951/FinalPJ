package com.urambank.uram.entities;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "ADMIN_TB")
public class AdminEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // 자동 증가 설정
    @Column
    private int adminNo;

    @Column
    private String adminID;

    @Column
    private String adminPW;

    @Column
    private String adminName;

    @Column
    private String ROLE; // 관리자 권한 필드

    @Column
    private char stateView; // 상태 표시 필드

    @Column
    private String lastAction; // 마지막 작업 기록 필드 추가

    @Column
    private Timestamp lastLogin; // 마지막 로그인 시간 필드 추가
}
