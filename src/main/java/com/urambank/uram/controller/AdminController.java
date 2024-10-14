package com.urambank.uram.controller;

import com.urambank.uram.dto.ProductDTO;
import com.urambank.uram.dto.UserDTO;
import com.urambank.uram.service.AdminService;
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

//    private final AdminService adminService;
//
//    public AdminController(AdminService adminService) {
//        this.adminService = adminService;
//    }
//
//    // 모든 상품 조회
//    @GetMapping("/productList")
//    public ResponseEntity<List<ProductDTO>> getAllProducts() {
//        List<ProductDTO> list = adminService.getAllProducts();
//        return ResponseEntity.ok(list);
//    }
//
//    // 특정 카테고리의 상품 조회 (예금, 적금 등)
//    @GetMapping("/productList/{category}")
//    public ResponseEntity<List<ProductDTO>> getProductsByCategory(@PathVariable String category) {
//        List<ProductDTO> products = adminService.getProductsByCategory(category);
//        return ResponseEntity.ok(products);
//    }
//
//    // 상품 등록
//    @PostMapping("/add")
//    public ResponseEntity<ProductDTO> addProduct(@RequestBody ProductDTO productDTO) {
//        ProductDTO newProduct = adminService.addProduct(productDTO);
//        return ResponseEntity.ok(newProduct);
//    }
//
//    // 상품 수정
//    @PutMapping("/updateProduct/{productNo}")
//    public ResponseEntity<ProductDTO> updateProduct(@PathVariable int productNo, @RequestBody ProductDTO productDTO) {
//        ProductDTO updatedProduct = adminService.updateProduct(productNo, productDTO);
//        return ResponseEntity.ok(updatedProduct);
//    }
//
//    // 상품 상태 변경 (삭제 대신 상태를 'n'으로 설정)
//    @PutMapping("/delete/{productNo}")
//    public ResponseEntity<Void> deleteProduct(@PathVariable int productNo) {
//        adminService.updateViewState(productNo, "n");
//        return ResponseEntity.noContent().build();
//    }
//
//    // 금융 상품 등록 수를 반환하는 API (그래프를 위한 데이터)
//    @GetMapping("/summary")
//    public ResponseEntity<Map<String, Integer>> getProductSummary() {
//        Map<String, Integer> summary = new HashMap<>();
//        summary.put("예금", adminService.countProductsByCategory("예금"));
//        summary.put("적금", adminService.countProductsByCategory("적금"));
//        summary.put("대출", adminService.countProductsByCategory("대출"));
//        return ResponseEntity.ok(summary);
//    }
//
//    // 활성 회원 목록 조회 (DTO 사용)
//    @GetMapping("/getUserList")
//    public ResponseEntity<List<UserDTO>> getAllUsers() {
//        List<UserDTO> users = adminService.getAllUsers();
//        return ResponseEntity.ok(users);
//    }
//
//    // 탈퇴 회원 목록 조회 (DTO 사용)
//    @GetMapping("/retired")
//    public ResponseEntity<List<UserDTO>> getRetiredUsers() {
//        List<UserDTO> users = adminService.getRetiredUsers();
//        return ResponseEntity.ok(users);
//    }
//
//    // 회원 정보 수정 (DTO 사용)
//    @PutMapping("/setState/{userNo}")
//    public ResponseEntity<String> setState(@PathVariable("userNo") int userNo,@RequestBody UserDTO dto) {
//
//        adminService.setState(userNo, dto.getState());
//        return ResponseEntity.ok("변경 완료");
//    }
//
//    // 회원 정보 수정 (DTO 사용)
//    @PutMapping("/updateUser/{userNo}")
//    public ResponseEntity<UserDTO> updateUser(@PathVariable("userNo") int userNo, @RequestBody UserDTO userDTO) {
//        System.out.println("<<< updateUser >>>");
//
//        UserDTO updatedUser = adminService.updateUser(userNo, userDTO);
//        return ResponseEntity.ok(updatedUser);
//    }
//
//    // 회원 탈퇴 처리 (DTO 사용)
//    @PutMapping("/deactivate/{userNo}")
//    public ResponseEntity<String> deactivateUser(@PathVariable int userNo) {
//        adminService.deactivateUser(userNo);
//        return ResponseEntity.ok("회원 탈퇴 처리 완료");
//    }
}
