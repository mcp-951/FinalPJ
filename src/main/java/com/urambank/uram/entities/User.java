package com.urambank.uram.entities;

// 유저의 정보를 담고 데이터 베이스와 통신하기 위한 클래스

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;

import java.sql.Date;
import java.util.Collection;

@Table(name="userInfo")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userNo;

    @Column(unique = true, length = 100, nullable = false)
    private String userId;

    @Column(length = 100, nullable = false, unique = false)
    private String userPw;

    @Column(length = 10, nullable = false, unique = false)
    private String name;

    @Column(length = 100, nullable = false, unique = false)
    private Date birth;

    @Column(length = 100, nullable = false, unique = false)
    private String hp;

    @Column(length = 100, nullable = false, unique = false)
    private String email;

    @Column(length = 100, nullable = false, unique = false)
    private String address;

    @Column(length = 100, nullable = true, unique = false)
    private Date joinDate;

    @Column(length = 100, nullable = true, unique = false)
    private int ban;

    @Column(length = 100, nullable = true, unique = false)
    private int OCRCheck;

    @Column(length = 20, nullable = false, unique = false)
    private String user_role;

    @Column(length = 100, nullable = false, unique = false)
    private String residentNumber;

    @Builder
    public User(int userNo, String userId, String userPw, String name, Date birth, String hp, String email, Date joinDate, int ban, int ocrCheck) {
        this.userNo = userNo;
        this.userId = userId;
        this.userPw = userPw;
        this.name = name;
        this.birth = birth;
        this.hp = hp;
        this.email = email;
        this.joinDate = joinDate;
        this.ban = ban;
        this.OCRCheck = ocrCheck;
    }


    public User(String subject, String s, Collection<? extends GrantedAuthority> authorities) {
    }
}
