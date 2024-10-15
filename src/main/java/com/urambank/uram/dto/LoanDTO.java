package com.urambank.uram.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class LoanDTO {
    private int loanNo;
    private String loanName;
    private float loanRate;
    private String loanContent;
    private char loanState;
}

