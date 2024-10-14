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
    private Integer userId;
    private String qnaTitle;
    private String message;
    private String file;
    private LocalDateTime createdAt;
    private String answer;
    private String status;
    private LocalDateTime answerDay;
}
