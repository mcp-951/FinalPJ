package com.ict03.urambank.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class OutAccountDTO {
    private int oAccountNo;
    private int oAccountNumber;
    private String oUserName;
    private String oAccountState;
    private String oBankName;
}
