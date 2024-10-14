package com.urambank.uram.controller;

import com.urambank.uram.dto.SupportDTO;
import com.urambank.uram.service.SupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/support")
public class SupportController {

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
        }
    }
}
