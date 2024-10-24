package com.urambank.uram.controller;

import com.urambank.uram.dto.UserDTO;
import com.urambank.uram.service.KakaoService;
import com.urambank.uram.service.UserService;
import jakarta.servlet.ServletException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@CrossOrigin(origins="http://localhost:3000")
@RestController
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    private final KakaoService kakaoService;

    public UserController(UserService userService, KakaoService kakaoService) {
        super();
        this.userService = userService;
        this.kakaoService = kakaoService;
    }

    //id 중복조회
    @GetMapping("/findById/{userId}")
    public String findById(@PathVariable("userId") String userId) throws ServletException, IOException {
        logger.info("<<< findById >>>");
//        System.out.println("userId : " + userId);
        return userService.findByUserId(userId);
    }

    //회원가입
    @PostMapping("/signup")
    public ResponseEntity<UserDTO> register(@RequestBody UserDTO dto){
        logger.info("<<< signUp >>>");
        return ResponseEntity.ok(userService.register(dto));
    }

    //핸드폰 인증
    @GetMapping("/checkHp/{hp}")
    public int checkHp(@PathVariable("hp") String hp){
        logger.info("<<< checkHp >>>");
        return userService.checkHp(hp);
    }

    // 카카오 연동 로그인
    @GetMapping("/doKakaoLogin/{code}")
    public ResponseEntity<?> kakaoLogin(@PathVariable("code") String code){
        logger.info("<<< kakaoLogin >>>");
        String userId = kakaoService.getAccessTokenFromKakao(code);
        return ResponseEntity.ok(userId);
    }
    // 아이디 찾기
    @GetMapping("/findUserId")
    public ResponseEntity<?> findUserId(@RequestParam String name, @RequestParam String hp) {
        logger.info("<<< findUserId >>>");
        logger.info("name : " + name);
        logger.info("hp : " + hp);

        String userId = userService.findUserId(name, hp); // 서비스 호출
        return ResponseEntity.ok(userId); // 찾은 userId 반환
    }
    // 비밀번호 찾기 - 비밀번호 재설정
    @PutMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(@RequestBody UserDTO userdto) {
        logger.info("<<< resetPassword >>>");
        System.out.println("userPw :" + userdto.getUserPw());

        String userPw = userService.resetPassword(userdto); // 서비스 호출
        return ResponseEntity.ok(userPw);
    }
    // 마이페이지 정보 가져오기
    @GetMapping("/getUserInfo/{userNo}")
    public ResponseEntity<?> getUserInfo(@PathVariable("userNo") int userNo) {
        logger.info("<<< getUserInfo >>>");
        logger.info("userNo : " + userNo);

        UserDTO dto = userService.getUserInfo(userNo); // 서비스 호출
        return ResponseEntity.ok(dto); // 찾은 userId 반환
    }
    // 비밀번호 재설정
    @PutMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody UserDTO userdto) {
        logger.info("<<< changePassword >>>");
        logger.info("userNo : " + userdto.getUserNo());
        logger.info("userPw : " + userdto.getUserPw());
        logger.info("newUserPw : " + userdto.getNewUserPw());

        return ResponseEntity.ok(userService.changePassword(userdto.getUserNo(),userdto.getUserPw(),userdto.getNewUserPw()));
    }
}
