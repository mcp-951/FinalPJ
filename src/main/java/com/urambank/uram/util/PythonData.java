package com.urambank.uram.util;

import lombok.ToString;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;

@ToString
@Component
public class PythonData {
    public String pythonStart(){
        ProcessBuilder pb = new ProcessBuilder("python", "C:\\F_project\\ict03\\selenium\\ex.py");
        StringBuilder output = new StringBuilder();

        try{
            Process process = pb.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), "UTF-8"));
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
            int exitCode = process.waitFor();
            System.out.println("Exited with code: " + exitCode);
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(output.toString());
        return output.toString();
    }
}
