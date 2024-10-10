package com.urambank.uram.controller;

import com.urambank.uram.dto.TaxDTO;
import com.urambank.uram.service.TaxService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/tax")
public class TaxContoller {

    final TaxService taxService;


    @GetMapping("/TaxMain/{userNo}/{category}")
    public TaxDTO electroTax(@PathVariable("userNo") int userNo, @PathVariable("category") String category){
        System.out.println(taxService.taxTomonth(userNo, category) + "값임");
        return taxService.taxTomonth(userNo, category);
    }

    @GetMapping("/taxSelectList/{userNo}/{taxYear}/{taxMonth}")
    public TaxDTO taxSelectList(@PathVariable("userNo") int userNo, @PathVariable("taxYear") String taxYear, @PathVariable("taxMonth") String taxMonth){
        System.out.println(taxService.taxSelectList(userNo, taxYear, taxMonth)+ "하이이");
        return taxService.taxSelectList(userNo, taxYear, taxMonth);
    }

    @GetMapping("/taxHistory/{userNo}")
    public List<TaxDTO> userHistory(@PathVariable("userNo") int userNo){
        return taxService.taxUserLog(userNo);
    }
}
