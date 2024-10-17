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
public class LoanController {

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
    public ResponseEntity<LoanJoinEntity> saveLoanJoin(
            @RequestBody Map<String, Object> loanData, // Object로 변경하여 다양한 타입을 수용
            @RequestHeader("Authorization") String token) {

        System.out.println("loandata :" + loanData);

        String loanNo = String.valueOf(loanData.get("loanNo"));
        System.out.println("loanNo :" + loanNo);
        String accountNo = String.valueOf(loanData.get("accountNo"));

        LoanJoinEntity loanJoin = new LoanJoinEntity();

        // 예외 처리 및 기본값 설정
        try {
            // 각 값이 존재하는지 확인 후 가져오기
            loanJoin.setLoanAmount(((Number) loanData.get("loanAmount")).intValue());
            loanJoin.setLoanPeriod(((Number) loanData.get("loanPeriod")).intValue());
            loanJoin.setLoanTransferDay(((Number) loanData.get("loanTransferDay")).intValue());

            System.out.println("loanNo :" + loanJoin.getLoanPeriod());
        } catch (ClassCastException | NullPointerException e) {
            return ResponseEntity.badRequest().body(null); // 잘못된 형식 또는 null인 경우
        }

        // String으로부터 repaymentMethod 설정
        loanJoin.setRepaymentMethod((String) loanData.get("repaymentMethod"));

        // Bearer Token에서 사용자 ID 추출
        String cleanToken = token.replace("Bearer ", "");
        LoanJoinEntity savedLoanJoin = loanService.saveLoanJoin(accountNo, loanNo, loanJoin, cleanToken);
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

        // repaymentData에서 필요한 값 추출 및 null 체크
        if (repaymentData.get("accountNo") == null || repaymentData.get("loanJoinNo") == null || repaymentData.get("repaymentAmount") == null) {
            return ResponseEntity.badRequest().body("Invalid repayment data: missing accountNo, loanJoinNo, or repaymentAmount.");
        }

        try {
            // repaymentData에서 필요한 값 추출 및 형 변환
            int accountNo = ((Number) repaymentData.get("accountNo")).intValue();
            int loanJoinNo = ((Number) repaymentData.get("loanJoinNo")).intValue();
            int repaymentAmount = ((Number) repaymentData.get("repaymentAmount")).intValue();

            // 서비스 호출해서 입금 처리
            loanService.processRepayment(cleanToken, accountNo, loanJoinNo, repaymentAmount);

            return ResponseEntity.ok("Repayment processed successfully.");
        } catch (ClassCastException e) {
            return ResponseEntity.badRequest().body("Invalid repayment data: value type mismatch.");
        }
    }




}