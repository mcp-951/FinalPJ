package com.urambank.uram.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoanDTO {
    private int loanNo;
    private String loanName;
    private float loanRate;
    private String loanContent;
    private char loanState;
}
