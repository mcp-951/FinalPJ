package com.urambank.uram.service;

import com.urambank.uram.dto.TaxDTO;
import com.urambank.uram.entities.TaxEntity;
import com.urambank.uram.repository.TaxRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class TaxService {
    final TaxRepository taxRepository;

    public TaxDTO taxTomonth(int userNo, String category){
        List<TaxEntity> eList =  taxRepository.findByUserNoAndTaxCategory(userNo, category);
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
                       .taxCategory(eDTO.getTaxCategory())
                       .build();
           }

        }

        return dto;
    }

    public TaxDTO taxSelectList(int userNo, String taxYear, String taxMonth){
        TaxDTO dto = null;
        List<TaxEntity> eList =  taxRepository.findByUserNo(userNo);

        for (TaxEntity eDTO : eList){
            String eDTOYear = eDTO.getTaxDeadLine().toString().substring(0,4);
            String eDTOMonth = eDTO.getTaxDeadLine().toString().substring(5,7);

            if (eDTOYear.equals(taxYear)){
                if (eDTOMonth.equals(taxMonth)){
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
        }
        return dto;
    }

    public List<TaxDTO> taxUserLog(int userNo){
        List<TaxDTO> list = new ArrayList<>();
        List<TaxEntity> eList = taxRepository.findByUserNo(userNo);

        for(TaxEntity eDTO : eList){
            TaxDTO dto = new TaxDTO();
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
            list.add(dto);
        }
        return list;
    }
}
