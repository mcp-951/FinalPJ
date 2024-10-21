package com.urambank.uram.controller;

import com.urambank.uram.dto.AccountDTO;
import com.urambank.uram.dto.DepositDTO;
import com.urambank.uram.entities.*;
        import com.urambank.uram.service.DepositService;
import com.urambank.uram.util.JWTUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

        import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/products/deposits")

public class DepositController {

    private PasswordEncoder passwordEncoder;
    private final DepositService depositService;
    private JWTUtil jwtUtil;
    private DepositService emergencyWithdrawalService;

    @GetMapping("/page")
    public ResponseEntity<Page<DepositDTO>> getDepositProductsPaged(Pageable pageable) {
        Page<DepositDTO> depositProducts = depositService.getDepositProductsPaged(pageable);
        return ResponseEntity.ok(depositProducts);
    }

    @GetMapping("/findAccount")
    public ResponseEntity<List<Map<String, Object>>> getNormalAccountData(@RequestHeader("Authorization") String token) {
        String cleanToken = token.replace("Bearer ", "");
        List<Map<String, Object>> normalAccounts = depositService.getNormalAccountData(cleanToken);
        return ResponseEntity.ok(normalAccounts);
    }
    // 적금
    @PostMapping("/savings")
    public ResponseEntity<?> saveDepositJoin(
            @RequestBody Map<String, Object> depositJoinData,
            @RequestHeader("Authorization") String token) {

        String acNoStr = (String) depositJoinData.get("accountNo");
        Integer acNo = Integer.parseInt(acNoStr);  // String을 Integer로 변환
        System.out.println("accountNo :"+acNo);
        String detNoStr = (String) depositJoinData.get("depositNo");
        Integer detNo = Integer.parseInt(detNoStr);  // String을 Integer로 변환
        System.out.println("depositNo :"+detNo);

        DepositDTO dto = new DepositDTO();

        try {
            dto.setDepositBalance((int)depositJoinData.get("depositBalance"));
            dto.setDepositPeriod((int)depositJoinData.get("depositPeriod"));
            dto.setDepositPw((String)depositJoinData.get("depositPW"));
            dto.setDepositTransferDay((int)depositJoinData.get("depositTransferDay"));
            dto.setAccountNumber((String)depositJoinData.get("depositAccountNumber"));
            dto.setAccountNo(String.valueOf(acNo));
            dto.setDepositNo(detNo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null); // 잘못된 숫자 형식의 경우
        }

        String cleanToken = token.replace("Bearer ", "");
        String ok = depositService.saveDepositJoinWithStringValues(dto, cleanToken);
        return ResponseEntity.ok(ok);
    }

    @GetMapping("/findDeposit")
    public ResponseEntity<List<Map<String, Object>>> getDepositAccounts(@RequestHeader("Authorization") String token) {
        String cleanToken = token.replace("Bearer ", "");
        List<Map<String, Object>> depositAccounts = depositService.getUserDepositAccounts(cleanToken);
        return ResponseEntity.ok(depositAccounts);
    }

    // 정기예금가입
    @PostMapping("/deposit")
    public ResponseEntity<?> saveDeposit(
            @RequestBody Map<String, Object> depositJoinData,
            @RequestHeader("Authorization") String token) {

        String acNoStr = (String) depositJoinData.get("accountNo");
        Integer acNo = Integer.parseInt(acNoStr);  // String을 Integer로 변환
        System.out.println("accountNo :"+acNo);
        String detNoStr = (String) depositJoinData.get("depositNo");
        Integer detNo = Integer.parseInt(detNoStr);  // String을 Integer로 변환
        System.out.println("depositNo :"+detNo);

        DepositDTO dto = new DepositDTO();

        try {
            dto.setDepositBalance((int)depositJoinData.get("depositBalance"));
            System.out.println("bal :"+ dto.getDepositBalance());
            dto.setDepositPeriod((int)depositJoinData.get("depositPeriod"));
            System.out.println("period :"+ dto.getDepositPeriod());
            dto.setDepositPw((String)depositJoinData.get("depositPW"));
            System.out.println("depositPw :"+dto.getDepositPw());
            dto.setAccountNumber((String)depositJoinData.get("depositAccountNumber"));
            System.out.println("depositacNum :"+dto.getAccountNumber());
            dto.setAccountNo(String.valueOf(acNo));
            System.out.println("setAccountNo :"+dto.getAccountNo());
            dto.setDepositNo(detNo);
            System.out.println("detNo :"+dto.getDepositNo());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null); // 잘못된 숫자 형식의 경우
        }

        String cleanToken = token.replace("Bearer ", "");
        String ok = depositService.saveDeposit(dto, cleanToken);
        return ResponseEntity.ok(ok);
    }

    @PostMapping("/emergencyWithdraw")
    public ResponseEntity<String> handleEmergencyWithdrawal(
            @RequestBody Map<String, Object> request,
            @RequestHeader("Authorization") String token) {
        try {
            String accountNumber = (String) request.get("accountNumber");
            String targetAccountNumber = (String) request.get("targetAccountNumber");
            int amount = (int) request.get("amount");

            String cleanToken = token.replace("Bearer ", "");
            AccountDTO updatedAccount = depositService.processEmergencyWithdrawal(accountNumber, targetAccountNumber, amount, cleanToken);
            // 응답 메시지를 "ok"로 반환
            return ResponseEntity.ok("ok");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("긴급 출금 처리 중 오류가 발생했습니다.");
        }
    }
    // 입출금계좌
    @PostMapping("/ReceivedPaid")
    public ResponseEntity<?> ReceivedPaid(
            @RequestBody Map<String, Object> depositJoinData,
            @RequestHeader("Authorization") String token) {

        String detNoStr = (String) depositJoinData.get("depositNo");
        Integer detNo = Integer.parseInt(detNoStr);  // String을 Integer로 변환
        System.out.println("depositNo :"+detNo);

        DepositDTO dto = new DepositDTO();

        try {
            dto.setDepositPw((String)depositJoinData.get("depositPW"));
            System.out.println("depositPw :"+dto.getDepositPw());
            dto.setAccountNumber((String)depositJoinData.get("depositAccountNumber"));
            System.out.println("getAccountNumber :"+dto.getAccountNumber());
            dto.setDepositNo(detNo);
            System.out.println("detNo :"+ detNo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null); // 잘못된 숫자 형식의 경우
        }

        String cleanToken = token.replace("Bearer ", "");
        String ok = depositService.ReceivedPaid(dto, cleanToken);
        return ResponseEntity.ok(ok);
    }

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
