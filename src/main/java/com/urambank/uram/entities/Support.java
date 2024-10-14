package com.urambank.uram.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "support")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Support {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer qnaNo;

    @Column(name = "userId", nullable = false)
    private Integer userId;

    @Column(name = "qnaTitle", nullable = false, length = 255)
    private String qnaTitle;

    @Column(name = "message", columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "file")
    private String file;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "createdAt", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "answer", columnDefinition = "TEXT")
    private String answer;

    @Column(name = "status", nullable = false)
    private String status;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "answerDay")
    private LocalDateTime answerDay;

    @PrePersist
    public void prePersist() {
        this.createdAt = this.createdAt == null ? LocalDateTime.now() : this.createdAt;
        this.status = this.status == null ? "답변 전" : this.status;
    }
}
