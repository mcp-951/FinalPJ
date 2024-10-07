package com.urambank.uram.controller;

import com.urambank.uram.dto.CoinListDTO;
import com.urambank.uram.service.InvestmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/uram")
@RestController
public class InvestmentRightContoller {
    final private InvestmentService investmentService;

    @GetMapping("/list")
    public List<CoinListDTO> coinList(){
        return investmentService.coinList();
    }
}
