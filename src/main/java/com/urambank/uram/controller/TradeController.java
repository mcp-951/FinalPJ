package com.urambank.uram.controller;

import com.urambank.uram.entities.PickUpPlaceEntity;
import com.urambank.uram.service.TradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TradeController {

    @Autowired
    private TradeService tradeService;

    // 1. userId로 userNo 가져오기
    @GetMapping("/exchange/{userId}")
    public ResponseEntity<Integer> getUserNoByUserId(@PathVariable(value = "userId") String userId) {
        int userNo = tradeService.getUserNoByUserId(userId);
        System.out.println(userNo);
        return ResponseEntity.ok(userNo);
    }

    // 2. userNo로 accountNo 가져오기
    @GetMapping("/account-no")
    public ResponseEntity<Integer> getAccountNoByUserNo(@RequestParam int userNo) {
        int accountNo = tradeService.getAccountNoByUserNo(userNo);
        return ResponseEntity.ok(accountNo);
    }

    // 3. accountNo로 accountNumber 가져오기
    @GetMapping("/account-number")
    public ResponseEntity<Integer> getAccountNumberByAccountNo(@RequestParam int accountNo) {
        int accountNumber = tradeService.getAccountNumberByAccountNo(accountNo);
        return ResponseEntity.ok(accountNumber);
    }

    // 4. 모든 지점 정보 가져오기
    @GetMapping("/pickup-places")
    public ResponseEntity<List<PickUpPlaceEntity>> getAllPickUpPlaces() {
        List<PickUpPlaceEntity> pickUpPlaces = tradeService.getAllPickUpPlaces();
        return ResponseEntity.ok(pickUpPlaces);
    }

    // 5. userId와 입력한 비밀번호 검증
    @PostMapping("/verify-password")
    public ResponseEntity<Boolean> verifyUserPassword(@RequestParam String userId, @RequestParam String inputPassword) {
        boolean isValid = tradeService.verifyUserPassword(userId, inputPassword);
        return ResponseEntity.ok(isValid);
    }
}
