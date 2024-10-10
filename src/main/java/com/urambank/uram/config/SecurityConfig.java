package com.urambank.uram.config;

import com.urambank.uram.util.JWTUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;


    private final JWTUtil jwtUtil;


    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration, JWTUtil jwtUtil) {
        this.authenticationConfiguration= authenticationConfiguration;
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }


    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // csrf 미적용
        http
                .csrf((auth) -> auth.disable());
        // cors filter 적용
        http
                .cors((cors) -> cors.configurationSource(CorsConfig.corsConfigurationSource()));
        // form 로그인 방식을 disable 함
        http
                .formLogin((auth) ->auth.disable());
        // http basic 방식을 disable 함
        http
                .httpBasic((auth) -> auth.disable());
        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/login", "/signup", "/findById/**", "/checkHp/**","/admin/login").permitAll()
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/uram/users/**").hasRole("USER") // 사용자 관련 경로 설정
                        .requestMatchers("/uram/product/**").hasRole("USER") // 제품 관련 경로 설정
                        .requestMatchers("/uram/account/**").hasRole("USER") // 계좌 관련 경로 설정
                        .requestMatchers("/uram/transfer").hasRole("USER") // 이체 관련 경로 설정
                        .requestMatchers("/uram/banks/**").hasRole("USER") // 외부 계좌 관련 경로 설정
                        .requestMatchers("/uram/auto-transfer/**").hasRole("USER") // 외부 계좌 관련 경로 설정
                        .anyRequest().authenticated());
        http
                .addFilterBefore(new JWTFilter(jwtUtil), LoginFilter.class);
        http
                .addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration),jwtUtil), UsernamePasswordAuthenticationFilter.class);

        http
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}
