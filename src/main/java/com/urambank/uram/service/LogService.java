package com.urambank.uram.service;

import com.urambank.uram.entities.LogEntity;
import com.urambank.uram.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service
public class LogService {

    @Autowired
    private LogRepository logRepository;

    // Method to fetch all logs from the database
    public List<LogEntity> getAllLogs() {
        return logRepository.findAll();
    }

    // Method to fetch logs by date
    public List<LogEntity> getLogsByDate(String dateStr) {
        try {
            Date date = new SimpleDateFormat("yyyy-MM-dd").parse(dateStr);
            return logRepository.findBySendDate(date);
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
    }
}
