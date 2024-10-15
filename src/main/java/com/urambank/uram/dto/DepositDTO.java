package com.urambank.uram.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class DepositDTO {
    private int depositNo;
    private String depositName;
    private float depositRate;
    private String depositContent;
    private int depositCategory;
    private char depositState;
}
