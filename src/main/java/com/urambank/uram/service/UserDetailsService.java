package com.urambank.uram.service;

import com.urambank.uram.entities.User;
import com.urambank.uram.repository.CustomUserDetails;
import com.urambank.uram.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public UserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {

        // DB에서 조회 (리포지토리)
        Optional<User> userOptional = Optional.ofNullable(userRepository.findByUserId(userId));

        // User가 존재하지 않으면 UsernameNotFoundException 예외 던지기
        User userData = userOptional
                .orElseThrow(() -> new UsernameNotFoundException("User not found with userId: " + userId));

        // UserDetails에 담아서 반환 (AuthenticationManager가 검증 수행)
        return new CustomUserDetails(userData);
    }
}
