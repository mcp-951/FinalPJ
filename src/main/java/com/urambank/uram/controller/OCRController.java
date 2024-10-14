package com.urambank.uram.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RequiredArgsConstructor
@RestController
@RequestMapping("/ocr")
public class OCRController {

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/python/ocr.png";

    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file) {
        // 기존 파일 삭제
        File existingFile = new File(UPLOAD_DIR);
        if (existingFile.exists()) {
            if (existingFile.delete()) {
                System.out.println("Existing file deleted: " + UPLOAD_DIR);
            } else {
                System.err.println("Failed to delete existing file: " + UPLOAD_DIR);
            }
        }

        // 새 파일 저장
        try {
            file.transferTo(new File(UPLOAD_DIR));
            return "File uploaded and saved as ocr.png"; // 성공 메시지 반환
        } catch (IOException e) {
            e.printStackTrace();
            return "Failed to upload file"; // 실패 메시지 반환
        }
    }
}
