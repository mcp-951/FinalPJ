package com.urambank.uram.service;

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
    }
}
