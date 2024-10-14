package com.urambank.uram.controller;

import com.urambank.uram.dto.LoanJoinDTO;
import com.urambank.uram.dto.UserAccountDTO;
import com.urambank.uram.entities.AutoTransferEntity;
import com.urambank.uram.entities.LoanJoinEntity;
<<<<<<< HEAD
import com.urambank.uram.repository.AutoTransferRepository;
import com.urambank.uram.service.ProductService;
=======
>>>>>>> origin/cr
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
<<<<<<< HEAD
    private final ProductService productService;
    private final AutoTransferRepository autoTransferRepository; // 자동이체 관련 Repository 추가

    // 대출 상품 페이징 처리하여 가져오기
    @GetMapping("/loans/page")
    public Page<ProductDTO> getLoanProductsPaged(
            @RequestParam(name = "getPage", defaultValue = "0") int page,
            @RequestParam(name = "getSize", defaultValue = "3") int size) {
        logger.info("<< getLoanProductsPaged >>");
        return productService.getLoanProductsPaged(page, size);
    }

    // 사용자 계좌 정보 조회
    @GetMapping("/user")
    public ResponseEntity<List<UserAccountDTO>> getUserAccounts(@RequestHeader("Authorization") String token) {
        String jwtToken = token.replace("Bearer ", "");
        List<UserAccountDTO> accounts = productService.getUserAccounts(jwtToken);
        return ResponseEntity.ok(accounts);
    }

    // LoanJoin 데이터 저장
    // LoanJoin 데이터 저장
    @PostMapping("/loan/join")
    public LoanJoinEntity joinLoan(@RequestHeader("Authorization") String token, @RequestBody LoanJoinDTO loanJoinDTO) {
        String jwtToken = token.replace("Bearer ", "");
        return productService.saveLoanJoin(loanJoinDTO, jwtToken);
    }

    // 자동이체 리스트 가져오기
    @GetMapping("/autotransfers")
    public ResponseEntity<List<AutoTransferEntity>> getAutoTransfers() {
        List<AutoTransferEntity> autoTransfers = autoTransferRepository.findAll();
        return ResponseEntity.ok(autoTransfers);  // 자동이체 리스트 반환
    }
=======

//    private final ProductService productService;
//
////    // 예금 상품 3개 가져오기
////    @GetMapping("/savings")
////    public List<ProductDTO> getSavingProducts() {
////        return productService.getSavingProducts();
////    }
////
////    // 적금 상품 3개 가져오기
////    @GetMapping("/deposits")
////    public List<ProductDTO> getDepositProducts() {
////        return productService.getDepositProducts();
////    }
//
//    // 대출 상품 페이징 처리하여 가져오기
//    @GetMapping("/loans/page")
//    public Page<ProductDTO> getLoanProductsPaged(
//            @RequestParam(name = "getPage", defaultValue = "0") int page,
//            @RequestParam(name = "getSize", defaultValue = "3") int size) {
//        logger.info("<< getLoanProductsPaged >>");
//        return productService.getLoanProductsPaged(page, size);
//    }
//
//    // 사용자 계좌 정보 조회
//    @GetMapping("/user")
//    public ResponseEntity<List<UserAccountDTO>> getUserAccounts(@RequestHeader("Authorization") String token) {
//        String jwtToken = token.replace("Bearer ", "");
//        List<UserAccountDTO> accounts = productService.getUserAccounts(jwtToken);
//        return ResponseEntity.ok(accounts);
//    }
//
//    // LoanJoin 데이터 저장
//    @PostMapping("/loan/join")
//    public LoanJoinEntity joinLoan(@RequestHeader("Authorization") String token, @RequestBody LoanJoinDTO loanJoinDTO) {
//        String jwtToken = token.replace("Bearer ", "");
//        return productService.saveLoanJoin(loanJoinDTO, jwtToken);
//    }
>>>>>>> origin/cr
}
