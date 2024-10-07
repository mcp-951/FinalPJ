package com.urambank.uram.dto;

import lombok.*;

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
}
