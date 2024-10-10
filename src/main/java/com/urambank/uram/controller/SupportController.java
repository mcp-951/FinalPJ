package com.urambank.uram.controller;

import com.urambank.uram.entities.SupportEntity;
import com.urambank.uram.service.SupportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")  // CORS 설정
@RestController
@RequestMapping("/support")
public class SupportController {

    @Autowired
    private SupportService supportService;

    // 전체 문의글 조회
    @GetMapping("/all")
    public ResponseEntity<List<SupportEntity>> getAllSupports() {
        List<SupportEntity> supports = supportService.getAllSupports();
        if (supports.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(supports, HttpStatus.OK);
    }

    // 문의글 등록
    @PostMapping("/create")
    public ResponseEntity<SupportEntity> createSupport(@RequestBody SupportEntity support) {
        try {
            SupportEntity createdSupport = supportService.saveSupport(support);
            return new ResponseEntity<>(createdSupport, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
