package com.urambank.uram.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RequestPayload {
    private LoanDTO loanDTO;
    private AutoTransferDTO autoTransferDTO;
}
