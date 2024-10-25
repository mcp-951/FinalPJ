package com.urambank.uram.controller;

import com.urambank.uram.dto.AccountDTO;
import com.urambank.uram.dto.CurrencyExchangeDTO;
import com.urambank.uram.entities.AccountEntity;
import com.urambank.uram.entities.PickUpPlaceEntity;
import com.urambank.uram.service.AccountService;
import com.urambank.uram.service.TradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/exchange")
public class TradeController {

    @Autowired
    private TradeService tradeService;

    @Autowired
    private AccountService accountService;

    // 1. userId로 userNo 가져오기
    @GetMapping("/list/{userId}")
    public ResponseEntity<Integer> getUserNoByUserId(@PathVariable("userId") String userId) {
        try {
            Integer userNo = tradeService.getUserNoByUserId(userId);
            if (userNo == null) {
                return ResponseEntity.status(404).body(null);
            }
            return ResponseEntity.ok(userNo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 2. userNo로 해당 유저의 여러 account 가져오기 (AccountDTO로 반환)
    @GetMapping("/account/{userNo}")
    public ResponseEntity<List<AccountDTO>> getAccountsByUserNo(@PathVariable("userNo") int userNo) {
        try {
            List<AccountDTO> accounts = tradeService.getAccountsByUserNo(userNo);
            if (accounts.isEmpty()) {
                return ResponseEntity.status(404).body(null);
            }
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // selectedAccountNumber로 accountNo를 가져오는 API (AccountDTO로 변환된 결과 사용)
    @GetMapping("/get-account-no/{selectedAccountNumber}")
    public ResponseEntity<Integer> getAccountNo(@PathVariable("selectedAccountNumber") String selectedAccountNumber) {
        try {
            AccountDTO accountDTO = tradeService.getAccountNoBySelectedAccountNumber(selectedAccountNumber);
            if (accountDTO == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.ok(accountDTO.getAccountNo());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 3. 지점 정보 가져오기
    @GetMapping("/pickup-places")
    public ResponseEntity<List<PickUpPlaceEntity>> getAllPickUpPlaces() {
        try {
            List<PickUpPlaceEntity> pickUpPlaces = tradeService.getAllPickUpPlaces();
            return ResponseEntity.ok(pickUpPlaces);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 4. 비밀번호 확인 (String 타입으로 처리)
    @PostMapping("/verify-password/{selectedAccountNumber}/{password}")
    public int passwordCheck(@PathVariable("selectedAccountNumber") String selectedAccountNumber, @PathVariable("password") String password) {
        try {
            boolean isValid = tradeService.verifyPassword(selectedAccountNumber, password);
            return isValid ? 1 : 0;
        } catch (Exception e) {
            return 0;  // 예외가 발생할 경우 0 반환
        }
    }

    // 환전 신청 저장하기
    @PostMapping("/submit-exchange")
    public ResponseEntity<String> submitExchange(@RequestBody CurrencyExchangeDTO currencyExchangeDTO) {
        try {
            tradeService.submitExchange(currencyExchangeDTO);
            return ResponseEntity.ok("환전 신청 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("환전 신청 실패");
        }
    }

    // 6. 환전 내역 가져오기 (CurrencyExchangeDTO로 반환)
    @GetMapping("/exchangeList/{userNo}")
    public ResponseEntity<List<CurrencyExchangeDTO>> getExchangeListByUserNo(@PathVariable("userNo") int userNo) {
        try {
            List<CurrencyExchangeDTO> exchangeDTOs = tradeService.getExchangeListByUserNo(userNo);
            if (exchangeDTOs.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
            }
            return ResponseEntity.ok(exchangeDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 브랜치 이름을 받아 해당 지점의 pickUpAddress를 반환하는 메서드
    @GetMapping("/pickup-address/{branch}")
    public ResponseEntity<String> getPickUpAddressByBranch(@PathVariable("branch") String branch) {
        try {
            String pickUpAddress = tradeService.getPickUpAddressByBranch(branch);
            if (pickUpAddress != null) {
                return ResponseEntity.ok(pickUpAddress);
            } else {
                return ResponseEntity.badRequest().body("해당 지점 정보를 찾을 수 없습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }

    // 예금 계좌
    @GetMapping("/users/{userNo}/accounts/category-one")
    public ResponseEntity<Map<String, Object>> depositCategoryOneAccountList(@PathVariable("userNo") int userNo) {
        try {
            // 사용자 이름 가져오기
            String userName = accountService.getUserNameByUserNo(userNo);

            // depositCategory가 1인 계좌 목록 가져오기
            List<Map<String, Object>> accounts = tradeService.getDepositCategoryOneAccounts(userNo);
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

    // 선택한 계좌 번호로 accountNo와 잔액 반환
    @GetMapping("/get-account-info/{selectedAccountNumber}")
    public ResponseEntity<Map<String, Object>> getAccountInfo(@PathVariable("selectedAccountNumber") String selectedAccountNumber) {
        try {
            // accountNumber에 해당하는 accountNo와 잔액 조회
            Optional<AccountEntity> accountOptional = tradeService.findByAccountNumber(selectedAccountNumber);

            if (accountOptional.isPresent()) {  // 계좌가 존재할 때
                AccountEntity account = accountOptional.get();  // Optional에서 실제 객체 추출
                Map<String, Object> response = new HashMap<>();
                response.put("accountNo", account.getAccountNo());
                response.put("accountBalance", account.getAccountBalance());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 계좌가 없을 때
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


}
