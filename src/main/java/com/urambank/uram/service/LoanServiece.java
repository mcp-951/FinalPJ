package com.urambank.uram.service;

import com.urambank.uram.dto.*;
import com.urambank.uram.entities.*;
import com.urambank.uram.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanServiece {
    private final LoanProductRepository loanProductRepository;
    private final UserRepository userRepository;
    private final LoanRepository loanRepository;
    private final AccountRepository accountRepository;
    private final AutoTransferRepository autoTransferRepository;

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

    public int loanJoinCheck(int userNo, int loanProductNo){
        LoanEntity eDto =  loanRepository.findByLoanProductNoAndUserNo(loanProductNo, userNo);
        int resultNo = 0;

        if (eDto != null){
            resultNo = 1;
        }

        return resultNo;
    }

    public List<AccountDTO> userAccountList(int userNo){
        String state = "NORMAL";
        List<AccountEntity> eList = accountRepository.findByUserNoAndAccountState(userNo, state);
        List<AccountDTO> list = new ArrayList<>();

        for (AccountEntity eDto : eList){
            AccountDTO dto = AccountDTO.builder()
                    .accountNo(eDto.getAccountNo())
                    .accountNumber(eDto.getAccountNumber())
                    .build();
            list.add(dto);
        }

        return list ;
    }

    public int userLoanJoin(LoanDTO dto){
        int a = 0;
        LoanEntity eDto = LoanEntity.builder()
                .loanProductNo(dto.getLoanProductNo())
                .userNo(dto.getUserNo())
                .repaymentType(dto.getRepaymentType())
                .loanTern(dto.getLoanTern())
                .loanAmount(dto.getLoanAmount())
                .loanInterest(dto.getLoanInterest())
                .interestRate(dto.getInterestRate())
                .loanStatus("NORMAL")
                .loanJoinDate(Date.valueOf(LocalDate.now()))
                .build();

        LoanEntity l = loanRepository.save(eDto);
        if(l != null){
            return a=1;
        }
        return a;
    }

    public int userAuto_TransferJoin(AutoTransferDTO autoTransferDTO, LoanDTO loanDTO){
        int a =0;
        int price = (loanDTO.getLoanAmount() + loanDTO.getLoanInterest()) / loanDTO.getLoanTern();
        LocalDate startDate = LocalDate.now().plusMonths(1).withDayOfMonth(autoTransferDTO.getTransferDay());
        LocalDate endDate = startDate.plusMonths(loanDTO.getLoanTern());
        System.out.println(price);
        AutoTransferEntity eDto = AutoTransferEntity.builder()
                .accountNo(autoTransferDTO.getAccountNo())
                .receiveAccountNo(autoTransferDTO.getReceiveAccountNo())
                .reservationState("ACTIVE")
                .reservationDate(LocalDate.now())
                .autoSendPrice(price)
                .startDate(startDate)
                .endDate(endDate)
                .transferDay(autoTransferDTO.getTransferDay())
                .toBankName(autoTransferDTO.getToBankName())
                .autoAgreement('Y')
                .build();
        AutoTransferEntity l = autoTransferRepository.save(eDto);
        if(l != null){
            return a =1;
        }
        return a;
    }
}
