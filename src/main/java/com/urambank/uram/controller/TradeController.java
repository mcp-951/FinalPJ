package com.urambank.uram.controller;

import com.urambank.uram.dto.AccountDTO;
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
    public int passwordCheck(@PathVariable("selectedAccountNumber") String selectedAccountNumber, @PathVariable("password") String password) {
        AccountEntity account = accountRepository.findByAccountNumber(selectedAccountNumber);
        int success = 0;

        // 비밀번호 비교: equals()를 사용하여 문자열 비교
        if (account != null && account.getAccountPW().equals(password)) {
            success = 1;
        }

        System.out.println(success + " aksjdlkadjaksd");
        return success;
    }

    // selectedAccountNumber로 accountNo를 가져오는 API
    @GetMapping("/get-account-no/{selectedAccountNumber}")
    public ResponseEntity<Integer> getAccountNo(@PathVariable("selectedAccountNumber") String selectedAccountNumber) {
        // selectedAccountNumber로 AccountEntity 검색
        AccountEntity account = accountRepository.findByAccountNumber(selectedAccountNumber);

        // 만약 계좌가 존재하지 않으면 404 Not Found 반환
        if (account == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        // accountNo 반환
        return ResponseEntity.ok(account.getAccountNo());
    }


    // 환전 신청 저장하기
    @PostMapping("/submit-exchange")
    public ResponseEntity<String> submitExchange(@RequestBody CurrencyExchangeDTO currencyExchangeDTO) {

        // 엔티티에 데이터 매핑
        CurrencyExchangeEntity exchangeEntity = new CurrencyExchangeEntity();
        exchangeEntity.setUserNo(currencyExchangeDTO.getUserNo());
        exchangeEntity.setAccountNo(currencyExchangeDTO.getAccountNo());
        exchangeEntity.setSelectCountry(currencyExchangeDTO.getSelectCountry());
        exchangeEntity.setExchangeRate(currencyExchangeDTO.getExchangeRate());
        exchangeEntity.setTradeDate(currencyExchangeDTO.getTradeDate());
        exchangeEntity.setPickUpPlace(currencyExchangeDTO.getPickUpPlace());
        exchangeEntity.setTradePrice(currencyExchangeDTO.getTradePrice());
        exchangeEntity.setTradeAmount(currencyExchangeDTO.getTradeAmount());
        exchangeEntity.setReceiveDate(currencyExchangeDTO.getReceiveDate());

        // 데이터 저장
        currencyExchangeRepository.save(exchangeEntity);

        return ResponseEntity.ok("환전 신청 성공");
    }

    // 브랜치 이름을 받아 해당 지점의 pickUpAddress를 반환하는 메서드
    @GetMapping("/pickup-address/{branch}")
    public ResponseEntity<String> getPickUpAddressByBranch(@PathVariable String branch) {
        PickUpPlaceEntity pickUpPlace = pickUpPlaceRepository.findByPickUpPlaceName(branch);
        if (pickUpPlace != null) {
            return ResponseEntity.ok(pickUpPlace.getPickUpAddress()); // pickUpAddress 반환
        } else {
            return ResponseEntity.badRequest().body("해당 지점 정보를 찾을 수 없습니다.");
        }
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
                        exchange.getExchangeRate(),
                        exchange.getSelectCountry(),
                                        exchange.getTradeDate(),
                                        exchange.getPickUpPlace(),
                                        exchange.getTradePrice(),
                                        exchange.getTradeAmount(),
                                        exchange.getReceiveDate()
                                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(exchangeDTOs);
    }



}
