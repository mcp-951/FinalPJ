package com.urambank.uram.controller;

import com.urambank.uram.entities.LogEntity;
import com.urambank.uram.service.LogService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
public class AssetsController {

    @Autowired
    private LogService logService;

    // Endpoint to get all asset logs
    @GetMapping("/logs")
    public ResponseEntity<List<LogEntity>> getAllLogs() {
        List<LogEntity> logs = logService.getAllLogs();
        return ResponseEntity.ok(logs);
    }

    // Endpoint to get logs for a specific date
    @GetMapping("/logs/{date}")
    public ResponseEntity<List<LogEntity>> getLogsByDate(@PathVariable String date) {
        List<LogEntity> logs = logService.getLogsByDate(date);
        return ResponseEntity.ok(logs);
    }
}
