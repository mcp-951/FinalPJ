package com.urambank.uram.service;

import com.urambank.uram.entities.TaxEntity;
import com.urambank.uram.entities.User;
import com.urambank.uram.dto.TaxDTO;
import com.urambank.uram.repository.TaxRepository;
import com.urambank.uram.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDate;
import java.util.List;

@Service
public class TaxAdminService {

    @Autowired
    private TaxRepository taxRepository;

    @Autowired
    private UserRepository userInfoRepository;

    @Autowired
    private UserService userService;

    public List<TaxEntity> getAllTaxes() {
        return taxRepository.findAll();
    }

    public TaxEntity getTaxByNo(int taxNo) {
        return taxRepository.findById(taxNo).orElseThrow(() -> new RuntimeException("Tax not found"));
    }

    public void updateTax(int taxNo, TaxDTO taxDTO) {
        TaxEntity tax = taxRepository.findById(taxNo).orElseThrow(() -> new RuntimeException("Tax not found"));

        tax.setFee1(taxDTO.getFee1());
        tax.setFee2(taxDTO.getFee2());
        tax.setFee3(taxDTO.getFee3());
        tax.setBasicFee1(taxDTO.getBasicFee1());
        tax.setBasicFee2(taxDTO.getBasicFee2());
        tax.setBasicFee3(taxDTO.getBasicFee3());
        tax.setTaxState(taxDTO.getTaxState());
        tax.setTaxCategory(taxDTO.getTaxCategory());
        tax.setTaxDeadLine(taxDTO.getTaxDeadLine());
        taxRepository.save(tax);
    }



    // userNo로 User에서 userId를 가져오는 메서드
    public String getUserIdByUserNo(int userNo) {
        User user = userInfoRepository.findByUserNo(userNo);
        return user.getUserId();  // userId 반환
    }

    public void insertTax(TaxDTO taxDTO) {
        TaxEntity tax = new TaxEntity();
        tax.setUserNo(taxDTO.getUserNo());
        tax.setFee1(taxDTO.getFee1());
        tax.setFee2(taxDTO.getFee2());
        tax.setFee3(taxDTO.getFee3());
        tax.setBasicFee1(taxDTO.getBasicFee1());
        tax.setBasicFee2(taxDTO.getBasicFee2());
        tax.setBasicFee3(taxDTO.getBasicFee3());
        tax.setTaxDeadLine(taxDTO.getTaxDeadLine());

        // LocalDate를 java.sql.Date로 변환
        tax.setTaxWriteDate(java.sql.Date.valueOf(LocalDate.now())); // 발행일을 현재 날짜로 설정

        tax.setTaxState(taxDTO.getTaxState());
        tax.setTaxCategory(taxDTO.getTaxCategory());

        taxRepository.save(tax);  // DB에 저장
    }

    // 회원 이름을 기준으로 userNo 가져오기
    @GetMapping("/findByName/{name}")
    public ResponseEntity<Integer> getUserNoByName(@PathVariable String name) {
        int userNo = userService.getUserNoByName(name);
        if (userNo != 0) {
            return new ResponseEntity<>(userNo, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


}
