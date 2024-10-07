package com.urambank.uram.config;

import com.urambank.uram.util.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private final AuthenticationConfiguration authenticationConfiguration;

    @Autowired
    private JWTUtil jwtUtil;


    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration) {
        this.authenticationConfiguration= authenticationConfiguration;
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
        http
                .csrf((auth) -> auth.disable());
        // form 로그인 방식을 disable 함
        http
                .formLogin((auth) ->auth.disable());
        // http basic 방식을 disable 함
        http
                .httpBasic((auth) -> auth.disable());
        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/login", "/signup", "/findById/**", "/checkHp/**","/exchange/**","/exchangeList/**","/asset-calendar/**").permitAll()
                        .requestMatchers("/admin").hasRole("ADMIN")
                        .anyRequest().authenticated());
        http
                .addFilterAfter(new JWTFilter(jwtUtil), LoginFilter.class);
        http
                .addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration),jwtUtil), UsernamePasswordAuthenticationFilter.class);

        http
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}
