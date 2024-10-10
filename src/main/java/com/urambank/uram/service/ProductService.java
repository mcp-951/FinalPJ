package com.urambank.uram.service;

import com.urambank.uram.dto.LoanJoinDTO;
import com.urambank.uram.dto.ProductDTO;
import com.urambank.uram.dto.UserAccountDTO;
import com.urambank.uram.entities.LoanJoinEntity;
import com.urambank.uram.entities.ProductEntity;
import com.urambank.uram.entities.UserAccountEntity;
import com.urambank.uram.repository.LoanJoinRepository;
import com.urambank.uram.repository.ProductRepository;
import com.urambank.uram.repository.UserAccountRepository;
import com.urambank.uram.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserAccountRepository accountRepository;
    private final LoanJoinRepository loanJoinRepository;
    private final JWTUtil jwtUtil;

//    // 예금 상품 3개 가져오기
//    public List<ProductDTO> getSavingProducts() {
//        Pageable pageable = PageRequest.of(0, 3);
//        return savingProducts.stream()
//                .map(ProductDTO::toProductDTO)
//                .collect(Collectors.toList());
//    }
//
//    // 적금 상품 3개 가져오기
//    public List<ProductDTO> getDepositProducts() {
//        Pageable pageable = PageRequest.of(0, 3);
//        return depositProducts.stream()
//                .map(ProductDTO::toProductDTO)
//                .collect(Collectors.toList());
//    }


    // 대출 상품 페이징 처리하여 가져오기
    public Page<ProductDTO> getLoanProductsPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductEntity> loanProductsPage = productRepository.findByProductCategory("3", pageable);
        return loanProductsPage.map(ProductDTO::toProductDTO);
    }

    // 사용자 계좌 정보 가져오기
    public List<UserAccountDTO> getUserAccounts(String token) {
        String userId = jwtUtil.getUsername(token);
        List<UserAccountEntity> accounts = accountRepository.findByUser_UserId(userId);
        return accounts.stream()
                .map(account -> {
                    UserAccountDTO dto = new UserAccountDTO();
                    dto.setAccountNumber(account.getAccountNumber());
                    dto.setAccountBalance(account.getAccountBalance());
                    dto.setAccountState(account.getAccountState());
                    dto.setAccountPW(account.getAccountPW());
                    dto.setBankName(account.getBankName());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // LoanJoin 데이터 저장
    public LoanJoinEntity saveLoanJoin(LoanJoinDTO loanJoinDTO, String token) {
        String userId = jwtUtil.getUsername(token);

        LoanJoinEntity loanJoinEntity = new LoanJoinEntity();
        loanJoinEntity.setProductName(loanJoinDTO.getProductName());
        loanJoinEntity.setRepaymentMethod(loanJoinDTO.getRepaymentMethod());
        loanJoinEntity.setLoanAmount(loanJoinDTO.getLoanAmount());
        loanJoinEntity.setLoanPeriod(loanJoinDTO.getLoanPeriod());
        loanJoinEntity.setInterestRate(loanJoinDTO.getInterestRate());
        loanJoinEntity.setLoanAccount(loanJoinDTO.getLoanAccount());
        loanJoinEntity.setTransferAccount(loanJoinDTO.getTransferAccount());
        loanJoinEntity.setJoinDay(LocalDate.now());
        loanJoinEntity.setFinishDay(LocalDate.now().plusMonths(loanJoinDTO.getLoanPeriod()));
        loanJoinEntity.setUserId(userId);

        return loanJoinRepository.save(loanJoinEntity);
    }
}
