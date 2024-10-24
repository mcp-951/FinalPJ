package com.urambank.uram.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import jakarta.persistence.*;

import java.sql.Date;

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
    @Column(name = "qnaNo")
    private Integer qnaNo; // 문의 ID

    @Column(name = "userId")
    private Integer userId;

    @Column(name = "qnaTitle")
    private String qnaTitle;

    @Column(name = "message")
    private String message; // 문의 내용

    @Column(name = "answer")
    private String answer; // 답변 내용

    @Column(name = "status")
    private String status; // 답변 상태 ('답변 전', '답변 완료')

    @Column(name = "isDeleted")
    private String isDeleted;

    @Column(name = "createdAt")
    private Date createdAt;

    @Column(name = "answerDay")
    private Date answerDay; // 답변 일자
}
