package com.urambank.uram.controller;

import com.urambank.uram.dto.AccountDTO;
import com.urambank.uram.dto.CurrencyExchangeDTO;
import com.urambank.uram.entities.PickUpPlaceEntity;
import com.urambank.uram.service.TradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/exchange")
public class TradeController {

    @Autowired
    private TradeService tradeService;

    // 1. userId로 userNo 가져오기
    @GetMapping("/list/{userId}")
    public ResponseEntity<Integer> getUserNoByUserId(@PathVariable("userId") String userId) {
        Integer userNo = tradeService.getUserNoByUserId(userId);
        if (userNo == null) {
            return ResponseEntity.status(404).body(null);
        }
        return ResponseEntity.ok(userNo);
    }

    // 2. userNo로 해당 유저의 여러 account 가져오기 (AccountDTO로 반환)
    @GetMapping("/account/{userNo}")
    public ResponseEntity<List<AccountDTO>> getAccountsByUserNo(@PathVariable("userNo") int userNo) {
        List<AccountDTO> accounts = tradeService.getAccountsByUserNo(userNo);
        if (accounts.isEmpty()) {
            return ResponseEntity.status(404).body(null);
        }
        return ResponseEntity.ok(accounts);
    }

    // selectedAccountNumber로 accountNo를 가져오는 API (AccountDTO로 변환된 결과 사용)
    @GetMapping("/get-account-no/{selectedAccountNumber}")
    public ResponseEntity<Integer> getAccountNo(@PathVariable("selectedAccountNumber") String selectedAccountNumber) {
        AccountDTO accountDTO = tradeService.getAccountNoBySelectedAccountNumber(selectedAccountNumber);
        if (accountDTO == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(accountDTO.getAccountNo());
    }

    // 3. 지점 정보 가져오기
    @GetMapping("/pickup-places")
    public ResponseEntity<List<PickUpPlaceEntity>> getAllPickUpPlaces() {
        List<PickUpPlaceEntity> pickUpPlaces = tradeService.getAllPickUpPlaces();
        return ResponseEntity.ok(pickUpPlaces);
    }


    // 4. 비밀번호 확인 (String 타입으로 처리)
    @PostMapping("/verify-password/{selectedAccountNumber}/{password}")
    public int passwordCheck(@PathVariable("selectedAccountNumber") String selectedAccountNumber, @PathVariable("password") String password) {
        boolean isValid = tradeService.verifyPassword(selectedAccountNumber, password);
        return isValid ? 1 : 0;
    }


    // 환전 신청 저장하기
    @PostMapping("/submit-exchange")
    public ResponseEntity<String> submitExchange(@RequestBody CurrencyExchangeDTO currencyExchangeDTO) {
        tradeService.submitExchange(currencyExchangeDTO);
        return ResponseEntity.ok("환전 신청 성공");
    }

    // 6. 환전 내역 가져오기 (CurrencyExchangeDTO로 반환)
    @GetMapping("/exchangeList/{userNo}")
    public ResponseEntity<List<CurrencyExchangeDTO>> getExchangeListByUserNo(@PathVariable("userNo") int userNo) {
        List<CurrencyExchangeDTO> exchangeDTOs = tradeService.getExchangeListByUserNo(userNo);
        if (exchangeDTOs.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
        }
        return ResponseEntity.ok(exchangeDTOs);
    }

    // 브랜치 이름을 받아 해당 지점의 pickUpAddress를 반환하는 메서드
    @GetMapping("/pickup-address/{branch}")
    public ResponseEntity<String> getPickUpAddressByBranch(@PathVariable("branch") String branch) {
        String pickUpAddress = tradeService.getPickUpAddressByBranch(branch);
        if (pickUpAddress != null) {
            return ResponseEntity.ok(pickUpAddress);
        } else {
            return ResponseEntity.badRequest().body("해당 지점 정보를 찾을 수 없습니다.");
        }
    }

}
