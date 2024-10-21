//package com.urambank.uram.service;
//
//import com.urambank.uram.dto.AccountDTO;
//import com.urambank.uram.dto.CurrencyExchangeDTO;
//import com.urambank.uram.entities.AccountEntity;
//import com.urambank.uram.entities.CurrencyExchangeEntity;
//import com.urambank.uram.entities.PickUpPlaceEntity;
//import com.urambank.uram.repository.AccountRepository;
//import com.urambank.uram.repository.CurrencyExchangeRepository;
//import com.urambank.uram.repository.PickUpPlaceRepository;
//import com.urambank.uram.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Service
//public class TradeService {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private AccountRepository accountRepository;
//
//    @Autowired
//    private PickUpPlaceRepository pickUpPlaceRepository;
//
//    @Autowired
//    private CurrencyExchangeRepository currencyExchangeRepository;
//
//    // 1. userId로 userNo 가져오기
//    public Integer getUserNoByUserId(String userId) {
//        return userRepository.findByUserId(userId).getUserNo();
//    }
//
//    // 2. userNo로 여러 account 가져오기 (AccountEntity -> AccountDTO 변환)
//    public List<AccountDTO> getAccountsByUserNo(int userNo) {
//        List<AccountEntity> accounts = accountRepository.findByUserNo(userNo);
//        return accounts.stream()
//                .map(AccountDTO::toAccountDTO) // AccountEntity를 AccountDTO로 변환
//                .collect(Collectors.toList());
//    }
//
//    // 3. 모든 지점 정보 가져오기
//    public List<PickUpPlaceEntity> getAllPickUpPlaces() {
//        return pickUpPlaceRepository.findAll();
//    }
//
//    // 4. 비밀번호 확인 (AccountEntity -> AccountDTO 변환)
//    public boolean verifyPassword(String accountNumber, String password) {
//        Optional<AccountEntity> account = accountRepository.findByAccountNumber(accountNumber);
//
//        // 비밀번호가 있는지 확인하고, 입력된 비밀번호와 암호화된 비밀번호를 비교
//        if (account.isPresent() && account.get().getAccountPW() != null) {
//            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//            return passwordEncoder.matches(password, account.get().getAccountPW());  // 암호화된 비밀번호 비교
//        }
//
//        return false;
//    }
//
//    // 5. 환전 신청 저장하기 (CurrencyExchangeDTO -> CurrencyExchangeEntity 변환)
//    public void submitExchange(CurrencyExchangeDTO currencyExchangeDTO) {
//        CurrencyExchangeEntity exchangeEntity = new CurrencyExchangeEntity();
//        exchangeEntity.setUserNo(currencyExchangeDTO.getUserNo());
//        exchangeEntity.setAccountNo(currencyExchangeDTO.getAccountNo());
//        exchangeEntity.setSelectCountry(currencyExchangeDTO.getSelectCountry());
//        exchangeEntity.setExchangeRate(currencyExchangeDTO.getExchangeRate());
//        exchangeEntity.setTradeDate(currencyExchangeDTO.getTradeDate());
//        exchangeEntity.setPickupPlace(currencyExchangeDTO.getPickupPlace());
//        exchangeEntity.setTradePrice(currencyExchangeDTO.getTradePrice());
//        exchangeEntity.setTradeAmount(currencyExchangeDTO.getTradeAmount());
//        exchangeEntity.setReceiveDate(currencyExchangeDTO.getReceiveDate());
//
//        currencyExchangeRepository.save(exchangeEntity);
//    }
//
//    // 6. 환전 내역 가져오기 (CurrencyExchangeEntity -> CurrencyExchangeDTO 변환)
//    public List<CurrencyExchangeDTO> getExchangeListByUserNo(int userNo) {
//        List<CurrencyExchangeEntity> exchanges = currencyExchangeRepository.findByUserNo(userNo);
//        return exchanges.stream()
//                .map(exchange -> new CurrencyExchangeDTO(
//                        exchange.getTradeNo(),
//                        exchange.getUserNo(),
//                        exchange.getAccountNo(),
//                        exchange.getExchangeRate(),
//                        exchange.getSelectCountry(),
//                        exchange.getTradeDate(),
//                        exchange.getPickupPlace(),
//                        exchange.getTradePrice(),
//                        exchange.getTradeAmount(),
//                        exchange.getReceiveDate()
//                ))
//                .collect(Collectors.toList());
//    }
//
//    // 7. 브랜치 이름을 받아 해당 지점의 pickUpAddress를 반환하는 서비스 메서드
//    public String getPickUpAddressByBranch(String branch) {
//        PickUpPlaceEntity pickupPlace = pickUpPlaceRepository.findByPickupPlaceName(branch);
//        return pickupPlace != null ? pickupPlace.getPickUpAddress() : null;
//    }
//
//    // 8. selectedAccountNumber로 accountNo를 가져오는 서비스 메서드 (AccountEntity -> AccountDTO 변환)
//    public AccountDTO getAccountNoBySelectedAccountNumber(String selectedAccountNumber) {
//        Optional<AccountEntity> account = accountRepository.findByAccountNumber(selectedAccountNumber);
//
//        // 값이 있으면 AccountDTO로 변환하여 반환, 없으면 null 반환
//        return account.map(AccountDTO::toAccountDTO).orElse(null);
//    }
//
//    // 예금 계좌
//    public List<Map<String, Object>> getDepositCategoryOneAccounts(int userNo) {
//        List<Object[]> results = accountRepository.findAllDepositCategoryOneAccounts(userNo);
//        List<Map<String, Object>> accountDataList = new ArrayList<>();
//
//        for (Object[] result : results) {
//            Map<String, Object> accountData = new HashMap<>();
//            accountData.put("accountNo", result[0]);
//            accountData.put("accountNumber", result[1]);
//            accountData.put("accountBalance", result[2]);
//            accountData.put("accountOpen", result[3]);
//            accountData.put("accountClose", result[4]);
//            accountData.put("depositNo", result[5]);
//            accountData.put("depositName", result[6]);
//            accountData.put("depositCategory", result[7]); // depositCategory 추가
//
//            accountDataList.add(accountData);
//        }
//
//        return accountDataList;
//    }
//}
