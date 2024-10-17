package com.urambank.uram.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "SUPPORT_TB")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class SupportEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer qnaNo; // 문의 ID

    @Column(name = "userId", nullable = false)
    private Integer userId; // 사용자 ID (외래키)

    @Column(name = "qnaTitle", nullable = false, length = 255)
    private String qnaTitle; // 문의 제목

    @Column(name = "message", columnDefinition = "TEXT", nullable = false)
    private String message; // 문의 내용

    @Column(name = "answer", columnDefinition = "TEXT")
    private String answer; // 답변 내용

    @Column(name = "status", nullable = false)
    private String status; // 답변 상태 ('답변 전', '답변 완료')

    @Builder.Default
    @Column(name = "isDeleted", length = 1, nullable = false)
    private String isDeleted = "N"; // 삭제 상태 ('N': 미삭제, 'Y': 삭제)

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "createdAt", nullable = false)
    private LocalDateTime createdAt; // 문의 일자

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "answerDay")
    private LocalDateTime answerDay; // 답변 일자

    // 엔터티 저장 전 기본값 설정
    @PrePersist
    public void prePersist() {
        this.createdAt = this.createdAt == null ? LocalDateTime.now() : this.createdAt;
        this.status = this.status == null ? "답변 전" : this.status;
    }
}
