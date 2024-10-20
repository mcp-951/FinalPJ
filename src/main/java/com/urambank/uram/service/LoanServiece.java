package com.urambank.uram.service;

import com.urambank.uram.dto.LoanProductDTO;
import com.urambank.uram.dto.UserDTO;
import com.urambank.uram.entities.LoanProductEntity;
import com.urambank.uram.entities.User;
import com.urambank.uram.repository.LoanProductRepository;
import com.urambank.uram.repository.LoanRepository;
import com.urambank.uram.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanServiece {
    private final LoanProductRepository loanProductRepository;
    private final UserRepository userRepository;
    private final LoanRepository loanRepository;

    public List<LoanProductDTO> loanProductList(){
        List<LoanProductEntity> eList = loanProductRepository.findByViewPoint('Y');
        List<LoanProductDTO> list = new ArrayList<>();

        for (LoanProductEntity eDto : eList){
            LoanProductDTO dto = new LoanProductDTO();

            dto = LoanProductDTO.builder()
                    .loanProductNo(eDto.getLoanProductNo())
                    .loanProductTitle(eDto.getLoanProductTitle())
                    .loanMaxLimit(eDto.getLoanMaxLimit())
                    .loanMinLimit(eDto.getLoanMinLimit())
                    .loanMaxTern(eDto.getLoanMaxTern())
                    .loanMinTern(eDto.getLoanMinTern())
                    .minInterestRate(eDto.getMinInterestRate())
                    .maxInterestRate(eDto.getMaxInterestRate())
                    .earlyRepaymentFee(eDto.getEarlyRepaymentFee())
                    .build();
            list.add(dto);
        }

        return list;
    }

    public LoanProductDTO loanProductDetail(int loanProductNo){
        LoanProductDTO dto = new LoanProductDTO();
        LoanProductEntity eDto = loanProductRepository.findByLoanProductNo(loanProductNo);
        dto = LoanProductDTO.builder()
                .loanProductNo(eDto.getLoanProductNo())
                .loanProductTitle(eDto.getLoanProductTitle())
                .loanMaxLimit(eDto.getLoanMaxLimit())
                .loanMinLimit(eDto.getLoanMinLimit())
                .loanMaxTern(eDto.getLoanMaxTern())
                .loanMinTern(eDto.getLoanMinTern())
                .minInterestRate(eDto.getMinInterestRate())
                .maxInterestRate(eDto.getMaxInterestRate())
                .earlyRepaymentFee(eDto.getEarlyRepaymentFee())
                .minCreditScore(eDto.getMinCreditScore())
                .build();
        return dto;
    }

    public UserDTO userInfo(int userNo){
        User eDto =  userRepository.findByUserNo(userNo);
        UserDTO dto = UserDTO.builder()
                .name(eDto.getName())
                .hp(eDto.getHp())
                .residentNumber(eDto.getResidentNumber())
                .build();
        return dto;
    }
}
