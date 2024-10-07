package com.ict03.urambank.dto;

import lombok.*;

import java.sql.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class UserDTO {
    private int userNo;
    private String userID;
    private String userEmail;
    private String userName;
    private int userRnum;
    private char OCRcheck;
    private Date userBirth;
    private String userHP;
    private String userAddress;
    private String userState;
    private Date userCreateDate;
    private Date lastAccess;
}
