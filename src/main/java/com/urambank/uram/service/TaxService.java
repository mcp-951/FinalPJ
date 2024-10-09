package com.urambank.uram.service;

import com.urambank.uram.dto.TaxDTO;
import com.urambank.uram.entities.TaxEntity;
import com.urambank.uram.repository.TaxRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class TaxService {
    final TaxRepository taxRepository;

    public TaxDTO electroTaxTomonth(int userNo){
        List<TaxEntity> eList =  taxRepository.findByUserNo(userNo);
        TaxDTO dto = null;
        LocalDate localTime = LocalDate.now();
        String month = localTime.toString().substring(5,7);

        for (TaxEntity eDTO : eList){
           String writeDate =  eDTO.getTaxWriteDate().toString();

           if (month.equals(writeDate.substring(5,7))){
                dto = TaxDTO.builder()
                       .taxNo(eDTO.getTaxNo())
                       .taxState(eDTO.getTaxState())
                       .taxWriteDate(eDTO.getTaxWriteDate())
                       .fee1(eDTO.getFee1())
                       .fee2(eDTO.getFee2())
                       .fee3(eDTO.getFee3())
                       .basicFee1(eDTO.getBasicFee1())
                       .basicFee2(eDTO.getBasicFee2())
                       .basicFee3(eDTO.getBasicFee3())
                       .taxDeadLine(eDTO.getTaxDeadLine())
                       .build();
           }

        }

        return dto;
    }
}
