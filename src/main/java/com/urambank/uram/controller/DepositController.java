package com.urambank.uram.controller;

import com.urambank.uram.dto.DepositDTO;
import com.urambank.uram.entities.*;
import com.urambank.uram.service.DepositService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/products/deposits")
public class DepositController {

    private PasswordEncoder passwordEncoder;
    private final DepositService depositService;

    @GetMapping("/page")
    public Page<DepositEntity> getDepositProductsPaged(Pageable pageable) {
        return depositService.getDepositProductsPaged(pageable);
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveDepositJoin(
            @RequestBody Map<String, Object> depositData,
            @RequestHeader("Authorization") String token) {
        String acNo = (String) depositData.get("accountNo");
        System.out.println("accountNo :"+acNo);
        String deNo = (String) depositData.get("depositNo");   // 적금테이블의 고유번호(PK)
        int depositNo = Integer.parseInt(deNo);
        System.out.println("depositNo :"+depositNo);

        DepositDTO dto = new DepositDTO();

        try {
            dto.setDepositBalance((int)depositData.get("depositBalance"));
            dto.setDepositPeriod((int)depositData.get("depositPeriod"));
            dto.setDepositPw((String)depositData.get("depositPW"));
            dto.setDepositTransferDay((int)depositData.get("depositTransfer"));
            dto.setAccountNumber((String)depositData.get("depositAccountNumber"));
            dto.setAccountNo(acNo);
            dto.setDepositNo(depositNo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null); // 잘못된 숫자 형식의 경우
        }

        String cleanToken = token.replace("Bearer ", "");
        String ok = depositService.saveDepositJoinWithStringValues(dto, token);
        return ResponseEntity.ok(ok);
    }

//    @GetMapping("/account")
//    public List<AccountEntity> getNormalAccounts(@RequestHeader("Authorization") String token) {
//        // "Bearer " 접두사를 제거한 실제 토큰만 사용
//        String cleanToken = token.replace("Bearer ", "");
//        return depositService.getNormalAccounts(cleanToken);
//    }
//
//
//
//    // 중도해지 요청
//    @PostMapping("/terminate")
//    public ResponseEntity<String> terminateDeposit(@RequestBody Map<String, Integer> request, HttpServletRequest httpRequest) {
//        String token = httpRequest.getHeader("Authorization").substring(7); // "Bearer " 제거
//        int accountNo = request.get("accountNo");
//        String responseMessage = depositService.terminateDeposit(token, accountNo);
//        return ResponseEntity.ok(responseMessage);
//    }

    @GetMapping("/phone")
    public ResponseEntity<String> getUserPhoneNumber(@RequestHeader("Authorization") String token) {
        try {
            String cleanToken = token.replace("Bearer ", ""); // "Bearer " 제거하여 실제 토큰만 추출
            String phoneNumber = depositService.getUserPhoneNumber(cleanToken); // cleanToken 사용
            if (phoneNumber != null) {
                return ResponseEntity.ok(phoneNumber);
            } else {
                return ResponseEntity.status(404).body("User phone number not found.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }


}
