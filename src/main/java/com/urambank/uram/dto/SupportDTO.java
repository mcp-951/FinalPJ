package com.urambank.uram.dto;

import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class SupportDTO {
    private Integer qnaNo;
    private int userId;
    private String qnaTitle;
    private String message;
    private String answer;
    private String status;
    private String isDeleted;
    private LocalDateTime createdAt;
    private LocalDateTime answerDay;
}
