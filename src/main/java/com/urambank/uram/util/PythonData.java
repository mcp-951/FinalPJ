package com.urambank.uram.util;

import lombok.ToString;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

@ToString
@Component
public class PythonData {
    public String pythonStart() {
        StringBuilder result = new StringBuilder();

        try {
            // 프로젝트 루트 디렉토리의 python 폴더 안에 있는 ocr.py 스크립트 실행
            String projectRoot = System.getProperty("user.dir");
            String pythonScriptPath = projectRoot + File.separator + "python" + File.separator + "ocr.py";

            // Python 스크립트를 실행할 명령어 생성
            ProcessBuilder processBuilder = new ProcessBuilder("C:\\Users\\user\\AppData\\Local\\Programs\\Python\\Python312\\python.exe", pythonScriptPath);
            processBuilder.redirectErrorStream(true);  // 오류 출력을 표준 출력에 합치기

            // 프로세스 시작
            Process process = processBuilder.start();

            // 프로세스의 출력 내용을 UTF-8로 읽기
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8));
            String line;
            while ((line = reader.readLine()) != null) {
                result.append(line).append("\n");  // 출력 내용을 계속해서 문자열로 저장
            }

            // 프로세스가 종료될 때까지 대기
            process.waitFor();

        } catch (Exception e) {
            e.printStackTrace();
            return "Error running Python script: " + e.getMessage();
        }

        // Python 출력 결과 반환
        System.out.println(result.toString()+ "값");
        return result.toString();
    }
}