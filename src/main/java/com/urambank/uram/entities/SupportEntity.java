package com.urambank.uram.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Support_TB")  // 데이터베이스의 실제 테이블 이름과 맞춰 사용
public class SupportEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer qnaNo; // 문의 ID

    @Column(nullable = false)
    private Integer userNo; // 사용자 ID

    @Column(nullable = false, length = 255)
    private String qnaTitle; // 문의 제목

    @Lob
    @Column(nullable = false)
    private String message; // 문의 내용

    @Lob
    private String answer; // 답변 내용 (기본값 null)

    @Column(length = 255)
    private String file; // 파일 경로 또는 파일명 (파일 업로드 시 이 필드를 사용)

    @Column(length = 10, nullable = false)
    private String status; // 답변 상태 (기본값 "답변전")

    @Column(nullable = false)
    private LocalDateTime createdAt; // 문의 생성 시 기본값

    private LocalDateTime answerDay; // 답변 일자 (기본값 null)

    // 기본 생성자: 기본값 설정을 생성자에서 처리
    public SupportEntity() {
        this.status = "답변전";           // 문의글 등록 시 초기 상태는 "답변전"
        this.createdAt = LocalDateTime.now();  // 문의글 등록 시 현재 시간으로 설정
    }

    // Getter 및 Setter 메서드
    public Integer getQnaNo() {
        return qnaNo;
    }

    public void setQnaNo(Integer qnaNo) {
        this.qnaNo = qnaNo;
    }

    public Integer getUserNo() {
        return userNo;
    }

    public void setUserNo(Integer userNo) {
        this.userNo = userNo;
    }

    public String getQnaTitle() {
        return qnaTitle;
    }

    public void setQnaTitle(String qnaTitle) {
        this.qnaTitle = qnaTitle;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getAnswerDay() {
        return answerDay;
    }

    public void setAnswerDay(LocalDateTime answerDay) {
        this.answerDay = answerDay;
    }
}
