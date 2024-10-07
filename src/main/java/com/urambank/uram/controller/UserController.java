package com.urambank.uram.controller;


import com.urambank.uram.dto.UserDTO;
import com.urambank.uram.service.UserService;
import jakarta.servlet.ServletException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
@CrossOrigin(origins = "http:/localhost:3000")
@RestController
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    //id 중복조회
    @GetMapping("/findById/{userId}")
    public String findById(@PathVariable("userId") String userId) throws ServletException, IOException {
        logger.info("<<< findById >>>");
        System.out.println("userId : " + userId);
        return userService.findByUserId(userId);
    }

    @PostMapping("/signup")
    public ResponseEntity<UserDTO> register(@RequestBody UserDTO dto){
        logger.info("<<< signUp >>>");
        return ResponseEntity.ok(userService.register(dto));
    }

    @GetMapping("/checkHp/{hp}")
    public int checkHp(@PathVariable("hp") String hp){
        logger.info("<<< checkHp >>>");
        return userService.checkHp(hp);
    }

    @GetMapping("/Ace")
    public int Ace(){
        return 123;
    }

//    @PostMapping("/refresh")
//    public ResponseEntity<UserDTO> refreshToken(@RequestBody UserDTO dto){
//        return ResponseEntity.ok(userService.refreshToken(dto));
//    }

}
