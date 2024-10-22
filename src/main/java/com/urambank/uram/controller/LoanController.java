package com.urambank.uram.controller;

import com.urambank.uram.dto.*;
import com.urambank.uram.service.LoanServiece;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/apply/join/{userNo}/{loanProductNo}")
    public int loanInfo(@PathVariable("userNo") int userNo, @PathVariable("loanProductNo") int loanProductNo) {
        System.out.println(userNo + loanProductNo + "하이이");
        return loanServiec.loanJoinCheck(userNo, loanProductNo);
    }

    @GetMapping("/apply/account/{userNo}")
    public List<AccountDTO> userAccountList (@PathVariable("userNo") int userNo) {
        return loanServiec.userAccountList(userNo);
    }

    @PostMapping("/apply/send")
    public int applyLoan (@RequestBody RequestPayload requestPayload){
        int a =0;
        LoanDTO loanDTO = requestPayload.getLoanDTO();
        int result_join = loanServiec.userLoanJoin(loanDTO);

        AutoTransferDTO autoTransferDTO = requestPayload.getAutoTransferDTO();
        int result_join2 = loanServiec.userAuto_TransferJoin(autoTransferDTO, loanDTO);
        
        if (result_join == 1 && result_join2 ==1){
            System.out.println("성공");

            return a =1;
        }

        return a;
    }
}
