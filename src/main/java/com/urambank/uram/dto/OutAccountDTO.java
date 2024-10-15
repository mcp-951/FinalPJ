package com.urambank.uram.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class OutAccountDTO {
    private int oAccountNo;
    private String oAccountNumber;
    private String oUserName;
    private String oAccountState;
    private String oBankName;
}
