package com.urambank.uram.service;

import com.urambank.uram.entities.LogEntity;
import com.urambank.uram.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogService {

    @Autowired
    private LogRepository logRepository;

    // 모든 로그 데이터를 DB에서 불러오는 메소드
    public List<LogEntity> getAllLogs() {
        return logRepository.findAll();
    }
}
