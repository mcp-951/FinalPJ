package com.urambank.uram.repository;

import com.urambank.uram.entities.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;


public class CustomUserDetails implements UserDetails {


    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    // userNo를 반환하는 메서드 추가
    public int getUserNo() {
        return user.getUserNo(); // User 객체에서 userNo를 가져와 반환
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        Collection<GrantedAuthority> collection = new ArrayList<>();

        collection.add(new GrantedAuthority() {

            @Override
            public String getAuthority() {

                return user.getUserRole();
            }
        });

        return collection;
    }


    public String getName(){
        return user.getName();
    }

    @Override
    public String getPassword() {

        return user.getUserPw();
    }

    @Override
    public String getUsername() {

        return user.getUserId();
    }


    @Override
    public boolean isAccountNonExpired() {

        return true;
    }

    @Override
    public boolean isAccountNonLocked() {

        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {

        return true;
    }

    @Override
    public boolean isEnabled() {

        return true;
    }
}