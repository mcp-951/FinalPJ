package com.urambank.uram.dto;

import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class LoanDTO {
    private int loanNo;
    private String loanName;
    private float loanRate;
    private String loanContent;
    private char loanState;
}

