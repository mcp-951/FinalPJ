package com.urambank.uram.controller;

import com.urambank.uram.dto.TaxDTO;
import com.urambank.uram.service.TaxService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/tax")
public class TaxContoller {

    final TaxService taxService;


    @GetMapping("/electroTaxMain/{userNo}")
    public TaxDTO electroTax(@PathVariable("userNo") int userNo){
        System.out.println(taxService.electroTaxTomonth(userNo) + "값임");
        return taxService.electroTaxTomonth(userNo);
    }
}
