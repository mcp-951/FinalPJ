package com.urambank.uram.entities;

// 유저의 정보를 담고 데이터 베이스와 통신하기 위한 클래스

import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;

@Table(name="userInfo")
@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userNo;

    @Column(unique = true, length = 100, nullable = false)
    private String userId;

    @Column(length = 100, nullable = true, unique = false)
    private String userPw;

    @Column(length = 10, nullable = true, unique = false)
    private String name;

    @Column(length = 100, nullable = true, unique = false)
    private Date birth;

    @Column(length = 100, nullable = true, unique = false)
    private String hp;

    @Column(length = 100, nullable = true, unique = false)
    private String email;

    @Column(length = 100, nullable = true, unique = false)
    private String address;

    @Column(length = 100, nullable = true, unique = false)
    private Date joinDate;

    @Column(length = 100, nullable = true, unique = false)
    private char state;

    @Column(length = 100, nullable = true, unique = false)
    private int OCRCheck;

    @Column(name = "user_role",length = 20, nullable = true, unique = false)
    private String userRole;

    @Column(length = 100, nullable = true, unique = false)
    private String residentNumber;

    @Column(length = 1)
    private int grade;

    @Builder
    public User(int userNo, String userId, String userPw, String name, Date birth, String hp, String email, Date joinDate, char state, int ocrCheck, int grade) {
        this.userNo = userNo;
        this.userId = userId;
        this.userPw = userPw;
        this.name = name;
        this.birth = birth;
        this.hp = hp;
        this.email = email;
        this.joinDate = joinDate;
        this.state = state;
        this.OCRCheck = ocrCheck;
        this.grade = grade;
    }


}
