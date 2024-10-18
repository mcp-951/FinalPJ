package com.urambank.uram.controller;

import com.urambank.uram.entities.AccountEntity;
import com.urambank.uram.entities.LoanEntity;
import com.urambank.uram.entities.LoanJoinEntity;
import com.urambank.uram.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/products/loans")
public class oanController {

    private final LoanService loanService;

    // 페이징 처리된 대출 상품 리스트 가져오기
    @GetMapping("/page")
    public Page<LoanEntity> getLoanProductsPaged(Pageable pageable) {
        return loanService.getLoanProductsPaged(pageable);
    }
    @GetMapping("/account")
    public List<AccountEntity> getNormalAccounts(@RequestHeader("Authorization") String token) {
        // "Bearer " 접두사를 제거한 실제 토큰만 사용
        String cleanToken = token.replace("Bearer ", "");
        return loanService.getNormalAccounts(cleanToken);
    }
    @PostMapping("/save")
    public ResponseEntity<LoanJoinEntity> saveLoanJoin(@RequestBody LoanJoinEntity loanJoin,
                                                       @RequestHeader("Authorization") String token) {
        String cleanToken = token.replace("Bearer ", "");  // "Bearer " 접두사 제거
        LoanJoinEntity savedLoanJoin = loanService.saveLoanJoin(loanJoin, cleanToken);
        return ResponseEntity.ok(savedLoanJoin);
    }

    @GetMapping("/userLoans")
    public List<LoanJoinEntity> getUserLoans(@RequestHeader("Authorization") String token) {

        String cleanToken = token.replace("Bearer ", "");
        return loanService.getActiveLoans(cleanToken);
    }

    @PostMapping("/repayment")
    public ResponseEntity<String> processRepayment(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> repaymentData) {

        String cleanToken = token.replace("Bearer ", "");
        // repaymentData에서 필요한 값 추출 및 형 변환
        int accountNo = (int) ((Number) repaymentData.get("accountNo")).intValue();  // 명시적 변환
        int loanJoinNo = (int) ((Number) repaymentData.get("loanJoinNo")).intValue();  // 명시적 변환
        int repaymentAmount = (int) ((Number) repaymentData.get("repaymentAmount")).intValue();  // 명시적 변환

        // 서비스 호출해서 입금 처리
        loanService.processRepayment(cleanToken, accountNo, loanJoinNo, repaymentAmount);

        return ResponseEntity.ok("Repayment processed successfully.");
    }



}