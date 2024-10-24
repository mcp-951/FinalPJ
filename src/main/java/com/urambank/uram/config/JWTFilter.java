package com.urambank.uram.config;

import com.urambank.uram.entities.User;
import com.urambank.uram.repository.CustomUserDetails;
import com.urambank.uram.util.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JWTFilter extends OncePerRequestFilter {
    private final JWTUtil jwtUtil;
    public JWTFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }
    @Override
    protected void doFilterInternal(@NotNull HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //request에서 Authorization 헤더를 찾음
        String authorization= request.getHeader("Authorization");
        // 필터 타지 않도록 설정
        if (request.getRequestURI().equals("/findById/**")) {
            filterChain.doFilter(request, response);
            return;
        }
        if (request.getRequestURI().equals("/loan/list")) {
            filterChain.doFilter(request, response);
            return;
        }
        if (request.getRequestURI().equals("/loan/detail/**")) {
            filterChain.doFilter(request, response);
            return;
        }
        if (request.getRequestURI().equals("/signup")) {
            filterChain.doFilter(request, response);
            return;
        }
        if (request.getRequestURI().equals("/ocr/upload")) {
            filterChain.doFilter(request, response);
            return;
        }
        if (request.getRequestURI().equals("/checkHp/**")) {
            filterChain.doFilter(request, response);
            return;
        }
        if (request.getRequestURI().equals("/adminLogin")) {
            filterChain.doFilter(request, response);
            return;
        }
        if (request.getRequestURI().equals("/kakaoLogin?**")) {
            filterChain.doFilter(request, response);
            return;
        }
        if (request.getRequestURI().equals("/loans/page")) {
            filterChain.doFilter(request, response);
            return;
        }
        if (request.getRequestURI().equals("/doKakaoLogin/**")) {
            filterChain.doFilter(request, response);
            return;
        }
        if (request.getRequestURI().equals("/findUserId")) {
            filterChain.doFilter(request, response);
            return;
        }
        if (request.getRequestURI().equals("/resetPassword")) {
            filterChain.doFilter(request, response);
            return;
        }
        //Authorization 헤더 검증 시작
        //Authorization 인증 없을경우
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            System.out.println("token null");
            filterChain.doFilter(request, response);
            //조건이 해당되면 메소드 종료 (필수)
            return;
        }
        // Authorization 인증 있을경우
        System.out.println("authorization now");
        //Bearer 부분 제거 후 순수 토큰만 획득
        String token = authorization.split(" ")[1];
        //토큰 소멸 시간 검증
        if (jwtUtil.isExpired(token)) {
            System.out.println("token expired");
            filterChain.doFilter(request, response);
            //조건이 해당되면 메소드 종료 (필수)
            return;
        }
        //토큰에서 username과 role 획득
        String username = jwtUtil.getUsername(token);
        String role = jwtUtil.getRole(token);
        System.out.println(role);

        //userEntity를 생성하여 값 set
        User userEntity = new User();
        userEntity.setUserId(username);
        userEntity.setUserPw("temppassword");
        userEntity.setUserRole(role);

        //UserDetails에 회원 정보 객체 담기
        CustomUserDetails customUserDetails = new CustomUserDetails(userEntity);
        //스프링 시큐리티 인증 토큰 생성
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
        //세션에 사용자 등록
        SecurityContextHolder.getContext().setAuthentication(authToken);
        // 필터 종료
        filterChain.doFilter(request, response);
    }
}
