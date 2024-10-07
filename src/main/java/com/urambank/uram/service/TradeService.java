package com.urambank.uram.service;

import com.urambank.uram.entities.AccountEntity;
import com.urambank.uram.entities.PickUpPlaceEntity;
import com.urambank.uram.entities.User;
import com.urambank.uram.repository.AccountRepository;
import com.urambank.uram.repository.PickUpPlaceRepository;
import com.urambank.uram.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TradeService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PickUpPlaceRepository pickUpPlaceRepository;

    // 1. 로그인된 사용자 ID를 이용해 userNo 가져오기
    public int getUserNoByUserId(String userId) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new RuntimeException("User not found for userId: " + userId);
        }
        return user.getUserNo();
    }

    // 2. userNo를 기준으로 accountNo 가져오기
    public int getAccountNoByUserNo(int userNo) {
        AccountEntity account = accountRepository.findFirstByUserNo(userNo);
        if (account == null) {
            throw new RuntimeException("No accounts found for userNo: " + userNo);
        }
        return account.getAccountNo();
    }

    // 3. accountNo를 기준으로 accountNumber 가져오기
    public int getAccountNumberByAccountNo(int accountNo) {
        AccountEntity account = accountRepository.findById(accountNo);
        if (account == null) {
            throw new RuntimeException("Account not found for accountNo: " + accountNo);
        }
        return account.getAccountNumber();
    }

    // 4. 지점 정보를 가져오는 메서드
    public List<PickUpPlaceEntity> getAllPickUpPlaces() {
        return pickUpPlaceRepository.findAll();
    }

    // 5. userId를 기준으로 userPw 검증하기
    public boolean verifyUserPassword(String userId, String inputPassword) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new RuntimeException("User not found for userId: " + userId);
        }
        return user.getUserPw().equals(inputPassword);
    }
}
