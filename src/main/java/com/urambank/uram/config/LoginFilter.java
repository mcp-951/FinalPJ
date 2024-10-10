package com.urambank.uram.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.urambank.uram.dto.TokenDTO;
import com.urambank.uram.repository.CustomUserDetails;
import com.urambank.uram.util.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;

    private final JWTUtil jwtUtil;

    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        try {
            // JSON 형식으로 데이터를 받음
            BufferedReader reader = request.getReader();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }

            // JSON 파싱
            String body = sb.toString();
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, String> jsonRequest = objectMapper.readValue(body, Map.class);

            String userId = jsonRequest.get("userId");
            String userPw = jsonRequest.get("userPw");

            System.out.println("userId : " + userId);
            System.out.println("userPw : " + userPw);



            // 인증 토큰 생성
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userId, userPw, null);

            return authenticationManager.authenticate(authToken);

        } catch (IOException e) {
            throw new AuthenticationException("Failed to read request body") {};
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException {
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        String username = customUserDetails.getUsername();
        int userNo = customUserDetails.getUserNo(); // userNo 가져오기
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String role = authorities.iterator().next().getAuthority();
        System.out.println("Role: " + role);
        System.out.println("UserNo: " + userNo);

        // 만료 시간 (30분)
        long tokenValidity = 30 * 60 * 1000L; // 30분을 밀리초로 설정

        // JWT 토큰 생성 (username과 role만 포함)
        String token = jwtUtil.createJwt(username, role, tokenValidity);

        // 응답 헤더에 토큰을 추가
        response.addHeader("Authorization", "Bearer " + token);

        // JSON 객체 직접 생성
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("accessToken", token);
        responseBody.put("userNo", userNo); // userNo 추가

        // 응답을 JSON 형식으로 설정
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // ObjectMapper를 이용해 JSON 응답
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonResponse = objectMapper.writeValueAsString(responseBody);

        // 응답 본문에 accessToken과 userNo를 JSON 형식으로 추가
        response.getWriter().write(jsonResponse);
    }




    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("Authentication Failed: " + failed.getMessage());  // 실패 메시지 추가
    }
}
