package com.urambank.uram.service;

import com.urambank.uram.dto.LoanJoinDTO;
import com.urambank.uram.dto.ProductDTO;
import com.urambank.uram.dto.UserAccountDTO;
import com.urambank.uram.entities.*;
import com.urambank.uram.repository.AutoTransferRepository;
import com.urambank.uram.repository.LoanJoinRepository;
import com.urambank.uram.repository.ProductRepository;
import com.urambank.uram.repository.UserAccountRepository;
import com.urambank.uram.util.JWTUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
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
    private final AutoTransferRepository autoTransferRepository;

    // 대출 상품 페이징 처리하여 가져오기
    public Page<ProductDTO> getLoanProductsPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductEntity> loanProductsPage = productRepository.findByProductCategory("3", pageable);
        return loanProductsPage.map(ProductDTO::toProductDTO);
    }

    // 사용자 계좌 정보 가져오기 (userNo 사용)
    public List<UserAccountDTO> getUserAccounts(String token) {
        // JWT에서 userNo를 추출
        Integer userNo = jwtUtil.getUserNo(token);  // userNo를 추출하는 메서드를 추가
        List<UserAccountEntity> accounts = accountRepository.findByUser_UserNo(userNo);
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
        Integer userNo = jwtUtil.getUserNo(token);  // userNo를 추출

        LoanJoinEntity loanJoinEntity = new LoanJoinEntity();
        loanJoinEntity.setProductName(loanJoinDTO.getProductName());
        loanJoinEntity.setRepaymentMethod(loanJoinDTO.getRepaymentMethod());
        loanJoinEntity.setLoanAmount(loanJoinDTO.getLoanAmount());
        loanJoinEntity.setLoanPeriod(loanJoinDTO.getLoanPeriod());
        loanJoinEntity.setInterestRate(loanJoinDTO.getInterestRate());
        loanJoinEntity.setLoanAccount(loanJoinDTO.getLoanAccount());
        loanJoinEntity.setTransferAccount(loanJoinDTO.getTransferAccount()); // 출금 계좌번호 저장
        loanJoinEntity.setTransferDay(loanJoinDTO.getTransferDay());
        loanJoinEntity.setUserNo(userNo);
        loanJoinEntity.setJoinDay(LocalDate.now());
        loanJoinEntity.setFinishDay(LocalDate.now().plusMonths(loanJoinDTO.getLoanPeriod()));

        // LoanJoin 저장과 동시에 자동이체 등록
        LoanJoinEntity savedLoanJoin = loanJoinRepository.save(loanJoinEntity);
        registerAutoTransfer(savedLoanJoin);

        return savedLoanJoin;
    }

    // 상환 방식에 따라 이체 금액을 계산하는 메서드
    private int calculateAutoTransferAmount(LoanJoinEntity loanJoinEntity) {
        int loanAmount = loanJoinEntity.getLoanAmount(); // 대출금액
        double interestRate = loanJoinEntity.getInterestRate() / 100 / 12;  // 월 이자율
        int loanPeriod = loanJoinEntity.getLoanPeriod(); // 대출 기간 (개월 수)

        if (loanJoinEntity.getRepaymentMethod().equals("원리금균등상환")) {
            return (int) ((loanAmount * interestRate) / (1 - Math.pow(1 + interestRate, -loanPeriod)));
        } else if (loanJoinEntity.getRepaymentMethod().equals("원금균등상환")) {
            int principalPayment = loanAmount / loanPeriod;
            return principalPayment + (int) (loanAmount * interestRate);  // 매달 상환할 금액 (원금 + 이자)
        } else if (loanJoinEntity.getRepaymentMethod().equals("원금만기일시상환")) {
            return (int) (loanAmount * interestRate);  // 매달 납부할 이자
        } else {
            throw new IllegalArgumentException("알 수 없는 상환 방식입니다.");
        }
    }

    // 자동이체 등록 메서드
    public void registerAutoTransfer(LoanJoinEntity loanJoinEntity) {
        int transferAmount = calculateAutoTransferAmount(loanJoinEntity);

        // 자동이체 엔티티 생성
        AutoTransferEntity autoTransferEntity = AutoTransferEntity.builder()
                .accountNo(loanJoinEntity.getTransferAccount())
                .receiveAccountNo(loanJoinEntity.getLoanAccount())
                .autoSendPrice(transferAmount)
                .startDate(LocalDate.now())
                .endDate(loanJoinEntity.getFinishDay())
                .transferDay(loanJoinEntity.getTransferDay())
                .reservationState("ACTIVE")
                .toBankName("우람은행")  // 은행명 추가
                .build();

        // 자동이체 등록
        autoTransferRepository.save(autoTransferEntity);
    }

    // 자동이체 실행 로직v

    public void executeLoanAutoTransfer(LoanJoinEntity loanJoinEntity) {
        AccountEntity fromAccount = accountRepository.findByAccountNoAndState(loanJoinEntity.getTransferAccount(), "NORMAL");

        if (fromAccount == null || fromAccount.getAccountBalance() < calculateAutoTransferAmount(loanJoinEntity)) {
            System.out.println("자동이체 실패: 잔액 부족 또는 출금 계좌가 유효하지 않음");
            return;
        }

        // 상환 금액 계산 및 잔액 차감
        int transferAmount = calculateAutoTransferAmount(loanJoinEntity);
        fromAccount.setAccountBalance(fromAccount.getAccountBalance() - transferAmount);
        accountRepository.save(fromAccount);

        // 입금 계좌로 금액 추가
        AccountEntity toAccount = accountRepository.findByAccountNo(loanJoinEntity.getLoanAccount());
        if (toAccount != null) {
            toAccount.setAccountBalance(toAccount.getAccountBalance() + transferAmount);
            accountRepository.save(toAccount);
        }

        // 남은 대출 금액 감소
        loanJoinEntity.setRemainingLoanAmount(loanJoinEntity.getRemainingLoanAmount() - transferAmount);
        loanJoinRepository.save(loanJoinEntity);

        System.out.println("자동이체 성공: " + loanJoinEntity.getTransferAccount() + " -> " + loanJoinEntity.getLoanAccount());
    }

    // 스케줄러: 매달 이체일에 맞춰 자동으로 실행되도록 설정 (매일 0시에 확인)
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void processLoanAutoTransfers() {
        List<LoanJoinEntity> loanJoinEntities = loanJoinRepository.findAllActiveLoanJoins(); // 활성화된 대출 조회
        LocalDate today = LocalDate.now();

        for (LoanJoinEntity loanJoin : loanJoinEntities) {
            // 오늘이 상환일(transferDay)인지 확인
            if (loanJoin.getTransferDay() == today.getDayOfMonth()) {
                System.out.println("대출 자동이체 실행: " + loanJoin.getLoanAccount() + " -> 상환 계좌");

                // 상환 금액 계산 및 자동이체 실행
                executeLoanAutoTransfer(loanJoin);
            }
        }
    }
}
