package com.urambank.uram.service;

import com.urambank.uram.dto.SupportDTO;
import com.urambank.uram.entities.SupportEntity;
import com.urambank.uram.repository.SupportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class SupportService {

    private final SupportRepository supportRepository;

    // 특정 사용자 ID로 삭제되지 않은 문의글 목록 조회
    public List<SupportDTO> getActiveSupportByUserId(Integer userId) {
        List<SupportEntity> supports = supportRepository.findAllByUserIdAndIsDeleted(userId, "N");
        List<SupportDTO> dtoList = new ArrayList<>();
        for (SupportEntity support : supports) {
            System.out.println(convertToDTO(support));
            dtoList.add(convertToDTO(support));
        }
        return dtoList;
    }

    // 특정 문의글 ID로 조회
    public SupportDTO getSupportByQnaNo(Integer qnaNo) {
        Optional<SupportEntity> support = supportRepository.findById(qnaNo);
        return support.map(this::convertToDTO).orElse(null);
    }

    // 문의글 등록
    public int insertBoard(SupportDTO dto) {
        SupportEntity support = SupportEntity.builder()
                .qnaTitle(dto.getQnaTitle())
                .message(dto.getMessage())
                .answer(dto.getAnswer())
                .userId(dto.getUserId())
                .isDeleted("N")
                .createdAt(Date.valueOf(LocalDate.now()))
                .status("답변 전")
                .build();
        SupportEntity savedEntity = supportRepository.save(support);
        return (savedEntity.getQnaNo() != null) ? 1 : 0;
    }

    // 문의글 수정
    public boolean updateInquiry(Integer qnaNo, SupportDTO dto) {
        Optional<SupportEntity> optionalSupport = supportRepository.findById(qnaNo);
        if (optionalSupport.isPresent()) {
            SupportEntity support = optionalSupport.get();
            support.setQnaTitle(dto.getQnaTitle());
            support.setMessage(dto.getMessage());
            supportRepository.save(support);
            return true;
        }
        return false;
    }

    // 문의글 삭제 (isDeleted를 'Y'로 설정)
    public boolean deleteInquiry(Integer qnaNo) {
        Optional<SupportEntity> optionalSupport = supportRepository.findById(qnaNo);
        if (optionalSupport.isPresent()) {
            SupportEntity support = optionalSupport.get();
            support.setIsDeleted("Y");
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
