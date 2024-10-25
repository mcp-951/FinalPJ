package com.urambank.uram.controller;

import com.urambank.uram.dto.UserDTO;
import com.urambank.uram.dto.AccountDTO;
import com.urambank.uram.dto.LogDTO;
import com.urambank.uram.dto.DepositDTO;
import com.urambank.uram.service.AdminService;
import com.urambank.uram.dto.LoanProductDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000") // CORS 설정 추가
@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }
    //------------------------ 전체 상품 -------------------------------------
    // 전체 금융 상품 조회
    @GetMapping("/financial-products")
    public List<Object> getAllFinancialProducts() {

        System.out.println("<<< AdminController /getAllFinancialProducts >>>");
        return adminService.getAllFinancialProducts();
    }

    // 상품 판매량 차트 데이터 조회
    @GetMapping("/product-counts")
    public Map<String, Integer> getProductCounts() {

        System.out.println("<<< AdminController /product-counts >>>");
        return adminService.getProductCounts();
    }
    //------------------- 적금 상품 관련 -------------------------------------
    // 적금 상품 목록 조회
    @GetMapping("/savings")
    public ResponseEntity<List<DepositDTO>> savings() {
        System.out.println("<<< AdminController /savings >>>");
        // 서비스에서 계좌 상태와 상품 카테고리를 함께 가져오는 데이터를 반환
        List<DepositDTO> savings = adminService.getSavings();
        return ResponseEntity.ok(savings);
    }

    // 예금,적금 상품 수정
    @PutMapping("/editSavings/{depositNo}")
    public ResponseEntity<String> editSavingsProduct(@PathVariable("depositNo") int depositNo, @RequestBody DepositDTO depositDTO) {
        // 로그 추가하여 전달된 파라미터 확인
        System.out.println("<<< AdminController editSavingsProduct >>> depositNo: " + depositNo + ", depositDTO: " + depositDTO);

        adminService.updateDeposit(depositNo, depositDTO);  // 수정 서비스 호출

        return ResponseEntity.ok("적금 상품이 수정되었습니다.");
    }

    // 예금,적금 상품 삭제 (depositState를 'n'으로 변경)
    @PutMapping("/deleteSavings/{depositNo}")
    public ResponseEntity<String> deleteSavingsProduct(@PathVariable("depositNo") int depositNo) {
        System.out.println("<<< AdminController /deleteSavings >>>");
        adminService.deleteDeposit(depositNo);
        return ResponseEntity.ok("해당 적금 상품이 삭제되었습니다.");
    }

    // 예금,적금 상품 등록
    @PostMapping("/register-product")
    public ResponseEntity<String> addDepositProduct(@RequestBody DepositDTO depositDTO) {
        System.out.println("<<< AdminService /addDepositProduct >>>");
        adminService.addDepositProduct(depositDTO);  // 서비스에서 적금 상품 등록
        return ResponseEntity.ok("상품이 성공적으로 등록되었습니다.");
    }
    //--------------------------------- 예금 상품 관련 -----------------------------------------
    // 예금 상품 목록 조회
    @GetMapping("/deposits")
    public ResponseEntity<List<DepositDTO>> getDeposits() {
        System.out.println("<<< AdminController /deposits >>>");
        List<DepositDTO> deposits = adminService.getDeposits();
        return ResponseEntity.ok(deposits);
    }
    //--------------------------------- 대출 관련 ----------------------------------------------------------// 새로운 상품 등록
    //대출 상품 등록
    @PostMapping("/register-loan")
    public ResponseEntity<String> addLoanProduct(@RequestBody LoanProductDTO loanProductDTO) {
        System.out.println("<<< AdminController /addLoanProduct >>>");
        adminService.addLoanProduct(loanProductDTO);  // 서비스에서 대출 상품 등록
        return ResponseEntity.ok("대출 상품이 성공적으로 등록되었습니다.");
    }

    // 대출 상품 목록 조회
    @GetMapping("/loans")
    public ResponseEntity<List<LoanProductDTO>> getLoanProducts() {
        System.out.println("<<< AdminController /loans >>>");
        List<LoanProductDTO> loans = adminService.getLoanProducts();
        return ResponseEntity.ok(loans);
    }

    // 대출 상품 수정
    @PutMapping("/editLoan/{loanProductNo}")
    public ResponseEntity<String> editLoanProduct(@PathVariable("loanProductNo") int loanProductNo, @RequestBody LoanProductDTO loanProductDTO) {
        System.out.println("<<< AdminController /editLoan >>>");
        adminService.updateLoan(loanProductNo, loanProductDTO);
        return ResponseEntity.ok("대출 상품이 수정되었습니다.");
    }

    // 대출 상품 삭제 (viewPoint를 'N'으로 변경)
    @PutMapping("/deleteLoan/{loanProductNo}")
    public ResponseEntity<String> deleteLoanProduct(@PathVariable("loanProductNo") int loanProductNo) {
        System.out.println("<<< AdminController /deleteLoan >>>");
        adminService.deleteLoan(loanProductNo);
        return ResponseEntity.ok("해당 대출 상품이 삭제되었습니다.");
    }
    //------------------------------- 거래 관련 ------------------------------------------------
    // 활성 거래 목록 조회 (DTO 사용)
    @GetMapping("/adTransactionHistory")
    public ResponseEntity<List<LogDTO>> getAllLogs() {
        System.out.println("<<< AdminController /getLogList >>>");
        List<LogDTO> logs = adminService.getAllLogs();
        return ResponseEntity.ok(logs);
    }
    //------------------------------- 계좌 리스트 가져오기------------------------------------------------
    // 모든 NORMAL 계좌 목록 조회
    @GetMapping("/adAccounts")
    public ResponseEntity<List<AccountDTO>> getNormalAccounts() {
        System.out.println("<<< AdminController /adAccounts >>>");
        List<AccountDTO> accounts = adminService.getNormalAccounts();
        return ResponseEntity.ok(accounts); // 정상적으로 조회된 데이터를 반환
    }

    // STOP 상태 계좌 정보 가져오기
    @GetMapping("/adAccountStop")
    public ResponseEntity<List<AccountDTO>> adAccountStop() {
        System.out.println("<<< AdminController /adAccountStop >>>");
        List<AccountDTO> accounts = adminService.getStopAccounts();
        return ResponseEntity.ok(accounts);
    }

    // TERMINATION 상태 계좌 정보 가져오기
    @GetMapping("/adAccountClosure")
    public ResponseEntity<List<AccountDTO>> getTerminationAccounts() {
        System.out.println("<<< AdminController /adAccountClosure >>>");
        List<AccountDTO> accounts = adminService.TerminationAccounts();
        return ResponseEntity.ok(accounts);
    }

    //----------------------------------------계좌 상태값 바꾸기 -------------------------------
    // STOP으로 계좌 상태 변경
    @PutMapping("/stopAccount/{accountNo}")
    public ResponseEntity<String> stopAccount(@PathVariable("accountNo") int accountNo) {
        System.out.println("<<< AdminController /stopAccount >>>");
        adminService.stopAccount(accountNo);  // STOP으로 변경하는 서비스 호출
        return ResponseEntity.ok("계좌가 정지되었습니다.");
    }

    // STOP 상태를 NORMAL로 변경
    @PutMapping("/normalAccount/{accountNo}")
    public ResponseEntity<String> resumeAccount(@PathVariable("accountNo") int accountNo) {
        System.out.println("<<< AdminController /resumeAccount >>>");
        adminService.resumeAccount(accountNo);  // NORMAL로 변경하는 서비스 호출
        return ResponseEntity.ok("계좌가 재개되었습니다.");
    }
    //--------------------------------------회원 관련-----------------------------------------
    // 활성 회원 목록 조회 (DTO 사용)
    @GetMapping("/getUserList")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // 탈퇴 회원 목록 조회 (DTO 사용)
    @GetMapping("/retired")
    public ResponseEntity<List<UserDTO>> getRetiredUsers() {
        List<UserDTO> users = adminService.getRetiredUsers();
        return ResponseEntity.ok(users);
    }

    // 회원 정보 수정 (DTO 사용)
    @PutMapping("/setState/{userNo}")
    public ResponseEntity<String> setState(@PathVariable("userNo") int userNo,@RequestBody UserDTO dto) {

        adminService.setState(userNo, dto.getState());
        return ResponseEntity.ok("변경 완료");
    }

    // 회원 정보 수정 (DTO 사용)
    @PutMapping("/updateUser/{userNo}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable("userNo") int userNo, @RequestBody UserDTO userDTO) {
        System.out.println("<<< updateUser >>>");

        UserDTO updatedUser = adminService.updateUser(userNo, userDTO);
        return ResponseEntity.ok(updatedUser);
    }

    // 회원 탈퇴 처리 (DTO 사용)
    @PutMapping("/deactivate/{userNo}")
    public ResponseEntity<String> deactivateUser(@PathVariable int userNo) {
        adminService.deactivateUser(userNo);
        return ResponseEntity.ok("회원 탈퇴 처리 완료");
    }

    //-------------------------------------- 대출 가입현황 리스트 -----------------------------------------
    @GetMapping("/getUserAndLoanData")
    public ResponseEntity<Map<String, Object>> getAdminAndLoanData() {
        Map<String, Object> response = adminService.getAdminAndLoanData();
        return ResponseEntity.ok(response);
    }
}
