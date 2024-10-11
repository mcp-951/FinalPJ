package com.urambank.uram.controller;

import com.urambank.uram.entities.AccountEntity;
import com.urambank.uram.entities.LogEntity;
import com.urambank.uram.entities.ProductEntity;
import com.urambank.uram.repository.AccountRepository;
import com.urambank.uram.repository.LogRepository;
import com.urambank.uram.repository.ProductRepository;
import com.urambank.uram.service.LogService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
public class AssetsController {

    @Autowired
    private LogService logService;

    @Autowired
    private AccountRepository accountRepository; // AccountRepository 추가

    @Autowired
    private ProductRepository productRepository; // ProductRepository 추가


    @PostMapping("/asset-calendar/logs/{selectedAccountNumber}")
    public int checkAccount(@PathVariable("selectedAccountNumber") int selectedAccountNumber) {
        AccountEntity account = accountRepository.findByAccountNumber(selectedAccountNumber);
        // sendAccountNo 또는 receiveAccountNo와 비교할 로그 데이터 가져오기
        LogEntity receiveLog = (LogEntity) LogRepository.findByReceiveAccountNo(selectedAccountNumber);
        LogEntity sendLog = (LogEntity) LogRepository.findBySendAccountNo(selectedAccountNumber);

        int success = 0;

        // receiveAccountNo와 같으면 2 리턴 (파란색 +)
        if (receiveLog != null && selectedAccountNumber == receiveLog.getReceiveAccountNo()) {
            success = 2;
        }
        // sendAccountNo와 같으면 1 리턴 (빨간색 -)
        else if (sendLog != null && selectedAccountNumber == sendLog.getSendAccountNo()) {
            success = 1;
        }

        System.out.println(success + " matched selectedAccountNumber with logs");

        return success;
    }





    @GetMapping("/myAsset/{productNo}")
    public ResponseEntity<List<ProductEntity>> getProductByNo(@PathVariable int productNo) {
        List<ProductEntity> product = productRepository.findAll();
        return ResponseEntity.ok(product);
    }
}
