package com.urambank.uram.service;

import com.urambank.uram.dto.SupportDTO;
import com.urambank.uram.entities.SupportEntity;
import com.urambank.uram.repository.SupportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class AdminSupportService {

    private final SupportRepository supportRepository;

    // 삭제되지 않은 모든 문의글 목록 조회
    public List<SupportDTO> getAllInquiries() {
        List<SupportEntity> supports = supportRepository.findAllByIsDeleted("N");
        List<SupportDTO> dtoList = new ArrayList<>();
        for (SupportEntity support : supports) {
            dtoList.add(convertToDTO(support));
        }
        return dtoList;
    }

    // 특정 문의글 ID로 조회
    public SupportDTO getInquiryById(Integer qnaNo) {
        Optional<SupportEntity> supportOptional = supportRepository.findById(qnaNo);
        return supportOptional.map(this::convertToDTO).orElse(null);
    }

    // 문의글 답변 업데이트
    public boolean updateAnswer(Integer qnaNo, String answer) {
        Optional<SupportEntity> supportOptional = supportRepository.findById(qnaNo);
        if (supportOptional.isPresent()) {
            SupportEntity support = supportOptional.get();
            support.setAnswer(answer);
            support.setStatus("답변 완료");
            supportRepository.save(support);
            return true;
        }
        return false;
    }

    // 엔티티를 DTO로 변환
    private SupportDTO convertToDTO(SupportEntity support) {
        return SupportDTO.builder()
                .qnaNo(support.getQnaNo())
                .qnaTitle(support.getQnaTitle())
                .message(support.getMessage())
                .answer(support.getAnswer())
                .userId(support.getUserId())
                .status(support.getStatus())
                .createdAt(support.getCreatedAt())
                .answerDay(support.getAnswerDay())
                .build();
    }
}
