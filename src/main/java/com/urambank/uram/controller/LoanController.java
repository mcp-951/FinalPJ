package com.urambank.uram.controller;

import com.urambank.uram.dto.LoanProductDTO;
import com.urambank.uram.dto.UserDTO;
import com.urambank.uram.service.LoanServiece;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/loan")
public class LoanController {
    private final LoanServiece loanServiec;

    @GetMapping("/list")
    public List<LoanProductDTO> loanProductList(){
        loanServiec.loanProductList();
        return loanServiec.loanProductList();
    }

    @GetMapping("/detail/{loanProductNo}")
    public LoanProductDTO loanProductDetail(@PathVariable("loanProductNo") int loanProductNo){
        return loanServiec.loanProductDetail(loanProductNo);
    }

    @GetMapping("/apply/{userNo}")
    public UserDTO userInfo(@PathVariable("userNo") int userNo){
        return loanServiec.userInfo(userNo);
    }
}
