package com.urambank.uram.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.urambank.uram.entities.User;
import lombok.*;

import java.sql.Date;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserDTO {
    private int userNo;
    private String userId;
    private String userPw;
    private String newUserPw;
    private String name;
    private Date birth;
    private String email;
    private String email1;
    private String email2;
    private String hp;
    private String address;
    private String address1;
    private String address2;
    private String residentNumber;
    private Date joinDate;
    private char state;
    private int idCheck;
    private int OCRCheck;
    private String token;
    private String refreshToken;
    private String expirationTime;
    private String message;
    private int statusCode;
    private User Userlist;
    private String USER_ROLE;
    private String residentNumber1;
    private String residentNumber2;
    private int grade;



}
