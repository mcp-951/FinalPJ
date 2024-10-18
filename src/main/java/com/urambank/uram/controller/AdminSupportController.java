package com.urambank.uram.controller;

import com.urambank.uram.dto.SupportDTO;
import com.urambank.uram.service.AdminSupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/admin/support")
public class AdminSupportController {

    private final AdminSupportService adminSupportService;

    // 모든 삭제되지 않은 문의글 목록 조회
    @GetMapping("/inquiries")
    public ResponseEntity<List<SupportDTO>> getAllInquiries() {
        List<SupportDTO> inquiries = adminSupportService.getAllInquiries();
        return ResponseEntity.ok(inquiries);
    }

    // 특정 문의글에 답변 등록
    @PutMapping("/answer/{qnaNo}")
    public ResponseEntity<String> updateAnswer(
            @PathVariable("qnaNo") Integer qnaNo,
            @RequestBody String answer) {
        boolean updated = adminSupportService.updateAnswer(qnaNo, answer);
        return updated
                ? ResponseEntity.ok("답변이 성공적으로 등록되었습니다.")
                : ResponseEntity.status(404).body("문의글을 찾을 수 없습니다.");
    }

    // 특정 문의글 상세 조회
    @GetMapping("/inquiry/{qnaNo}")
    public ResponseEntity<SupportDTO> getInquiryDetail(@PathVariable("qnaNo") Integer qnaNo) {
        SupportDTO inquiry = adminSupportService.getInquiryById(qnaNo);
        return inquiry != null
                ? ResponseEntity.ok(inquiry)
                : ResponseEntity.status(404).body(null);
    }
}
