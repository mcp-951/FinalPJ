package com.urambank.uram.controller;

import com.urambank.uram.dto.TaxDTO;
import com.urambank.uram.entities.TaxEntity;
import com.urambank.uram.entities.User;
import com.urambank.uram.service.TaxAdminService;
import com.urambank.uram.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/tax")
public class TaxAdminController {

    @Autowired
    private TaxAdminService taxAdminService;

    @Autowired
    private UserService userService;

    // 전체 세금 리스트 조회
    @GetMapping("/list")
    public List<TaxEntity> getTaxList() {
        return taxAdminService.getAllTaxes();
    }

    // 특정 세금 조회
    @GetMapping("/select/{taxNo}")
    public ResponseEntity<TaxEntity> getTaxByNo(@PathVariable("taxNo") int taxNo) {
        TaxEntity tax = taxAdminService.getTaxByNo(taxNo);
        return ResponseEntity.ok(tax);
    }

    // 특정 세금 수정
    @PutMapping("/edit/{taxNo}")
        public ResponseEntity<String> updateTax(@PathVariable("taxNo") int taxNo, @RequestBody TaxDTO taxDTO) {
        taxAdminService.updateTax(taxNo, taxDTO);
        return ResponseEntity.ok("Tax updated successfully");
    }



    // userNo를 통해 userId 가져오기
    @GetMapping("/userId/{userNo}")
    public ResponseEntity<String> getUserIdByUserNo(@PathVariable("userNo") int userNo) {
        String userId = taxAdminService.getUserIdByUserNo(userNo);
        return ResponseEntity.ok(userId);
    }

    @PostMapping("/insert")
    public ResponseEntity<String> insertTax(@RequestBody TaxDTO taxDTO) {
        taxAdminService.insertTax(taxDTO);
        return ResponseEntity.ok("Tax inserted successfully");
    }

    // "ROLE_USER" 역할을 가진 유저 중 state가 'y'인 유저들의 userId 반환
    @GetMapping("/role-user")
    public ResponseEntity<List<String>> getUsersByRoleUser() {
        List<User> users = userService.getActiveUsersByRoleUser();
        List<String> userIds = users.stream().map(User::getUserId).collect(Collectors.toList());
        return ResponseEntity.ok(userIds);
    }

    // userId로 userNo 가져오기
    @GetMapping("/userNo/{userId}")
    public ResponseEntity<Integer> getUserNoByUserId(@PathVariable("userId") String userId) {
        int userNo = userService.getUserNoByUserId(userId);
        return ResponseEntity.ok(userNo);

    }

    // userNo를 통해 userName 가져오기
    @GetMapping("/name/{userNo}")
    public ResponseEntity<String> getUserNameByUserNo(@PathVariable("userNo") int userNo) {
        String userName = userService.getUserNameByUserNo(userNo);
        return ResponseEntity.ok(userName);
    }

}
