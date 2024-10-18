package com.urambank.uram.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.*;

import java.sql.Date;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class SupportDTO {
    private Integer qnaNo; // 문의 ID
    private Integer userId;
    private String qnaTitle;
    private String message; // 문의 내용
    private String answer; // 답변 내용
    private String status; // 답변 상태 ('답변 전', '답변 완료')
    private String isDeleted;
    private Date createdAt;
    private Date answerDay; // 답변 일자
}
