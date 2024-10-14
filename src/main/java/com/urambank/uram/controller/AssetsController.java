package com.urambank.uram.controller;

import com.urambank.uram.entities.LogEntity;
import com.urambank.uram.repository.AccountRepository;
import com.urambank.uram.service.LogService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
public class AssetsController {

    @Autowired
    private LogService logService;

    @Autowired
    private AccountRepository accountRepository; // AccountRepository 추가

//    @Autowired
//    private ProductRepository productRepository; // ProductRepository 추가

    // 모든 로그 데이터를 가져오는 엔드포인트
    @GetMapping("/asset-calendar/logs")
    public ResponseEntity<List<LogEntity>> getAllLogs() {
        List<LogEntity> logs = logService.getAllLogs();
        return ResponseEntity.ok(logs);
    }

//    @GetMapping("/myAsset/{productNo}")
//    public ResponseEntity<List<ProductEntity>> getProductByNo(@PathVariable int productNo) {
//        List<ProductEntity> product = productRepository.findAll();
//        return ResponseEntity.ok(product);
//    }
}
