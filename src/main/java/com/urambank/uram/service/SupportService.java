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
public class SupportService {

    private final SupportRepository supportRepository;

//    // 사용자 ID로 문의글 목록 조회
//    public List<SupportDTO> getSupportByUserId(int userId) {
//        List<SupportEntity> supports = supportRepository.findAllByUserId(userId);
//        List<SupportDTO> dtoList = new ArrayList<>();
//        for (SupportEntity support : supports) {
//            dtoList.add(convertToDTO(support));
//        }
//        return dtoList;
//    }
//
//    // 특정 문의글 ID로 조회
//    public SupportDTO getSupportByQnaNo(int qnaNo) {
//        Optional<SupportEntity> support = supportRepository.findById(qnaNo);
//        return support.map(this::convertToDTO).orElse(null);
//    }

    // 문의글 등록
//    public int insertBoard(SupportDTO dto) {
//        SupportEntity support = SupportEntity.builder()
//                .qnaTitle(dto.getQnaTitle())
//                .message(dto.getMessage())
//                .build();
//        SupportEntity savedEntity = supportRepository.save(support);
//        return (savedEntity != null && savedEntity.getQnaNo() != null) ? 1 : 0;
//    }
//
//    // 문의글 수정
//    public boolean updateInquiry(int qnaNo, SupportDTO dto) {
//        Optional<SupportEntity> optionalSupport = supportRepository.findById(qnaNo);
//        if (optionalSupport.isPresent()) {
//            SupportEntity support = optionalSupport.get();
//            support.setQnaTitle(dto.getQnaTitle());
//            support.setMessage(dto.getMessage());
//            supportRepository.save(support);
//            return true;
//        }
//        return false;
//    }
//
//    // 문의글 삭제
//    public boolean deleteInquiry(int qnaNo) {
//        if (supportRepository.existsById(qnaNo)) {
//            supportRepository.deleteById(qnaNo);
//            return true;
//        }
//        return false;
//    }
//
//    // 엔티티를 DTO로 변환
//    private SupportDTO convertToDTO(SupportEntity support) {
//        return SupportDTO.builder()
//                .qnaNo(support.getQnaNo())
//                .qnaTitle(support.getQnaTitle())
//                .message(support.getMessage())
//                .answer(support.getAnswer())
//                .createdAt(support.getCreatedAt())
//                .status(support.getStatus())
//                .build();
//    }
}
