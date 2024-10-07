package com.urambank.uram.controller;

import com.urambank.uram.dto.AccountDTO;
import com.urambank.uram.dto.LogDTO;
import com.urambank.uram.dto.OutAccountDTO;
import com.urambank.uram.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/uram")
@RestController
public class AccountController {

    private final AccountService accountService;


    // 'NORMAL' 상태의 전체 계좌 리스트 조회
    @GetMapping("/account")
    public ResponseEntity<List<Map<String, Object>>> accountList() {
        try {
            List<Map<String, Object>> accounts = accountService.getAllAccountWithProductName();
            if (accounts.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);  // 데이터가 없을 경우 204 처리
            }
            return ResponseEntity.ok(accounts);  // 정상 처리
        } catch (Exception e) {
            e.printStackTrace();  // 예외 로그 기록
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 서버 오류 처리
        }
    }

    // 'NORMAL' 상태의 productNo로 계좌 조회
    @GetMapping("/product/{productNo}")
    public ResponseEntity<List<AccountDTO>> categoryList(@PathVariable("productNo") int productNo) {
        try {
            List<AccountDTO> accountList = accountService.listCategory(productNo);
            if (accountList.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);  // 데이터가 없을 경우 204 처리
            }
            return ResponseEntity.ok(accountList);  // 정상 처리
        } catch (Exception e) {
            e.printStackTrace();  // 예외 로그 기록
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 서버 오류 처리
        }
    }

    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<Map<String, Object>> getAccountDetail(@PathVariable("accountNumber") int accountNumber) {
        try {
            Map<String, Object> accountDetail = accountService.getAccountDetail(accountNumber);
            if (accountDetail != null) {
                return ResponseEntity.ok(accountDetail);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();  // 예외 로그 기록
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 서버 오류 처리
        }
    }


    // 계좌 거래 내역 조회 (정상 거래만)
    @GetMapping("/account/{accountNumber}/logs")
    public ResponseEntity<List<LogDTO>> getTransactionLogs(@PathVariable("accountNumber") int accountNumber) {
        try {
            List<LogDTO> logs = accountService.getTransactionLogs(accountNumber);
            if (logs.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);  // 데이터가 없을 경우 204 처리
            }
            return ResponseEntity.ok(logs);  // 정상 처리
        } catch (Exception e) {
            e.printStackTrace();  // 예외 로그 기록
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 서버 오류 처리
        }
    }


    // 계좌 비밀번호 확인
    @PostMapping("/account/{accountNumber}/check-password")
    public ResponseEntity<String> checkAccountPassword(@PathVariable("accountNumber") int accountNumber, @RequestBody Map<String, Integer> request) {
        try {
            Integer inputPassword = request.get("password");

            if (inputPassword == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("비밀번호 누락");
            }

            boolean isPasswordCorrect = accountService.checkAccountPassword(accountNumber, inputPassword);

            if (isPasswordCorrect) {
                return ResponseEntity.ok("비밀번호 일치");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호 불일치");
            }
        } catch (Exception e) {
            e.printStackTrace();  // 예외 로그 기록
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류");
        }
    }

    // 계좌 비밀번호 변경
    @PostMapping("/account/{accountNumber}/change-password")
    public ResponseEntity<String> changeAccountPassword(@PathVariable("accountNumber") int accountNumber, @RequestBody Map<String, Integer> request) {
        try {
            Integer newPassword = request.get("newPassword");

            if (newPassword == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("새로운 비밀번호 누락");
            }

            boolean isPasswordChanged = accountService.changeAccountPassword(accountNumber, newPassword);

            if (isPasswordChanged) {
                return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("비밀번호 변경에 실패했습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();  // 예외 로그 기록
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류");
        }
    }

    // 이체한도 변경
    @PostMapping("/account/{accountNumber}/change-limits")
    public ResponseEntity<String> changeTransferLimits(@PathVariable("accountNumber") int accountNumber, @RequestBody Map<String, Integer> limits) {
        try {
            Integer newDailyLimit = limits.get("dailyLimit");  // 1일 이체한도
            Integer newOnceLimit = limits.get("onceLimit");    // 1회 이체한도

            if (newDailyLimit == null || newOnceLimit == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이체 한도 누락");
            }

            boolean isLimitChanged = accountService.changeTransferLimits(accountNumber, newDailyLimit, newOnceLimit);

            if (isLimitChanged) {
                return ResponseEntity.ok("이체 한도가 성공적으로 변경되었습니다.");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이체 한도 변경에 실패했습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();  // 예외 로그 기록
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류");
        }
    }


    @PostMapping("/transfer")
    public ResponseEntity<Map<String, Object>> transferAccount(@RequestBody Map<String, Object> transferData) {
        try {
            int fromAccountNumber = Integer.parseInt(transferData.get("fromAccountNumber").toString());
            int toAccountNumber = Integer.parseInt(transferData.get("toAccountNumber").toString());
            int transferAmount = Integer.parseInt(transferData.get("transferAmount").toString());
            int password = Integer.parseInt(transferData.get("password").toString());
            String toBankName = transferData.get("toBankName").toString(); // 외부 계좌의 은행 이름

            // 이체 한도 확인
            Map<String, Object> fromAccountData = accountService.getAccountDetail(fromAccountNumber);
            if (fromAccountData == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("message", "출금 계좌가 존재하지 않습니다."));
            }

            int accountLimit = (int) fromAccountData.get("accountLimit");
            if (transferAmount > accountLimit) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("message", "이체 금액이 1회 이체 한도를 초과합니다."));
            }

            // 이체 수행
            boolean isSuccess = accountService.transferAccount(fromAccountNumber, toAccountNumber, transferAmount, password, toBankName);

            if (isSuccess) {
                String recipientName = accountService.getRecipientName(toAccountNumber, toBankName);
                Map<String, Object> response = new HashMap<>();
                response.put("message", "이체가 성공적으로 완료되었습니다.");
                response.put("recipientName", recipientName);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("message", "이체 중 오류가 발생했습니다."));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("message", "서버 오류로 인해 이체가 실패했습니다."));
        }
    }






    // 거래 내역 확인 API (추가 예시)
    @GetMapping("/account/{accountNumber}/transaction-history")
    public ResponseEntity<List<LogDTO>> getAccountTransactionHistory(@PathVariable("accountNumber") int accountNumber) {
        try {
            List<LogDTO> logs = accountService.getTransactionLogs(accountNumber);
            if (logs.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
            }
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            e.printStackTrace();  // 예외 로그 기록
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 서버 오류 처리
        }
    }

    @GetMapping("/banks/{bankName}/accounts/{accountNumber}")
    public ResponseEntity<List<OutAccountDTO>> getOutAccountList() {
        try {
            List<OutAccountDTO> outAccounts = accountService.getAllNormalOutAccounts();
            if (outAccounts.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(outAccounts);
        } catch (Exception e) {
            e.printStackTrace();  // 예외 로그 기록
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 서버 오류 처리
        }
    }

    // 계좌와 은행명으로 계좌 유효성 확인
    @GetMapping("/account/validate")
    public ResponseEntity<Boolean> validateAccountNumber(
            @RequestParam("accountNumber") int accountNumber,
            @RequestParam("bankName") String bankName) {
        try {
            boolean isValid = accountService.validateAccountNumberWithBank(accountNumber, bankName);
            return ResponseEntity.ok(isValid);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        }
    }


}
