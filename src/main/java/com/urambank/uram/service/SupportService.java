package com.urambank.uram.service;

<<<<<<< HEAD
import com.urambank.uram.dto.SupportDTO;
import com.urambank.uram.entities.Support;
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

    // 사용자 ID로 문의글 목록 조회
    public List<SupportDTO> getSupportByUserId(int userId) {
        List<Support> supports = supportRepository.findAllByUserId(userId);
        List<SupportDTO> dtoList = new ArrayList<>();
        for (Support support : supports) {
            dtoList.add(convertToDTO(support));
        }
        return dtoList;
    }

    // 특정 문의글 ID로 조회
    public SupportDTO getSupportByQnaNo(int qnaNo) {
        Optional<Support> support = supportRepository.findById(qnaNo);
        return support.map(this::convertToDTO).orElse(null);
    }

    // 문의글 등록
    public int insertBoard(SupportDTO dto) {
        Support support = Support.builder()
                .qnaTitle(dto.getQnaTitle())
                .message(dto.getMessage())
                .file(dto.getFile())
                .userId(dto.getUserId())
                .build();
        Support savedEntity = supportRepository.save(support);
        return (savedEntity != null && savedEntity.getQnaNo() != null) ? 1 : 0;
    }

    // 문의글 수정
    public boolean updateInquiry(int qnaNo, SupportDTO dto) {
        Optional<Support> optionalSupport = supportRepository.findById(qnaNo);
        if (optionalSupport.isPresent()) {
            Support support = optionalSupport.get();
            support.setQnaTitle(dto.getQnaTitle());
            support.setMessage(dto.getMessage());
            supportRepository.save(support);
            return true;
        }
        return false;
    }

    // 문의글 삭제
    public boolean deleteInquiry(int qnaNo) {
        if (supportRepository.existsById(qnaNo)) {
            supportRepository.deleteById(qnaNo);
            return true;
        }
        return false;
    }

    // 엔티티를 DTO로 변환
    private SupportDTO convertToDTO(Support support) {
        return SupportDTO.builder()
                .qnaNo(support.getQnaNo())
                .qnaTitle(support.getQnaTitle())
                .message(support.getMessage())
                .answer(support.getAnswer())
                .userId(support.getUserId())
                .createdAt(support.getCreatedAt())
                .status(support.getStatus())
                .build();
=======
import com.urambank.uram.entities.SupportEntity;
import com.urambank.uram.repository.SupportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupportService {

    @Autowired
    private SupportRepository supportRepository;

    // 전체 문의글 조회
    public List<SupportEntity> getAllSupports() {
        return supportRepository.findAll();
    }

    // 문의글 등록
    public SupportEntity saveSupport(SupportEntity support) {
        // 문의글 등록 시 초기 상태와 등록 날짜를 설정
        support.setStatus("답변전");  // 기본 상태는 "답변전"
        support.setCreatedAt(java.time.LocalDateTime.now());  // 현재 날짜와 시간을 설정
        return supportRepository.save(support);
>>>>>>> 50b13222d0394431ef705665178103e286840219
    }
}
