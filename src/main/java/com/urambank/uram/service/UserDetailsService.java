package com.urambank.uram.service;

import com.urambank.uram.entities.User;
import com.urambank.uram.repository.CustomUserDetails;
import com.urambank.uram.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {

        //DB에서 조회 (리포지토리)
        User userData = userRepository.findByUserId(userId);

        if (userData != null) {
            if(userData.getState() == 'y'){
                //UserDetails에 담아서 return하면 AutneticationManager가 검증 함
                return new CustomUserDetails(userData);
            }else if(userData.getState() == 'n'){
                //정지된 회원 - UserDetails에 null 담아서 return
                return new CustomUserDetails(null);
            }else{
                //탈퇴한 회원 - UserDetails에 null 담아서 return
                return new CustomUserDetails(null);
            }
        }
        return new CustomUserDetails(userData);
    }
}
