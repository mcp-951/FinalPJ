package com.urambank.uram.entities;

import jakarta.persistence.*;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
@Builder
@Table(name = "SUPPORT_TB")  // 데이터베이스의 실제 테이블 이름과 맞춰 사용
public class SupportEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer qnaNo; // 문의 ID

    @Column(nullable = false)
    private Integer userId; // 사용자 ID

    @Column(nullable = false, length = 255)
    private String qnaTitle; // 문의 제목

    @Lob
    @Column(nullable = false)
    private String message; // 문의 내용

    @Lob
    private String answer; // 답변 내용 (기본값 null)

    @Column(length = 10, nullable = false)
    private String status; // 답변 상태 (기본값 "답변전")

    @Column(nullable = false)
    private LocalDateTime createdAt; // 문의 생성 시 기본값

    @Column
    private LocalDateTime answerDay; // 답변 일자 (기본값 null)

    @Column
    private int userNo;


}
