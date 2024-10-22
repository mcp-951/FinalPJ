package com.urambank.uram.service;

import com.urambank.uram.dto.AccountDTO;
import com.urambank.uram.dto.UserDTO;
import com.urambank.uram.dto.LogDTO;
import com.urambank.uram.dto.DepositDTO;
import com.urambank.uram.dto.LoanProductDTO;
import com.urambank.uram.entities.LogEntity;
import com.urambank.uram.entities.User;
import com.urambank.uram.entities.LoanEntity;
import com.urambank.uram.entities.AccountEntity;
import com.urambank.uram.entities.DepositEntity;
import com.urambank.uram.entities.LoanProductEntity;
import com.urambank.uram.repository.UserRepository;
import com.urambank.uram.repository.LogRepository;
import com.urambank.uram.repository.DepositRepository;
import com.urambank.uram.repository.AccountRepository;
import com.urambank.uram.repository.LoanProductRepository;
import com.urambank.uram.repository.LoanRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {


    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final LogRepository logRepository;
    private final DepositRepository depositRepository;
    private final LoanProductRepository loanProductRepository;
    private final LoanRepository loanRepository;

    public AdminService(UserRepository userRepository, AccountRepository accountRepository, LogRepository logRepository
            , DepositRepository depositRepository, LoanProductRepository loanProductRepository, LoanRepository loanRepository) {
        this.logRepository = logRepository;
        this.depositRepository = depositRepository;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.loanProductRepository = loanProductRepository;
        this.loanRepository = loanRepository;
    }

    // DTO -> Entity 변환 메서드
    private User convertToEntity(UserDTO userDTO) {
        if (userDTO == null) {
            return null;
        }
        User user = User.builder()
                .userNo(userDTO.getUserNo())
                .userId(userDTO.getUserId())
                .name(userDTO.getName())
                .userPw(userDTO.getUserPw())
                .state(userDTO.getState())
                .grade(userDTO.getGrade())
                .build();

        return user;
    }

    // Entity -> DTO 변환 메서드
    private UserDTO convertToDTO(User user) {
        if (user == null) {
            return null;
        }
        UserDTO userDTO = new UserDTO();
        userDTO.setUserNo(user.getUserNo());
        userDTO.setUserId(user.getUserId());
        userDTO.setName(user.getName());
        userDTO.setUserPw(user.getUserPw());
        userDTO.setUSER_ROLE(user.getUserRole()); // 권한 추가
        userDTO.setState(user.getState()); // 상태 추가
        userDTO.setResidentNumber(user.getResidentNumber());
        userDTO.setEmail(user.getEmail());
        userDTO.setHp(user.getHp());
        userDTO.setAddress(user.getAddress());
        userDTO.setBirth(user.getBirth());
        userDTO.setGrade(user.getGrade());
        return userDTO;
    }

    //-----------------------------------------상품 관련 ---------------------------------
    // DTO -> Entity 변환
    private DepositEntity convertToDepositEntity(DepositDTO depositDTO) {
        return DepositEntity.builder()
                .depositNo(depositDTO.getDepositNo())
                .depositCategory(depositDTO.getDepositCategory())
                .depositContent(depositDTO.getDepositContent())
                .depositIMG(depositDTO.getDepositIMG())
                .depositName(depositDTO.getDepositName())
                .depositState(depositDTO.getDepositState())
                .depositCharacteristic(depositDTO.getDepositCharacteristic())
                .depositMaximumAmount(depositDTO.getDepositMaximumAmount())
                .depositMaximumDate(depositDTO.getDepositMaximumDate())
                .depositMaximumRate(depositDTO.getDepositMaximumRate())
                .depositMinimumAmount(depositDTO.getDepositMinimumAmount())
                .depositMinimumDate(depositDTO.getDepositMinimumDate())
                .depositMinimumRate(depositDTO.getDepositMinimumRate())
                .build();
    }


    private DepositDTO convertToDepositDTO(DepositEntity depositEntity) {
        return DepositDTO.builder()
                .depositNo(depositEntity.getDepositNo())
                .depositCategory(depositEntity.getDepositCategory())
                .depositContent(depositEntity.getDepositContent())
                .depositIMG(depositEntity.getDepositIMG())
                .depositName(depositEntity.getDepositName())
                .depositState(depositEntity.getDepositState())
                .depositCharacteristic(depositEntity.getDepositCharacteristic())
                .depositMaximumAmount(depositEntity.getDepositMaximumAmount())
                .depositMaximumDate(depositEntity.getDepositMaximumDate())
                .depositMaximumRate(depositEntity.getDepositMaximumRate())
                .depositMinimumAmount(depositEntity.getDepositMinimumAmount())
                .depositMinimumDate(depositEntity.getDepositMinimumDate())
                .depositMinimumRate(depositEntity.getDepositMinimumRate())
                .build();
    }


    // 예금,적금상품 등록 메서드
    public void addDepositProduct(DepositDTO depositDTO) {
        // DTO를 엔티티로 변환
        DepositEntity depositEntity = DepositEntity.builder()
                .depositName(depositDTO.getDepositName())
                .depositCategory(depositDTO.getDepositCategory())
                .depositContent(depositDTO.getDepositContent())
                .depositIMG(depositDTO.getDepositIMG())  // 이미지 필드 추가
                .depositCharacteristic(depositDTO.getDepositCharacteristic())  // 예금 특성 필드 추가
                .depositMaximumAmount(depositDTO.getDepositMaximumAmount())  // 최대 예치 금액 추가
                .depositMaximumDate(depositDTO.getDepositMaximumDate())  // 최대 기간 추가
                .depositMaximumRate(depositDTO.getDepositMaximumRate())  // 최대 금리 추가
                .depositMinimumAmount(depositDTO.getDepositMinimumAmount())  // 최소 예치 금액 추가
                .depositMinimumDate(depositDTO.getDepositMinimumDate())  // 최소 기간 추가
                .depositMinimumRate(depositDTO.getDepositMinimumRate())  // 최소 금리 추가
                .depositState('Y')  // 신규 등록은 'Y'로 활성화 상태로 설정
                .build();

        // Repository를 통해 DB에 저장
        System.out.println("<<< AdminService addDepositProduct - depositEntity >>> : " + depositEntity);
        depositRepository.save(depositEntity);
    }


    // 전체 금융 상품 조회
    public List<Object> getAllFinancialProducts() {
        List<Object> allProducts = new ArrayList<>();

        // 1. DepositEntity를 DepositDTO로 변환
        List<DepositDTO> deposits = depositRepository.findAll()
                .stream()  // DepositEntity 리스트를 스트림으로 변환
                .map(deposit -> DepositDTO.builder()
                        .depositNo(deposit.getDepositNo())
                        .depositName(deposit.getDepositName())
                        .depositCategory(deposit.getDepositCategory())
                        .depositContent(deposit.getDepositContent())
                        .depositIMG(deposit.getDepositIMG())
                        .depositState(deposit.getDepositState())
                        .depositCharacteristic(deposit.getDepositCharacteristic())
                        .depositMaximumAmount(deposit.getDepositMaximumAmount())
                        .depositMaximumDate(deposit.getDepositMaximumDate())
                        .depositMaximumRate(deposit.getDepositMaximumRate())
                        .depositMinimumAmount(deposit.getDepositMinimumAmount())
                        .depositMinimumDate(deposit.getDepositMinimumDate())
                        .depositMinimumRate(deposit.getDepositMinimumRate())
                        .build())
                .collect(Collectors.toList());  // 변환된 DepositDTO 리스트를 다시 리스트로 수집

        // 2. 변환된 DepositDTO 리스트를 전체 상품 리스트에 추가
        allProducts.addAll(deposits);

        // 3. LoanEntity를 LoanDTO로 변환
        List<LoanProductDTO> loans = loanProductRepository.findAll()
                .stream()
                .map(loan -> LoanProductDTO.builder()
                        .loanProductNo(loan.getLoanProductNo())
                        .loanProductTitle(loan.getLoanProductTitle())
                        .loanMaxLimit(loan.getLoanMaxLimit())
                        .loanMinLimit(loan.getLoanMinLimit())
                        .loanMaxTern(loan.getLoanMaxTern())
                        .loanMinTern(loan.getLoanMinTern())
                        .minInterestRate(loan.getMinInterestRate())
                        .maxInterestRate(loan.getMaxInterestRate())
                        .earlyRepaymentFee(loan.getEarlyRepaymentFee())
                        .minCreditScore(loan.getMinCreditScore())
                        .viewPoint(loan.getViewPoint())
                        .build())
                .collect(Collectors.toList());

        allProducts.addAll(loans);

        return allProducts;
    }


    // 상품 판매량 차트 데이터 조회
    public Map<String, Integer> getProductCounts() {
        System.out.println("<<< AdminService getProductCounts >>>");

        Map<String, Integer> productCounts = new HashMap<>();

        // 예금 상품 갯수
        int depositCount = depositRepository.countByDepositCategoryAndDepositState(1, 'Y');
        productCounts.put("Deposits", depositCount);

        // 적금 상품 갯수 (카테고리 3번으로 구분)
        int savingsCount = depositRepository.countByDepositCategoryAndDepositState(3, 'Y');
        productCounts.put("Savings", savingsCount);

        // 대출 상품 갯수 (loanStatus 필드를 기준으로)
        int loanCount = loanRepository.countByLoanStatus("NORMAL");
        productCounts.put("Loans", loanCount);

        System.out.println("<<< AdminService productCounts >>> " + productCounts);

        return productCounts;
    }

    //------------------------------------ 적금 관련 ------------------------------------------
// 적금 상품 목록 조회 (모든 필드를 포함해서 가져옴)
    public List<DepositDTO> getSavings() {
        System.out.println("<<< AdminService getSavings >>>");
        List<DepositDTO> list = new ArrayList<>();

        // 적금 카테고리 3번이면서 depositState가 'Y'인 상품만 조회
        List<DepositEntity> savings = depositRepository.findByDepositCategoryAndDepositState(2, 'Y');

        // 조회된 적금 상품들을 DTO로 변환
        for (DepositEntity entity : savings) {
            DepositDTO depositDTO = DepositDTO.builder()
                    .depositNo(entity.getDepositNo())
                    .depositCategory(entity.getDepositCategory())
                    .depositContent(entity.getDepositContent())
                    .depositIMG(entity.getDepositIMG())
                    .depositName(entity.getDepositName())
                    .depositState(entity.getDepositState())
                    .depositCharacteristic(entity.getDepositCharacteristic())
                    .depositMaximumAmount(entity.getDepositMaximumAmount())
                    .depositMaximumDate(entity.getDepositMaximumDate())
                    .depositMaximumRate(entity.getDepositMaximumRate())
                    .depositMinimumAmount(entity.getDepositMinimumAmount())
                    .depositMinimumDate(entity.getDepositMinimumDate())
                    .depositMinimumRate(entity.getDepositMinimumRate())
                    .build();  // 모든 필드를 포함한 적금 DTO 생성

            list.add(depositDTO);  // 적금 DTO를 리스트에 추가

        }
        System.out.println("DepositDTO details: " + list);
        return list;  // 적금 상품 목록 반환
    }

    // 예금,적금 상품 수정
    public void updateDeposit(int depositNo, DepositDTO depositDTO) {
        DepositEntity depositEntity = depositRepository.findById(depositNo)
                .orElseThrow(() -> new IllegalArgumentException("해당 적금 상품을 찾을 수 없습니다."));

        // DTO 데이터를 엔티티로 반영
        depositEntity.setDepositName(depositDTO.getDepositName());
        depositEntity.setDepositCategory(depositDTO.getDepositCategory());
        depositEntity.setDepositContent(depositDTO.getDepositContent());
        depositEntity.setDepositIMG(depositDTO.getDepositIMG());  // 이미지 필드 추가
        depositEntity.setDepositCharacteristic(depositDTO.getDepositCharacteristic());  // 예금 특성 필드 추가
        depositEntity.setDepositMaximumAmount(depositDTO.getDepositMaximumAmount());  // 최대 예치 금액 추가
        depositEntity.setDepositMaximumDate(depositDTO.getDepositMaximumDate());  // 최대 기간 추가
        depositEntity.setDepositMaximumRate(depositDTO.getDepositMaximumRate());  // 최대 금리 추가
        depositEntity.setDepositMinimumAmount(depositDTO.getDepositMinimumAmount());  // 최소 예치 금액 추가
        depositEntity.setDepositMinimumDate(depositDTO.getDepositMinimumDate());  // 최소 기간 추가
        depositEntity.setDepositMinimumRate(depositDTO.getDepositMinimumRate());  // 최소 금리 추가

        // 변경된 엔티티 저장
        depositRepository.save(depositEntity);
    }

    // 예금,적금 "삭제" 상태로 변경하는 메서드
    public void deleteDeposit(int depositNo) {
        depositRepository.updateDepositStateToN(depositNo);
    }
    //----------------------------------------- 예금 ---------------------------------------
// 예금 상품 목록 조회
    public List<DepositDTO> getDeposits() {
        System.out.println("<<< AdminService getDeposits >>>");
        List<DepositDTO> list = new ArrayList<>();

        // 예금 카테고리 1번이면서 depositState가 'Y'인 상품만 조회
        List<DepositEntity> deposits = depositRepository.findByDepositCategoryAndDepositState(1, 'Y');

        // 조회된 예금 상품들을 DTO로 변환
        for (DepositEntity entity : deposits) {
            DepositDTO depositDTO = DepositDTO.builder()
                    .depositNo(entity.getDepositNo())
                    .depositCategory(entity.getDepositCategory())
                    .depositContent(entity.getDepositContent())
                    .depositIMG(entity.getDepositIMG())
                    .depositName(entity.getDepositName())
                    .depositState(entity.getDepositState())
                    .depositCharacteristic(entity.getDepositCharacteristic())
                    .depositMaximumAmount(entity.getDepositMaximumAmount())
                    .depositMaximumDate(entity.getDepositMaximumDate())
                    .depositMaximumRate(entity.getDepositMaximumRate())
                    .depositMinimumAmount(entity.getDepositMinimumAmount())
                    .depositMinimumDate(entity.getDepositMinimumDate())
                    .depositMinimumRate(entity.getDepositMinimumRate())
                    .build();  // 모든 필드를 포함한 예금 DTO 생성

            list.add(depositDTO);  // 예금 DTO를 리스트에 추가
        }
        System.out.println("DepositDTO details: " + list);
        return list;  // 예금 상품 목록 반환
    }

    //------------------------------------ 대출 관련------------------------------------------------------
    private LoanProductEntity convertToLoanProductEntity(LoanProductDTO loanProductDTO) {
        return LoanProductEntity.builder()
                .loanProductNo(loanProductDTO.getLoanProductNo())
                .loanProductTitle(loanProductDTO.getLoanProductTitle())
                .loanMaxLimit(loanProductDTO.getLoanMaxLimit())
                .loanMinLimit(loanProductDTO.getLoanMinLimit())
                .loanMaxTern(loanProductDTO.getLoanMaxTern())
                .loanMinTern(loanProductDTO.getLoanMinTern())
                .minInterestRate(loanProductDTO.getMinInterestRate())
                .maxInterestRate(loanProductDTO.getMaxInterestRate())
                .earlyRepaymentFee(loanProductDTO.getEarlyRepaymentFee())
                .minCreditScore(loanProductDTO.getMinCreditScore())
                .viewPoint(loanProductDTO.getViewPoint())  // 삭제된 경우를 위한 필드
                .build();
    }

    private LoanProductDTO convertToLoanProductDTO(LoanProductEntity loanProductEntity) {
        return LoanProductDTO.builder()
                .loanProductNo(loanProductEntity.getLoanProductNo())
                .loanProductTitle(loanProductEntity.getLoanProductTitle())
                .loanMaxLimit(loanProductEntity.getLoanMaxLimit())
                .loanMinLimit(loanProductEntity.getLoanMinLimit())
                .loanMaxTern(loanProductEntity.getLoanMaxTern())
                .loanMinTern(loanProductEntity.getLoanMinTern())
                .minInterestRate(loanProductEntity.getMinInterestRate())
                .maxInterestRate(loanProductEntity.getMaxInterestRate())
                .earlyRepaymentFee(loanProductEntity.getEarlyRepaymentFee())
                .minCreditScore(loanProductEntity.getMinCreditScore())
                .viewPoint(loanProductEntity.getViewPoint())
                .build();
    }

    // 대출 상품 등록 메서드
    public void addLoanProduct(LoanProductDTO loanProductDTO) {
        // DTO를 엔티티로 변환
        LoanProductEntity loanProductEntity = LoanProductEntity.builder()
                .loanProductTitle(loanProductDTO.getLoanProductTitle())  // 상품명
                .loanMaxLimit(loanProductDTO.getLoanMaxLimit())  // 최대 한도
                .loanMinLimit(loanProductDTO.getLoanMinLimit())  // 최소 한도
                .loanMaxTern(loanProductDTO.getLoanMaxTern())  // 최대 기간
                .loanMinTern(loanProductDTO.getLoanMinTern())  // 최소 기간
                .minInterestRate(loanProductDTO.getMinInterestRate())  // 최소 이율
                .maxInterestRate(loanProductDTO.getMaxInterestRate())  // 최대 이율
                .earlyRepaymentFee(loanProductDTO.getEarlyRepaymentFee())  // 중도 상환 수수료
                .minCreditScore(loanProductDTO.getMinCreditScore())  // 최소 신용등급
                .viewPoint('Y')  // 기본값 활성화
                .build();

        // Repository를 통해 DB에 저장
        System.out.println("<<< AdminService addLoanProduct - loanProductEntity >>> : " + loanProductEntity);
        loanProductRepository.save(loanProductEntity);
    }

    // 대출 상품 목록 조회
    public List<LoanProductDTO> getLoanProducts() {
        List<LoanProductDTO> list = new ArrayList<>();
        List<LoanProductEntity> loans = loanProductRepository.findByViewPoint('Y');  // 'Y'인 대출 상품만 조회

        // Entity -> DTO 변환
        for (LoanProductEntity loanEntity : loans) {
            LoanProductDTO loanDTO = LoanProductDTO.builder()
                    .loanProductNo(loanEntity.getLoanProductNo())
                    .loanProductTitle(loanEntity.getLoanProductTitle())
                    .loanMaxLimit(loanEntity.getLoanMaxLimit())
                    .loanMinLimit(loanEntity.getLoanMinLimit())
                    .loanMaxTern(loanEntity.getLoanMaxTern())
                    .loanMinTern(loanEntity.getLoanMinTern())
                    .minInterestRate(loanEntity.getMinInterestRate())
                    .maxInterestRate(loanEntity.getMaxInterestRate())
                    .earlyRepaymentFee(loanEntity.getEarlyRepaymentFee())
                    .minCreditScore(loanEntity.getMinCreditScore())
                    .viewPoint(loanEntity.getViewPoint())
                    .build();
            list.add(loanDTO);
        }

        return list;  // 대출 상품 목록 반환
    }

    // 대출 상품 수정
    public void updateLoan(int loanProductNo, LoanProductDTO loanProductDTO) {
        LoanProductEntity loanProductEntity = loanProductRepository.findById(loanProductNo)
                .orElseThrow(() -> new IllegalArgumentException("해당 대출 상품을 찾을 수 없습니다."));

        // DTO 데이터를 엔티티로 반영
        loanProductEntity.setLoanProductTitle(loanProductDTO.getLoanProductTitle());
        loanProductEntity.setLoanMaxLimit(loanProductDTO.getLoanMaxLimit());
        loanProductEntity.setLoanMinLimit(loanProductDTO.getLoanMinLimit());
        loanProductEntity.setLoanMaxTern(loanProductDTO.getLoanMaxTern());
        loanProductEntity.setLoanMinTern(loanProductDTO.getLoanMinTern());
        loanProductEntity.setMinInterestRate(loanProductDTO.getMinInterestRate());
        loanProductEntity.setMaxInterestRate(loanProductDTO.getMaxInterestRate());
        loanProductEntity.setEarlyRepaymentFee(loanProductDTO.getEarlyRepaymentFee());
        loanProductEntity.setMinCreditScore(loanProductDTO.getMinCreditScore());

        // 변경된 엔티티 저장
        loanProductRepository.save(loanProductEntity);
    }

    // 대출 상품 삭제 (viewPoint를 'n'으로 변경)
    public void deleteLoan(int loanProductNo) {
        System.out.println("<<< AdminService deleteLoan >>>");
        loanProductRepository.updateLoanViewPointToN(loanProductNo);
    }

    //-------------------------------- 거래 관련 ---------------------------------------------------------
// Entity -> DTO 변환
    private LogDTO convertToLogDTO(LogEntity logEntity) {
        return LogDTO.builder()
                .logNo(logEntity.getLogNo())
                .sendAccountNumber(logEntity.getSendAccountNumber())
                .receiveAccountNumber(logEntity.getReceiveAccountNumber())
                .sendPrice(logEntity.getSendPrice())
                .sendDate(logEntity.getSendDate())
                .logState(logEntity.getLogState())
                .build();
    }

    // DTO -> Entity 변환
    private LogEntity convertToLogEntity(LogDTO logDTO) {
        return LogEntity.builder()
                .logNo(logDTO.getLogNo())
                .sendAccountNumber(logDTO.getSendAccountNumber())
                .receiveAccountNumber(logDTO.getReceiveAccountNumber())
                .sendPrice(logDTO.getSendPrice())
                .sendDate(logDTO.getSendDate())
                .logState(logDTO.getLogState())
                .build();
    }

    // 거래 내역 조회
    public List<LogDTO> getAllLogs() {
        System.out.println("<<< AdminService getAllLogs >>>");
        List<LogDTO> list = new ArrayList<>();
        List<LogEntity> logs = logRepository.findAll();

        for (LogEntity eDto : logs) {
            LogDTO logDTO = LogDTO.builder()
                    .logNo(eDto.getLogNo())
                    .sendAccountNumber(eDto.getSendAccountNumber())
                    .receiveAccountNumber(eDto.getReceiveAccountNumber())
                    .sendPrice(eDto.getSendPrice())
                    .sendDate(eDto.getSendDate())
                    .logState(eDto.getLogState())
                    .build();
            list.add(logDTO);
        }
        System.out.println("<<< AdminService getAllLogs - list >>> : " + list);
        return list;
    }

    //----------------------------------- 계좌 관련 ---------------------------------------------------
    // Entity -> DTO 변환
    private AccountDTO toAccountDTO(AccountEntity accountEntity) {
        return AccountDTO.builder()
                .accountNo(accountEntity.getAccountNo())
                .accountNumber(accountEntity.getAccountNumber())
                .userNo(accountEntity.getUserNo())
                .bankName(accountEntity.getBankName())
                .accountBalance(accountEntity.getAccountBalance())
                .accountLimit(accountEntity.getAccountLimit())
                .accountPW(accountEntity.getAccountPW())
                .accountState(accountEntity.getAccountState())
                .accountOpen(accountEntity.getAccountOpen())  // Date 그대로 사용
                .accountClose(accountEntity.getAccountClose())  // Date 그대로 사용
                .accountRate(accountEntity.getAccountRate())  // 추가된 이자율 필드
                .agreement(accountEntity.getAgreement())  // 추가된 약정 여부 필드
                .withdrawal(accountEntity.getWithdrawal())  // 추가된 출금 여부 필드
                .build();
    }

    // DTO -> Entity 변환
    private AccountEntity toAccountEntity(AccountDTO accountDTO) {
        return AccountEntity.builder()
                .accountNo(accountDTO.getAccountNo())
                .accountNumber(accountDTO.getAccountNumber())
                .userNo(accountDTO.getUserNo())
                .bankName(accountDTO.getBankName())
                .accountBalance(accountDTO.getAccountBalance())
                .accountLimit(accountDTO.getAccountLimit())
                .accountPW(accountDTO.getAccountPW())
                .accountState(accountDTO.getAccountState())
                .accountOpen(accountDTO.getAccountOpen())  // Date 그대로 사용
                .accountClose(accountDTO.getAccountClose())  // Date 그대로 사용
                .accountRate(accountDTO.getAccountRate())  // 추가된 이자율 필드
                .agreement(accountDTO.getAgreement())  // 추가된 약정 여부 필드
                .withdrawal(accountDTO.getWithdrawal())  // 추가된 출금 여부 필드
                .build();
    }


    // NORMAL 상태의 계좌 목록을 가져오는 메서드
    public List<AccountDTO> getNormalAccounts() {
        System.out.println("<<< AdminService getNormalAccounts >>>");
        List<AccountDTO> list = new ArrayList<>();
        List<AccountEntity> naccounts = accountRepository.findByAccountState("NORMAL");

        for (AccountEntity entity : naccounts) {
            AccountDTO accountDTO = AccountDTO.builder()
                    .accountNo(entity.getAccountNo())
                    .accountNumber(entity.getAccountNumber())
                    .userNo(entity.getUserNo())
                    .bankName(entity.getBankName())
                    .accountBalance(entity.getAccountBalance())
                    .accountLimit(entity.getAccountLimit())
                    .accountPW(entity.getAccountPW())
                    .accountState(entity.getAccountState())
                    .accountOpen(entity.getAccountOpen())
                    .accountClose(entity.getAccountClose())
                    .accountRate(entity.getAccountRate())
                    .agreement(entity.getAgreement())
                    .withdrawal(entity.getWithdrawal())
                    .build();

            list.add(accountDTO);
        }
        System.out.println("<<< AdminService getNormalAccounts - list >>> : " + list);
        return list;
    }

    // STOP 계좌 내역 조회
    public List<AccountDTO> getStopAccounts() {
        System.out.println("<<< AdminService adAccountStop >>>");
        List<AccountDTO> list = new ArrayList<>();
        List<AccountEntity> saccounts = accountRepository.findByAccountState("STOP");

            for (AccountEntity eDto : saccounts) {
                AccountDTO accountDTO = AccountDTO.builder()
                        .accountNo(eDto.getAccountNo())
                        .accountNumber(eDto.getAccountNumber())
                        .userNo(eDto.getUserNo())
                        .bankName(eDto.getBankName())
                        .accountBalance(eDto.getAccountBalance())
                        .accountLimit(eDto.getAccountLimit())
                        .accountPW(eDto.getAccountPW())
                        .accountState(eDto.getAccountState())
                        .accountOpen(eDto.getAccountOpen())  // LocalDateTime을 Date로 변환
                        .accountClose(eDto.getAccountClose()) // LocalDateTime을 Date로 변환
                        .accountRate(eDto.getAccountRate())
                        .agreement(eDto.getAgreement())
                        .withdrawal(eDto.getWithdrawal())
                        .build();

                list.add(accountDTO);
            }
        System.out.println("<<< AdminService getNormalAccounts - list >>> : " + list);
        return list;
    }

    // TERMINATION 계좌 내역 조회
    public List<AccountDTO> TerminationAccounts() {
        System.out.println("<<< AdminService TerminationAccounts >>>");
        List<AccountDTO> list = new ArrayList<>();
        List<AccountEntity> taccounts = accountRepository.findByAccountState("TERMINATION");

        for (AccountEntity eDto : taccounts) {
            AccountDTO accountDTO = AccountDTO.builder()
                    .accountNo(eDto.getAccountNo())
                    .accountNumber(eDto.getAccountNumber())
                    .userNo(eDto.getUserNo())
                    .bankName(eDto.getBankName())
                    .accountBalance(eDto.getAccountBalance())
                    .accountLimit(eDto.getAccountLimit())
                    .accountPW(eDto.getAccountPW())
                    .accountState(eDto.getAccountState())
                    .accountOpen(eDto.getAccountOpen())  // LocalDateTime을 Date로 변환
                    .accountClose(eDto.getAccountClose()) // LocalDateTime을 Date로 변환
                    .accountRate(eDto.getAccountRate())
                    .agreement(eDto.getAgreement())
                    .withdrawal(eDto.getWithdrawal())
                    .build();
        }
        return list;
    }


        //----------------------------------계좌 상태 변경 ---------------
        // 계좌를 STOP으로 변경
        public void stopAccount( int accountNo){
            AccountEntity accountEntity = accountRepository.findById(accountNo)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid account number: " + accountNo));

            // 계좌 상태를 STOP으로 설정
            accountEntity.setAccountState("STOP");
            accountRepository.save(accountEntity);  // 저장하여 업데이트 반영
        }

        // 계좌를 NORMAL로 변경
        public void resumeAccount ( int accountNo){
            AccountEntity accountEntity = accountRepository.findById(accountNo)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid account number: " + accountNo));

            // 계좌 상태를 NORMAL로 설정
            accountEntity.setAccountState("NORMAL");
            accountRepository.save(accountEntity);  // 저장하여 업데이트 반영
        }


    // 활성 회원 목록 조회 (NORMAL, STOP 상태의 유저를 조회)
    public List<UserDTO> getAllUsers(){
        List<User> normalUsers = userRepository.findAllByStateAndUserRole('y',"ROLE_USER");
        List<User> stopUsers = userRepository.findAllByStateAndUserRole('n',"ROLE_USER");

        // 두 리스트를 합친 후 DTO로 변환
        return Stream.concat(normalUsers.stream(), stopUsers.stream())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // 탈퇴된 회원 조회 (END 상태의 유저만 조회)
    public List<UserDTO> getRetiredUsers() {
        return userRepository.findAllByStateAndUserRole('e',"ROLE_USER").stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // 회원 정보 수정 (DTO 사용, 내부에서 Entity 사용)
    public UserDTO updateUser(int userNo, UserDTO userDTO) {
        User userEntity = userRepository.findById(userNo)
                .orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));

        // 비밀번호가 null이 아닌 경우에만 업데이트
        if (userDTO.getUserPw() != null && !userDTO.getUserPw().isEmpty()) {
            userEntity.setUserPw(userDTO.getUserPw());
        }

        // 다른 필드 업데이트
        userEntity.setUserId(userDTO.getUserId());
        userEntity.setEmail(userDTO.getEmail());
        userEntity.setName(userDTO.getName());
        userEntity.setResidentNumber(userDTO.getResidentNumber());
        userEntity.setOCRCheck(userDTO.getOCRCheck());
        userEntity.setBirth(userDTO.getBirth());
        userEntity.setHp(userDTO.getHp());
        userEntity.setAddress(userDTO.getAddress());
        userEntity.setState(userDTO.getState());

        User updatedEntity = userRepository.save(userEntity);
        return convertToDTO(updatedEntity);
    }

    // 회원 탈퇴 처리 (state를 'END'로 변경)
    public void deactivateUser(int userNo) {
        User userEntity = userRepository.findById(userNo)
                .orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));
        userEntity.setState('e'); // 상태를 '탈퇴'가 아닌 'END'로 변경
        userRepository.save(userEntity);
    }

    public void setState(int userNo, char userState) {
        User userEntity = userRepository.findById(userNo)
                .orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));
        userEntity.setState(userState); // 상태를 '정상'가 아닌 '정지'로 변경
        userRepository.save(userEntity);
    }
    }

