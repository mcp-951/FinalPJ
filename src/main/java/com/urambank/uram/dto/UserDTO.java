package com.urambank.uram.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.urambank.uram.entities.User;
import lombok.*;

import java.sql.Date;
import java.util.List;

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
    private String name;
    private Date birth;
    private String email;
    private String hp;
    private String address;
    private String residentNumber;
    private Date joinDate;
    private int ban;
    private int idCheck;
    private String OCRCheck;
    private String token;
    private String refreshToken;
    private String expirationTime;
    private String message;
    private int statusCode;
    private User Userlist;
    private String USER_ROLE;
    private String residentNumber1;
    private String residentNumber2;



}
