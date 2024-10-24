package com.urambank.uram.controller;

import com.urambank.uram.dto.SupportDTO;
import com.urambank.uram.service.SupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/support")
public class SupportController {

    private final SupportService supportService;

    // 특정 사용자 ID로 삭제되지 않은 문의글 목록 조회
    @GetMapping("/board/{userNo}")
    public ResponseEntity<List<SupportDTO>> getActiveInquiriesByUser(@PathVariable("userNo") Integer userNo) {
        System.out.println("<<< getActiveInquiriesByUser >>>");
        System.out.println("userNo : " + userNo);
        List<SupportDTO> inquiries = supportService.getActiveSupportByUserId(userNo);
        return ResponseEntity.ok(inquiries);
    }

    // 특정 문의글 ID로 상세 조회
    @GetMapping("/detail/{qnaNo}")
    public ResponseEntity<SupportDTO> getSupportByQnaNo(@PathVariable("qnaNo") Integer qnaNo) {
        SupportDTO inquiry = supportService.getSupportByQnaNo(qnaNo);
        return inquiry != null
                ? ResponseEntity.ok(inquiry)
                : ResponseEntity.status(404).body(null);
    }

    // 문의글 등록
    @PostMapping("/board")
    public ResponseEntity<String> insertBoard(@RequestBody SupportDTO dto) {
        int result = supportService.insertBoard(dto);
        return result == 1
                ? ResponseEntity.ok("문의글이 성공적으로 등록되었습니다.")
                : ResponseEntity.status(500).body("문의글 등록에 실패했습니다.");
    }

    // 문의글 수정
    @PutMapping("/{qnaNo}")
    public ResponseEntity<String> updateInquiry(
            @PathVariable("qnaNo") Integer qnaNo,
            @RequestBody SupportDTO dto) {
        boolean updated = supportService.updateInquiry(qnaNo, dto);
        return updated
                ? ResponseEntity.ok("문의글이 수정되었습니다.")
                : ResponseEntity.status(404).body("해당 문의글을 찾을 수 없습니다.");
    }

    // 문의글 삭제 (논리적 삭제)
    @DeleteMapping("/{qnaNo}")
    public ResponseEntity<String> deleteInquiry(@PathVariable("qnaNo") Integer qnaNo) {
        boolean deleted = supportService.deleteInquiry(qnaNo);
        return deleted
                ? ResponseEntity.ok("문의글이 삭제되었습니다.")
                : ResponseEntity.status(404).body("해당 문의글을 찾을 수 없습니다.");
    }
}
