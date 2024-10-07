package com.ict03.urambank.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.sql.Date;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "USER_TB")
public class UserEntity {
    @Id
    @Column
    private int userNo;

    @Column
    private String userID;

    @Column
    private String userEmail;

    @Column
    private String userName;

    @Column
    private int userRnum;

    @Column
    private char OCRcheck;

    @Column
    private Date userBirth;

    @Column
    private String userHP;

    @Column
    private String userAddress;

    @Column
    private String userState;

    @Column
    private Date userCreateDate;

    @Column
    private Date lastAccess;
}
