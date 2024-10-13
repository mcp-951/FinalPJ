package com.urambank.uram.controller;

import com.urambank.uram.dto.AccountDTO;
import com.urambank.uram.dto.AutoTransferDTO;
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

//    @GetMapping("/users/{userNo}/accounts")
//    public ResponseEntity<Map<String, Object>> accountList(@PathVariable("userNo") int userNo) {
//        try {
//            // 사용자 이름 가져오기
//            String userName = accountService.getUserNameByUserNo(userNo);
//
//            // 계좌 목록 가져오기
//            List<Map<String, Object>> accounts = accountService.getAllAccountWithProductName(userNo);
//            if (accounts.isEmpty()) {
//                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
//            }
//
//            // 사용자 이름과 계좌 목록을 함께 반환
//            Map<String, Object> response = new HashMap<>();
//            response.put("userName", userName);
//            response.put("accounts", accounts);
//
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }
//
//
//    @GetMapping("/product/{productNo}")
//    public ResponseEntity<List<AccountDTO>> categoryList(@PathVariable("productNo") int productNo) {
//        try {
//            List<AccountDTO> accountList = accountService.listCategory(productNo);
//            if (accountList.isEmpty()) {
//                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
//            }
//            return ResponseEntity.ok(accountList);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }
//
//    @GetMapping("/account/{accountNumber}")
//    public ResponseEntity<Map<String, Object>> getAccountDetail(
//            @PathVariable("accountNumber") String accountNumber,
//            @RequestParam("userNo") int userNo) {
//        try {
//            Map<String, Object> accountDetail = accountService.getAccountDetail(accountNumber, userNo);
//            if (accountDetail != null) {
//                return ResponseEntity.ok(accountDetail);
//            } else {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }
//
//    // 거래 내역 조회 API (userNo 제거)
//    @GetMapping("/account/{accountNumber}/logs")
//    public ResponseEntity<List<LogDTO>> getTransactionLogs(
//            @PathVariable("accountNumber") int accountNumber) {
//        try {
//            List<LogDTO> logs = accountService.getTransactionLogs(accountNumber);
//            if (logs.isEmpty()) {
//                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
//            }
//            return ResponseEntity.ok(logs);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }
//
//
//    // 계좌 비밀번호 확인
//    @PostMapping("/account/{accountNumber}/check-password")
//    public ResponseEntity<String> checkAccountPassword(
//            @PathVariable("accountNumber") String accountNumber,
//            @RequestBody Map<String, Object> request) {
//        try {
//            // userNo와 password를 요청에서 가져옴
//            Integer userNo = Integer.parseInt(request.get("userNo").toString());
//            Integer inputPassword = Integer.parseInt(request.get("password").toString());
//
//            // 비밀번호가 누락된 경우
//            if (inputPassword == null || userNo == null) {
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("유저 번호 또는 비밀번호 누락");
//            }
//
//            // 계좌 비밀번호 확인
//            boolean isPasswordCorrect = accountService.checkAccountPassword(userNo, accountNumber, inputPassword);
//
//            if (isPasswordCorrect) {
//                return ResponseEntity.ok("비밀번호 일치");
//            } else {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호 불일치");
//            }
//        } catch (Exception e) {
//            e.printStackTrace();  // 예외 로그 기록
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류");
//        }
//    }
//
//    // 계좌 비밀번호 변경
//    @PostMapping("/account/{accountNumber}/change-password")
//    public ResponseEntity<String> changeAccountPassword(
//            @PathVariable("accountNumber") String accountNumber,
//            @RequestBody Map<String, Object> request) {
//        try {
//            // userNo와 newPassword를 요청에서 가져옴
//            Integer userNo = Integer.parseInt(request.get("userNo").toString());
//            Integer newPassword = Integer.parseInt(request.get("newPassword").toString());
//
//            // 비밀번호나 userNo가 누락된 경우
//            if (newPassword == null || userNo == null) {
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("유저 번호 또는 새로운 비밀번호 누락");
//            }
//
//            // 계좌 비밀번호 변경
//            boolean isPasswordChanged = accountService.changeAccountPassword(userNo, accountNumber, newPassword);
//
//            if (isPasswordChanged) {
//                return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
//            } else {
//                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("비밀번호 변경에 실패했습니다.");
//            }
//        } catch (Exception e) {
//            e.printStackTrace();  // 예외 로그 기록
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류");
//        }
//    }
//
//    // 계좌 해지 API
//    @PostMapping("/account/{accountNumber}/terminate")
//    public ResponseEntity<String> terminateAccount(
//            @PathVariable("accountNumber") String accountNumber,
//            @RequestBody Map<String, Object> request,
//            @RequestHeader("Authorization") String authorizationHeader) {
//
//        try {
//            // JWT에서 유저 정보 추출 (예: userNo 추출)
//            Integer userNo = Integer.parseInt(request.get("userNo").toString());
//
//            // 계좌 해지 로직 호출
//            boolean isTerminated = accountService.terminateAccount(userNo, accountNumber);
//
//            if (isTerminated) {
//                return ResponseEntity.ok("계좌가 성공적으로 해지되었습니다.");
//            } else {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("계좌를 찾을 수 없습니다.");
//            }
//        } catch (Exception e) {
//            e.printStackTrace();  // 예외 로그 기록
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
//        }
//    }
//
//
//    // 이체한도 변경
//    @PostMapping("/account/{accountNumber}/change-limits")
//    public ResponseEntity<String> changeTransferLimits(
//            @PathVariable("accountNumber") String accountNumber,
//            @RequestBody Map<String, Object> limits) {
//        try {
//            // 요청 바디에서 userNo, dailyLimit, onceLimit 값을 가져옴
//            Integer userNo = Integer.parseInt(limits.get("userNo").toString());
//            Integer newDailyLimit = Integer.parseInt(limits.get("dailyLimit").toString());  // 1일 이체한도
//            Integer newOnceLimit = Integer.parseInt(limits.get("onceLimit").toString());    // 1회 이체한도
//
//            // 유효성 검사: userNo, dailyLimit, onceLimit이 존재하는지 확인
//            if (userNo == null || newDailyLimit == null || newOnceLimit == null) {
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("유저 번호 또는 이체 한도 누락");
//            }
//
//            // 이체한도 변경
//            boolean isLimitChanged = accountService.changeTransferLimits(userNo, accountNumber, newDailyLimit, newOnceLimit);
//
//            if (isLimitChanged) {
//                return ResponseEntity.ok("이체 한도가 성공적으로 변경되었습니다.");
//            } else {
//                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이체 한도 변경에 실패했습니다.");
//            }
//        } catch (Exception e) {
//            e.printStackTrace();  // 예외 로그 기록
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류");
//        }
//    }
//
//
//
//    @PostMapping("/transfer")
//    public ResponseEntity<Map<String, Object>> transferAccount(@RequestBody Map<String, Object> transferData) {
//        try {
//            int userNo = Integer.parseInt(transferData.get("userNo").toString()); // userNo 가져오기
//            String fromAccountNumber = transferData.get("fromAccountNumber").toString();
//            String toAccountNumber = transferData.get("toAccountNumber").toString();
//            int transferAmount = Integer.parseInt(transferData.get("transferAmount").toString());
//            int password = Integer.parseInt(transferData.get("password").toString());
//            String toBankName = transferData.get("toBankName").toString(); // 외부 계좌의 은행 이름
//
//            // 이체 한도 확인
//            Map<String, Object> fromAccountData = accountService.getAccountDetail(fromAccountNumber, userNo);
//            if (fromAccountData == null) {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("message", "출금 계좌가 존재하지 않습니다."));
//            }
//
//            int accountLimit = (int) fromAccountData.get("accountLimit");
//            if (transferAmount > accountLimit) {
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("message", "이체 금액이 1회 이체 한도를 초과합니다."));
//            }
//
//            // 이체 수행
//            boolean isSuccess = accountService.transferAccount(userNo, fromAccountNumber, toAccountNumber, transferAmount, password, toBankName);
//
//            if (isSuccess) {
//                String recipientName = accountService.getRecipientName(Integer.parseInt(toAccountNumber), toBankName);
//                Map<String, Object> response = new HashMap<>();
//                response.put("message", "이체가 성공적으로 완료되었습니다.");
//                response.put("recipientName", recipientName);
//                return ResponseEntity.ok(response);
//            } else {
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("message", "이체 중 오류가 발생했습니다."));
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("message", "서버 오류로 인해 이체가 실패했습니다."));
//        }
//    }
//
//
//
//
//
//
//    // 거래 내역 확인 API (userNo 제거)
//    @GetMapping("/account/{accountNumber}/transaction-history")
//    public ResponseEntity<List<LogDTO>> getAccountTransactionHistory(
//            @PathVariable("accountNumber") int accountNumber) {
//        try {
//            // accountNumber만을 이용해 거래 내역 조회
//            List<LogDTO> logs = accountService.getTransactionLogs(accountNumber);
//            if (logs.isEmpty()) {
//                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
//            }
//            return ResponseEntity.ok(logs);
//        } catch (Exception e) {
//            e.printStackTrace();  // 예외 로그 기록
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 서버 오류 처리
//        }
//    }
//
//
//
//    @GetMapping("/banks/{bankName}/accounts/{accountNumber}")
//    public ResponseEntity<List<OutAccountDTO>> getOutAccountList() {
//        try {
//            List<OutAccountDTO> outAccounts = accountService.getAllNormalOutAccounts();
//            if (outAccounts.isEmpty()) {
//                return ResponseEntity.noContent().build();
//            }
//            return ResponseEntity.ok(outAccounts);
//        } catch (Exception e) {
//            e.printStackTrace();  // 예외 로그 기록
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 서버 오류 처리
//        }
//    }
//
//    // 계좌와 은행명으로 계좌 유효성 확인
//    @GetMapping("/account/validate")
//    public ResponseEntity<Boolean> validateAccountNumber(
////            @RequestParam("userNo") int userNo,
//            @RequestParam("accountNumber") String  accountNumber,
//            @RequestParam("bankName") String bankName) {
//        try {
//            boolean isValid = accountService.validateAccountNumberWithBank(accountNumber, bankName);
//            return ResponseEntity.ok(isValid);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
//        }
//    }
//
//    @PostMapping("/auto-transfer")
//    public ResponseEntity<String> registerAutoTransfer(@RequestBody AutoTransferDTO autoTransferDTO) {
//        try {
//            System.out.println("수신된 출금 계좌번호 (accountNumber): " + autoTransferDTO.getAccountNo());
//            System.out.println("수신된 입금 계좌번호 (receiveAccountNumber): " + autoTransferDTO.getReceiveAccountNo());
//
//            // 입력받은 accountNumber와 receiveAccountNumber를 통해 accountNo와 receiveAccountNo를 조회
//            Integer accountNo = accountService.getAccountNoByAccountNumber(String.valueOf(autoTransferDTO.getAccountNo()));
//
//            // 내부 계좌에서 조회
//            String receiveAccountNo = String.valueOf(accountService.getReceiveAccountNoByAccountNumberAndBank(
//                    autoTransferDTO.getReceiveAccountNo(), autoTransferDTO.getToBankName()));
//
//            // 내부 계좌가 아닌 경우, 외부 계좌에서 조회
//            if (receiveAccountNo == null) {
//                receiveAccountNo = String.valueOf(accountService.getExternalAccountNoByAccountNumberAndBank(
//                        autoTransferDTO.getReceiveAccountNo(), autoTransferDTO.getToBankName()));
//            }
//
//            // 조회 결과 확인
//            System.out.println("조회된 출금 계좌의 accountNo: " + accountNo);
//            System.out.println("조회된 입금 계좌의 receiveAccountNo: " + receiveAccountNo);
//
//            // accountNo나 receiveAccountNo가 null인 경우 에러 반환
//            if (accountNo == null || receiveAccountNo == null) {
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("유효하지 않은 계좌번호입니다.");
//            }
//
//            // DTO에 조회된 값 설정
//            autoTransferDTO.setAccountNo(accountNo);
//            autoTransferDTO.setReceiveAccountNo(receiveAccountNo);
//
//            // 자동이체 등록 로직 실행
//            boolean isRegistered = accountService.registerAutoTransfer(autoTransferDTO);
//
//            if (isRegistered) {
//                return ResponseEntity.ok("자동이체가 성공적으로 등록되었습니다.");
//            } else {
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("자동이체 등록에 실패했습니다.");
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류");
//        }
//    }
//
//
//
//
//
//    // 모든 자동이체 정보 조회
//    @GetMapping("/auto-transfer/list")
//    public ResponseEntity<List<AutoTransferDTO>> getAllAutoTransfers() {
//        try {
//            List<AutoTransferDTO> autoTransfers = accountService.getAllAutoTransfers();
//            if (autoTransfers.isEmpty()) {
//                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);  // 데이터가 없을 경우 204 처리
//            }
//            return ResponseEntity.ok(autoTransfers);  // 정상 처리
//        } catch (Exception e) {
//            e.printStackTrace();  // 예외 로그 기록
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 서버 오류 처리
//        }
//    }

}
