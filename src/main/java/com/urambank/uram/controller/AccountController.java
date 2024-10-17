package com.urambank.uram.controller;

import com.urambank.uram.dto.AccountDTO;
import com.urambank.uram.dto.AutoTransferDTO;
import com.urambank.uram.dto.LogDTO;
import com.urambank.uram.dto.OutAccountDTO;
import com.urambank.uram.service.AccountService;
import com.urambank.uram.util.JWTUtil;
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
    private final JWTUtil jwtUtil;

    // 전체 계좌
    @GetMapping("/accounts")
    public ResponseEntity<Map<String, Object>> accountList(@RequestHeader("Authorization") String token) {
        try {

            // JWT 토큰에서 "Bearer " 제거
            if (token.startsWith("Bearer ")) {
                token = token.substring(7).trim(); // "Bearer " 제거 및 공백 제거
            }

            // JWT 토큰에서 userNo 추출
            int userNo = jwtUtil.getUserNo(token);

            // 사용자 이름 가져오기
            String userName = accountService.getUserNameByUserNo(userNo);

            // 계좌 목록 가져오기
            List<Map<String, Object>> accounts = accountService.getAllAccountWithDepositName(userNo);
            if (accounts.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
            }

            // 사용자 이름과 계좌 목록을 함께 반환
            Map<String, Object> response = new HashMap<>();
            response.put("userName", userName);
            response.put("accounts", accounts);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    // 예금 계좌
    @GetMapping("/accounts/category-one")
    public ResponseEntity<Map<String, Object>> depositCategoryOneAccountList(@RequestHeader("Authorization") String token) {
        try {
            // JWT 토큰에서 userNo 추출
            int userNo = jwtUtil.getUserNo(token.replace("Bearer ", "").trim());

            // 사용자 이름 가져오기
            String userName = accountService.getUserNameByUserNo(userNo);

            // depositCategory가 1인 계좌 목록 가져오기
            List<Map<String, Object>> accounts = accountService.getDepositCategoryOneAccounts(userNo);
            if (accounts.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
            }

            // 사용자 이름과 계좌 목록을 함께 반환
            Map<String, Object> response = new HashMap<>();
            response.put("userName", userName);
            response.put("accounts", accounts);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    // 카테고리별
    @GetMapping("/category/{depositCategory}")
    public ResponseEntity<List<Map<String, Object>>> categoryList(
            @PathVariable("depositCategory") int depositCategory,
            @RequestParam("userNo") int userNo // userNo를 파라미터로 추가
    ) {
        try {
            // depositCategory와 userNo에 해당하는 계좌 목록 가져오기
            List<Map<String, Object>> accountList = accountService.listCategory(depositCategory, userNo);
            if (accountList.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
            }
            return ResponseEntity.ok(accountList);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 계좌 상세
    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<Map<String, Object>> getAccountDetail(
            @PathVariable("accountNumber") String accountNumber,
            @RequestParam("userNo") int userNo) {
        try {
            Map<String, Object> accountDetail = accountService.getAccountDetail(accountNumber, userNo);
            if (accountDetail != null) {
                return ResponseEntity.ok(accountDetail);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 거래 내역
    @GetMapping("/account/{accountNumber}/logs")
    public ResponseEntity<List<LogDTO>> getTransactionLogs(
            @PathVariable("accountNumber") String accountNumber) {
        try {
            List<LogDTO> logs = accountService.getTransactionLogs(accountNumber);
            if (logs.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
            }
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    // 계좌 비밀번호 확인
    @PostMapping("/account/{accountNumber}/check-password")
    public ResponseEntity<String> checkAccountPassword(
            @PathVariable("accountNumber") String accountNumber,
            @RequestBody Map<String, Object> request) {
        try {
            Integer userNo = Integer.parseInt(request.get("userNo").toString());
            String inputPassword = request.get("password").toString();

            // 비밀번호가 누락된 경우
            if (inputPassword == null || userNo == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("유저 번호 또는 비밀번호 누락");
            }

            // 계좌 비밀번호 확인
            boolean isPasswordCorrect = accountService.checkAccountPassword(userNo, accountNumber, inputPassword);

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
    public ResponseEntity<String> changeAccountPassword(
            @PathVariable("accountNumber") String accountNumber,
            @RequestBody Map<String, Object> request) {
        try {
            Integer userNo = Integer.parseInt(request.get("userNo").toString());
            String newPassword = request.get("newPassword").toString();

            // 비밀번호나 userNo가 누락된 경우
            if (newPassword == null || userNo == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("유저 번호 또는 새로운 비밀번호 누락");
            }

            // 계좌 비밀번호 변경 (비밀번호 암호화 후 저장)
            boolean isPasswordChanged = accountService.changeAccountPassword(userNo, accountNumber, newPassword);

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

    // 계좌 해지
    @PostMapping("/account/{accountNumber}/terminate")
    public ResponseEntity<String> terminateAccount(
            @PathVariable("accountNumber") String accountNumber,
            @RequestBody Map<String, Object> request,
            @RequestHeader("Authorization") String authorizationHeader) {

        try {
            Integer userNo = Integer.parseInt(request.get("userNo").toString());

            boolean isTerminated = accountService.terminateAccount(userNo, accountNumber);

            if (isTerminated) {
                return ResponseEntity.ok("계좌가 성공적으로 해지되었습니다.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("계좌를 찾을 수 없습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }

    // 이체한도 변경
    @PostMapping("/account/{accountNumber}/change-limit")
    public ResponseEntity<String> changeTransferLimits(
            @PathVariable("accountNumber") String accountNumber,
            @RequestBody Map<String, Object> limits) {
        try {
            Integer userNo = Integer.parseInt(limits.get("userNo").toString());
            Integer newOnceLimit = Integer.parseInt(limits.get("onceLimit").toString());

            if (userNo == null || newOnceLimit == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("유저 번호 또는 이체 한도 누락");
            }

            boolean isLimitChanged = accountService.changeTransferLimits(userNo, accountNumber, newOnceLimit);

            if (isLimitChanged) {
                return ResponseEntity.ok("이체 한도가 성공적으로 변경되었습니다.");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이체 한도 변경에 실패했습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류");
        }
    }

    @GetMapping("/recipient-name")
    public ResponseEntity<Map<String, Object>> getRecipientName(
            @RequestParam("accountNumber") String toAccountNumber,
            @RequestParam("bankName") String toBankName) {

        try {
            String recipientName = accountService.getRecipientName(toAccountNumber, toBankName);

            if (recipientName != null && !recipientName.equals("사용자 이름 없음") && !recipientName.equals("외부 계좌 사용자 이름 없음")) {
                return ResponseEntity.ok(Collections.singletonMap("recipientName", recipientName));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("message", "수신자 이름을 찾을 수 없습니다."));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("message", "서버 오류로 인해 수신자 이름 조회에 실패했습니다."));
        }
    }

    @PostMapping("/transfer")
    public ResponseEntity<Map<String, Object>> transferAccount(@RequestBody Map<String, Object> transferData) {
        try {
            System.out.println("전달된 데이터: " + transferData);

            if (!transferData.containsKey("userNo") || !transferData.containsKey("fromAccountNumber") ||
                    !transferData.containsKey("toAccountNumber") || !transferData.containsKey("transferAmount") ||
                    !transferData.containsKey("password") || !transferData.containsKey("toBankName")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Collections.singletonMap("message", "필수 입력값이 누락되었습니다."));
            }

            int userNo = Integer.parseInt(transferData.get("userNo").toString());
            String fromAccountNumber = (String) transferData.get("fromAccountNumber");
            String toAccountNumber = (String) transferData.get("toAccountNumber");

            int transferAmount;
            if (transferData.get("transferAmount") instanceof Integer) {
                transferAmount = (Integer) transferData.get("transferAmount");
            } else {
                transferAmount = Integer.parseInt(transferData.get("transferAmount").toString());
            }

            String password = (String) transferData.get("password");
            String toBankName = (String) transferData.get("toBankName");

            // 이체 한도 확인
            Map<String, Object> fromAccountData = accountService.getAccountDetail(fromAccountNumber, userNo);
            if (fromAccountData == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Collections.singletonMap("message", "출금 계좌가 존재하지 않습니다."));
            }

            int accountLimit = (int) fromAccountData.get("accountLimit");
            if (transferAmount > accountLimit) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Collections.singletonMap("message", "이체 금액이 1회 이체 한도를 초과합니다."));
            }

            // 이체 수행
            boolean isSuccess = accountService.transferAccount(userNo, fromAccountNumber, toAccountNumber, transferAmount, password, toBankName);

            if (isSuccess) {
                return ResponseEntity.ok(Collections.singletonMap("message", "이체가 성공적으로 완료되었습니다."));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Collections.singletonMap("message", "이체 중 오류가 발생했습니다."));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", "서버 오류로 인해 이체가 실패했습니다."));
        }
    }

    // 계좌 유효성 검사
    @GetMapping("/account/validate")
    public ResponseEntity<Map<String, Object>> validateAccountNumber(
            @RequestParam("accountNumber") String accountNumber,
            @RequestParam("bankName") String bankName) {
        try {
            // 계좌 유효성 검사
            boolean isValid = accountService.validateAccountNumberWithBank(accountNumber, bankName);

            // 유효한 계좌일 경우 계좌주명 조회
            if (isValid) {
                String recipientName = accountService.getRecipientName(accountNumber, bankName);
                Map<String, Object> response = new HashMap<>();
                response.put("isValid", true);
                response.put("recipientName", recipientName);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("isValid", false));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("message", "서버 오류 발생"));
        }
    }

    // 자동이체
    @PostMapping("/auto-transfer")
    public ResponseEntity<String> registerAutoTransfer(@RequestBody AutoTransferDTO autoTransferDTO) {
        try {
            // DTO 정보 로그 출력
            System.out.println("Received AutoTransferDTO: " + autoTransferDTO);
            System.out.println("FromAccountDTO: " + autoTransferDTO.getFromAccountDTO());
            System.out.println("ToAccountDTO: " + autoTransferDTO.getToAccountDTO());
            System.out.println("OutAccountDTO: " + autoTransferDTO.getOutAccountDTO());

            // 출금 계좌 정보 추출
            String fromAccountNumber = autoTransferDTO.getFromAccountDTO().getAccountNumber();

            // 입금 계좌 정보 처리
            String toAccountNumber = null;
            String toBankName = null;

            // 내부 계좌 처리
            if (autoTransferDTO.getToAccountDTO() != null && autoTransferDTO.getToAccountDTO().getAccountNumber() != null) {
                toAccountNumber = autoTransferDTO.getToAccountDTO().getAccountNumber();
                toBankName = "우람은행";  // 내부 계좌로 간주
                System.out.println("내부 계좌 처리: toAccountNumber = " + toAccountNumber + ", toBankName = " + toBankName);
            }

            // 외부 계좌 처리 (수동 매핑 적용)
            else if (autoTransferDTO.getOutAccountDTO() != null) {
                OutAccountDTO outAccountDTO = autoTransferDTO.getOutAccountDTO();

                // 수동으로 계좌 정보 매핑
                if (outAccountDTO.getOAccountNumber() != null && outAccountDTO.getOBankName() != null) {
                    toAccountNumber = outAccountDTO.getOAccountNumber();
                    toBankName = outAccountDTO.getOBankName();
                    System.out.println("수동 매핑된 외부 계좌 처리: toAccountNumber = " + toAccountNumber + ", toBankName = " + toBankName);
                } else {
                    System.out.println("OutAccountDTO 필드가 유효하지 않습니다.");
                }
            }

            // 입금 계좌 정보가 유효하지 않을 경우 처리
            if (toAccountNumber == null || toBankName == null) {
                System.out.println("유효하지 않은 입금 계좌 정보: toAccountNumber = " + toAccountNumber + ", toBankName = " + toBankName);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("입금 계좌 정보가 유효하지 않습니다.");
            }

            // 출금 계좌번호로 accountNo 조회
            Integer accountNo = accountService.getAccountNoByAccountNumber(fromAccountNumber);
            if (accountNo == null) {
                System.out.println("유효하지 않은 출금 계좌번호: " + fromAccountNumber);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("유효하지 않은 출금 계좌번호입니다.");
            }

            // 외부 계좌 처리 로직 - 내부 계좌일 경우 건너뜀
            Integer receiveAccountNo = null;
            if (!toBankName.equals("우람은행")) { // 내부 계좌가 아닌 경우에만 외부 계좌로 처리
                receiveAccountNo = accountService.getExternalAccountNoByAccountNumberAndBank(toAccountNumber, toBankName);

                // NullPointerException 방지를 위한 null 체크
                if (receiveAccountNo == null) {
                    System.out.println("유효하지 않은 입금 계좌번호: " + toAccountNumber + ", 은행: " + toBankName);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("유효하지 않은 입금 계좌번호입니다.");
                } else {
                    System.out.println("외부 계좌 처리 완료: receiveAccountNo = " + receiveAccountNo);
                }
            } else {
                // 내부 계좌일 경우 처리
                receiveAccountNo = accountService.getAccountNoByAccountNumber(toAccountNumber);
                System.out.println("내부 계좌 처리 완료: receiveAccountNo = " + receiveAccountNo);
            }

            // DTO에 조회된 accountNo와 receiveAccountNo 설정
            autoTransferDTO.setAccountNo(accountNo);
            autoTransferDTO.setReceiveAccountNo(receiveAccountNo);

            // 자동이체 등록 로직 실행
            boolean isRegistered = accountService.registerAutoTransfer(autoTransferDTO);

            if (isRegistered) {
                System.out.println("자동이체 등록 성공: " + autoTransferDTO);
                return ResponseEntity.ok("자동이체가 성공적으로 등록되었습니다.");
            } else {
                System.out.println("자동이체 등록 실패: " + autoTransferDTO);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("자동이체 등록에 실패했습니다.");
            }


        } catch (NullPointerException e) {
            // NullPointerException 예외 발생 시 처리
            System.out.println("자동이체 등록 중 NullPointerException 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("입력된 값 중 null이 발생하였습니다.");
        } catch (Exception e) {
            // 예외 발생 시 처리
            System.out.println("자동이체 등록 중 예외 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }

    // 자동이체 조회
    @GetMapping("/auto-transfer/list")
    public ResponseEntity<List<Map<String, Object>>> getAllAutoTransfers(@RequestParam("userNo") int userNo) {
        try {
            // 서비스에서 userNo에 해당하는 자동이체 데이터와 계좌 정보를 가져옴
            List<Map<String, Object>> autoTransfers = accountService.getAllAutoTransfers(userNo);

            // 자동이체 목록이 비어 있을 경우 204 응답
            if (autoTransfers.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);  // 데이터가 없을 경우 204 처리
            }

            // 이미 서비스에서 계좌주명까지 가져왔기 때문에 추가적인 작업 없이 데이터 반환
            return ResponseEntity.ok(autoTransfers);  // 정상 처리

        } catch (Exception e) {
            e.printStackTrace();  // 예외 로그 기록
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 서버 오류 처리
        }
    }

    // 자동이체 변경
    @PutMapping("/auto-transfer/{autoTransNo}/update")
    public ResponseEntity<String> updateAutoTransfer(@PathVariable("autoTransNo") int autoTransNo, @RequestBody AutoTransferDTO autoTransferDTO) {
        try {
            autoTransferDTO.setAutoTransNo(autoTransNo); // 자동이체 번호 설정

            boolean isUpdated = accountService.updateAutoTransfer(autoTransferDTO);

            if (isUpdated) {
                return ResponseEntity.ok("자동이체가 성공적으로 수정되었습니다.");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("자동이체 수정에 실패했습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류");
        }
    }

    // 자동이체 해지 API
    @PutMapping("/auto-transfer/cancel/{autoTransNo}")
    public ResponseEntity<String> cancelAutoTransfer(@PathVariable("autoTransNo") int autoTransNo) {
        try {
            accountService.cancelAutoTransfer(autoTransNo);
            return ResponseEntity.ok("자동이체가 성공적으로 해지되었습니다.");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 자동이체 24시간 이전 확인 API
    @GetMapping("/auto-transfer/can-cancel/{autoTransNo}")
    public ResponseEntity<String> canCancelAutoTransfer(@PathVariable("autoTransNo") int autoTransNo) {
        try {
            accountService.checkIfCancelable(autoTransNo);
            return ResponseEntity.ok("자동이체를 해지할 수 있습니다.");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
