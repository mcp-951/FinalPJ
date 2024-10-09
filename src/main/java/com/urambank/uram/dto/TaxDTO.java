package com.urambank.uram.dto;

import lombok.*;

import java.sql.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class TaxDTO {
    private int taxNo;
    private int fee1;
    private int fee2;
    private int fee3;
    private int basicFee1;
    private int basicFee2;
    private int basicFee3;
    private char taxState;
    private Date taxDeadLine;
        private Date taxWriteDate;
    private int userNo;
}
