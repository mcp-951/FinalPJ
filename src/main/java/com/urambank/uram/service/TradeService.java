//package com.urambank.uram.service;
//
//import com.urambank.uram.entities.AccountEntity;
//import com.urambank.uram.entities.PickUpPlaceEntity;
//import com.urambank.uram.entities.User;
//import com.urambank.uram.repository.AccountRepository;
//import com.urambank.uram.repository.PickUpPlaceRepository;
//import com.urambank.uram.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
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
//    // 1. userId로 userNo 가져오기
//    public Integer getUserNoByUserId(String userId) {
//        User user = userRepository.findByUserId(userId);
//        if (user == null) {
//            throw new RuntimeException("User not found for userId: " + userId);
//        }
//        return user.getUserNo();
//    }
//
//    // 2. userNo로 accountNo 가져오기
//    public Integer getAccountNoByUserNo(int userNo) {
//        AccountEntity account = (AccountEntity) accountRepository.findByUserNo(userNo);
//        if (account == null) {
//            throw new RuntimeException("Account not found for userNo: " + userNo);
//        }
//        return account.getAccountNo();
//    }
//
//    // 3. accountNo로 accountNumber 가져오기
//    public Integer getAccountNumberByAccountNo(int accountNo) {
//        AccountEntity account = accountRepository.findById(accountNo)
//                .orElseThrow(() -> new RuntimeException("Account not found for accountNo: " + accountNo));
//        return account.getAccountNumber();
//    }
//
//    // 4. 지점 정보 가져오기
//    public List<PickUpPlaceEntity> getAllPickUpPlaces() {
//        return pickUpPlaceRepository.findAll();
//    }
//
//    // 5. 비밀번호 확인
//    public boolean verifyPassword(String userId, String inputPassword) {
//        User user = userRepository.findByUserId(userId);
//        if (user == null) {
//            throw new RuntimeException("User not found for userId: " + userId);
//        }
//        return user.getUserPw().equals(inputPassword);
//    }
//}
