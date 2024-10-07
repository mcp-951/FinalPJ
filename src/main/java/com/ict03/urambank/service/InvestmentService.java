package com.ict03.urambank.service;

import com.ict03.urambank.dto.CoinListDTO;
import com.ict03.urambank.entity.CoinListEntity;
import com.ict03.urambank.repository.CoinListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class InvestmentService {
    final CoinListRepository coinListRepository;

    public List<CoinListDTO> coinList(){
        List<CoinListDTO> list = new ArrayList<>();
        List<CoinListEntity> eList = coinListRepository.findAll();

        for (CoinListEntity e : eList){
            CoinListDTO dto = CoinListDTO.builder()
                    .coinNo(e.getCoinNo())
                    .coinName(e.getCoinName())
                    .coinNick(e.getCoinNick())
                    .coinPrice(e.getCoinPrice())
                    .coinTotalPrice(e.getCoinTotalPrice())
                    .coinIncrease(e.getCoinIncrease())
                    .build();
            list.add(dto);
        }

        return list;
    }
}
