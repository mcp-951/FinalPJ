package com.urambank.uram.controller;

<<<<<<< HEAD
=======
<<<<<<< HEAD
import com.urambank.uram.dto.SupportDTO;
import com.urambank.uram.service.SupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
=======
>>>>>>> origin/minwoo
import com.urambank.uram.entities.SupportEntity;
import com.urambank.uram.service.SupportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")  // CORS 설정
<<<<<<< HEAD
=======
>>>>>>> 50b13222d0394431ef705665178103e286840219
>>>>>>> origin/minwoo
@RestController
@RequestMapping("/support")
public class SupportController {

<<<<<<< HEAD
=======
<<<<<<< HEAD
    private final SupportService supportService;

    // 특정 사용자 ID로 문의글 목록 조회
    @GetMapping("/board/{userNo}")
    public ResponseEntity<?> getSupportByUserId(@PathVariable("userNo") int userNo) {
        return ResponseEntity.ok(supportService.getSupportByUserId(userNo));
    }

    // 특정 문의글 ID로 상세 조회
    @GetMapping("/detail/{id}")
    public ResponseEntity<SupportDTO> getSupportByQnaNo(@PathVariable("id") int qnaNo) {
        SupportDTO inquiry = supportService.getSupportByQnaNo(qnaNo);
        if (inquiry != null) {
            return ResponseEntity.ok(inquiry);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    // 문의글 등록
    @PostMapping("/boardInsert")
    public ResponseEntity<Integer> insertBoard(@RequestBody SupportDTO dto) {
        int result = supportService.insertBoard(dto);
        return ResponseEntity.ok(result);
    }

    // 문의글 수정
    @PutMapping("/{qnaNo}")
    public ResponseEntity<String> updateInquiry(
            @PathVariable("qnaNo") int qnaNo,
            @RequestBody SupportDTO dto) {
        boolean updated = supportService.updateInquiry(qnaNo, dto);
        if (updated) {
            return ResponseEntity.ok("문의글이 수정되었습니다.");
        } else {
            return ResponseEntity.status(404).body("해당 문의글을 찾을 수 없습니다.");
        }
    }

    // 문의글 삭제
    @DeleteMapping("/{qnaNo}")
    public ResponseEntity<String> deleteInquiry(@PathVariable("qnaNo") int qnaNo) {
        boolean deleted = supportService.deleteInquiry(qnaNo);
        if (deleted) {
            return ResponseEntity.ok("문의글이 삭제되었습니다.");
        } else {
            return ResponseEntity.status(404).body("해당 문의글을 찾을 수 없습니다.");
=======
>>>>>>> origin/minwoo
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
<<<<<<< HEAD
=======
>>>>>>> 50b13222d0394431ef705665178103e286840219
>>>>>>> origin/minwoo
        }
    }
}
