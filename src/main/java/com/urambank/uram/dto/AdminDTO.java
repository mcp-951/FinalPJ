package com.urambank.uram.dto;

import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class AdminDTO {
    private int adminNo;
    private String adminID;
    private String adminPW;
    private String adminName;
    private String ROLE;        // 관리자 권한
    private char stateView;     // 상태 표시
    private String lastAction;  // 마지막 작업 기록 추가
    private Timestamp lastLogin; // 마지막 로그인 시간 추가
}
