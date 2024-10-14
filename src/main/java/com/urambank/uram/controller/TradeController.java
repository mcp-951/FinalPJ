package com.urambank.uram.controller;


import com.urambank.uram.dto.CurrencyExchangeDTO;
import com.urambank.uram.entities.AccountEntity;
import com.urambank.uram.entities.CurrencyExchangeEntity;
import com.urambank.uram.entities.PickUpPlaceEntity;
import com.urambank.uram.entities.User;
import com.urambank.uram.repository.AccountRepository;
import com.urambank.uram.repository.CurrencyExchangeRepository;
import com.urambank.uram.repository.PickUpPlaceRepository;
import com.urambank.uram.repository.UserRepository;
import com.urambank.uram.service.TradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/exchange")
public class TradeController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PickUpPlaceRepository pickUpPlaceRepository;

    @Autowired
    private TradeService tradeService;

    @Autowired
    private CurrencyExchangeRepository currencyExchangeRepository;

    // 1. userId로 userNo 가져오기
    @GetMapping("/list/{userId}")
    public ResponseEntity<Integer> getUserNoByUserId(@PathVariable("userId") String userId) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            return ResponseEntity.status(404).body(null);
        }
        return ResponseEntity.ok(user.getUserNo());
    }

    // 2. userNo로 해당 유저의 여러 account 가져오기
    @GetMapping("/account/{userNo}")
    public ResponseEntity<List<AccountEntity>> getAccountsByUserNo(@PathVariable("userNo") int userNo) {
        List<AccountEntity> accounts = accountRepository.findByUserNo(userNo);
        if (accounts.isEmpty()) {
            return ResponseEntity.status(404).body(null);
        }
        return ResponseEntity.ok(accounts);
    }

    // 3. 지점 정보 가져오기
    @GetMapping("/pickup-places")
    public ResponseEntity<List<PickUpPlaceEntity>> getAllPickUpPlaces() {
        List<PickUpPlaceEntity> pickUpPlaces = pickUpPlaceRepository.findAll();
        return ResponseEntity.ok(pickUpPlaces);
    }
    //4. 비밀번호 확인
    @PostMapping("/verify-password/{selectedAccountNumber}/{password}")
    public int passwordCheck(@PathVariable("selectedAccountNumber") String selectedAccountNumber, @PathVariable("password") String password){
        AccountEntity account = accountRepository.findByAccountNumber(selectedAccountNumber);
        int success = 0;

        if(account.getAccountPW().equals(password)){
            success = 1;
        }
        System.out.println(success + "aksjdlkadjaksd");
        return success;
    }



    // 환전 신청 저장하기
    @PostMapping("/submit-exchange")
    public ResponseEntity<String> submitExchange(@RequestBody CurrencyExchangeDTO currencyExchangeDTO) {
        // DTO에서 데이터를 받아 Entity에 매핑
        CurrencyExchangeEntity exchangeEntity = new CurrencyExchangeEntity();
        exchangeEntity.setUserNo(currencyExchangeDTO.getUserNo()); // 로그인된 userNo
        exchangeEntity.setAccountNo(currencyExchangeDTO.getAccountNo()); // 선택된 계좌 번호
        exchangeEntity.setSelectCountry(currencyExchangeDTO.getSelectCountry()); // 선택된 통화
        exchangeEntity.setExchangeRate(currencyExchangeDTO.getExchangeRate()); // 환율
        exchangeEntity.setTradeDate(currencyExchangeDTO.getTradeDate()); // 거래 날짜
        exchangeEntity.setPickupPlace(currencyExchangeDTO.getPickupPlace()); // 수령 지점
        exchangeEntity.setTradePrice(currencyExchangeDTO.getTradePrice()); // 원화 금액
        exchangeEntity.setTradeAmount(currencyExchangeDTO.getTradeAmount()); // 환전 금액
        exchangeEntity.setReceiveDate(currencyExchangeDTO.getReceiveDate()); // 수령 날짜

        // 저장
        currencyExchangeRepository.save(exchangeEntity);

        return ResponseEntity.ok("환전 신청 성공");
    }



    // 환전 내역 가져오기
    @GetMapping("/exchangeList/{userNo}")
    public ResponseEntity<List<CurrencyExchangeDTO>> getExchangeListByUserNo(@PathVariable("userNo") int userNo) {
        List<CurrencyExchangeEntity> exchanges = currencyExchangeRepository.findByUserNo(userNo);  // JPQL 쿼리로 필터링된 데이터 가져오기
        if (exchanges.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
        }
        List<CurrencyExchangeDTO> exchangeDTOs = exchanges.stream()
                .map(exchange -> new CurrencyExchangeDTO(
                        exchange.getTradeNo(),
                        exchange.getUserNo(),
                        exchange.getAccountNo(),
                        exchange.getSelectCountry(),
                        exchange.getExchangeRate(),
                        exchange.getTradeDate(),
                        exchange.getPickupPlace(),
                        exchange.getTradePrice(),
                        exchange.getTradeAmount(),
                        exchange.getReceiveDate()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(exchangeDTOs);
    }



}


