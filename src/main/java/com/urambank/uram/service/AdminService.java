package com.urambank.uram.service;

import com.urambank.uram.dto.AccountDTO;
import com.urambank.uram.dto.UserDTO;
import com.urambank.uram.dto.LogDTO;
import com.urambank.uram.dto.DepositDTO;
import com.urambank.uram.dto.LoanDTO;
import com.urambank.uram.entities.LogEntity;
import com.urambank.uram.entities.User;
import com.urambank.uram.entities.AccountEntity;
import com.urambank.uram.entities.DepositEntity;
import com.urambank.uram.repository.UserRepository;
import com.urambank.uram.repository.LogRepository;
import com.urambank.uram.repository.DepositRepository;
import com.urambank.uram.repository.AccountRepository;
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

    public AdminService(UserRepository userRepository, AccountRepository accountRepository, LogRepository logRepository
        , DepositRepository depositRepository) {
        this.logRepository = logRepository;
        this.depositRepository = depositRepository;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
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
        return userDTO;
    }
//-----------------------------------------상품 관련 ---------------------------------
    // DTO -> Entity 변환
    private DepositEntity convertToDepositEntity(DepositDTO depositDTO) {
    return DepositEntity.builder()
            .depositNo(depositDTO.getDepositNo())
            .depositCategory(depositDTO.getDepositCategory())
            .depositContent(depositDTO.getDepositContent())
            .depositName(depositDTO.getDepositName())
            .depositRate(depositDTO.getDepositRate())
            .depositState(depositDTO.getDepositState())
            .build();
}

    // Entity -> DTO 변환
    private DepositDTO convertToDepositDTO(DepositEntity depositEntity) {
        return DepositDTO.builder()
                .depositNo(depositEntity.getDepositNo())
                .depositName(depositEntity.getDepositName())
                .depositCategory(depositEntity.getDepositCategory())
                .depositRate(depositEntity.getDepositRate())
                .depositContent(depositEntity.getDepositContent())
                .depositState(depositEntity.getDepositState())
                .build();  // 여기서 .build()를 추가
    }

    // 상품 등록 메서드
    public void addDepositProduct(DepositDTO depositDTO) {
        // DTO를 엔티티로 변환
        DepositEntity depositEntity = DepositEntity.builder()
                .depositName(depositDTO.getDepositName())
                .depositCategory(depositDTO.getDepositCategory())
                .depositRate(depositDTO.getDepositRate())
                .depositContent(depositDTO.getDepositContent())
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
                .map(deposit -> new DepositDTO(
                        deposit.getDepositNo(),         // 예금 번호
                        deposit.getDepositName(),       // 예금 이름
                        deposit.getDepositCategory(),   // 예금 카테고리 (이 부분이 추가됨)
                        deposit.getDepositRate(),       // 예금 금리
                        deposit.getDepositContent(),    // 예금 설명
                        deposit.getDepositState()       // 예금 상태
                ))
                .collect(Collectors.toList());  // 변환된 DepositDTO 리스트를 다시 리스트로 수집

        // 2. 변환된 DepositDTO 리스트를 전체 상품 리스트에 추가
        allProducts.addAll(deposits);

        // 3. LoanEntity를 LoanDTO로 변환 (이 부분도 추가해야 함)
        /*
        List<LoanDTO> loans = loanRepository.findAll()
                .stream()
                .map(loan -> new LoanDTO(
                        loan.getLoanNo(),
                        loan.getLoanName(),
                        loan.getLoanRate(),
                        loan.getLoanContent(),
                        loan.getLoanState()
                ))
                .collect(Collectors.toList());

        allProducts.addAll(loans);
        */
        return allProducts;
    }


    // 상품 판매량 차트 데이터 조회
    public Map<String, Integer> getProductCounts() {
        System.out.println("<<< AdminService getProductCounts >>>");
        Map<String, Integer> productCounts = new HashMap<>();
        productCounts.put("Deposits", depositRepository.countByDepositState('Y'));
        //productCounts.put("Loans", loanRepository.countByLoanState('y'));
        System.out.println("<<< AdminService productCounts >>> " + productCounts);
        return productCounts;
    }
//------------------------------------ 적금 관련 ------------------------------------------
    // 적금 상품 목록 조회
    public List<DepositDTO> savings() {
        System.out.println("<<< AdminService savings >>>");
        List<DepositDTO> list = new ArrayList<>();
        // 적금 카테고리 3번이면서 depositState가 'Y'인 상품만 조회
        List<DepositEntity> savings = depositRepository.findByDepositCategoryAndDepositState(3, 'Y');

        // 조회된 적금 상품들을 DTO로 변환
        for (DepositEntity eDto : savings) {
            DepositDTO depositDTO = DepositDTO.builder()
                    .depositNo(eDto.getDepositNo())
                    .depositName(eDto.getDepositName())
                    .depositCategory(eDto.getDepositCategory())
                    .depositRate(eDto.getDepositRate())
                    .depositContent(eDto.getDepositContent())
                    .depositState(eDto.getDepositState())
                    .build();  // 적금 DTO 생성

            list.add(depositDTO);  // 적금 DTO를 리스트에 추가
        }

        System.out.println("<<< AdminService savings - list >>> : " + list);
        return list;  // 적금 상품 목록 반환
    }

    // 적금 상품 수정
    public void updateDeposit(int depositNo, DepositDTO depositDTO) {
        DepositEntity depositEntity = depositRepository.findById(depositNo)
                .orElseThrow(() -> new IllegalArgumentException("해당 적금 상품을 찾을 수 없습니다."));

        // DTO 데이터를 엔티티로 반영
        depositEntity.setDepositName(depositDTO.getDepositName());
        depositEntity.setDepositCategory(depositDTO.getDepositCategory());
        depositEntity.setDepositRate(depositDTO.getDepositRate());
        depositEntity.setDepositContent(depositDTO.getDepositContent());

        // 변경된 엔티티 저장
        depositRepository.save(depositEntity);
    }
    // 적금 "삭제" 상태로 변경하는 메서드
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
    for (DepositEntity eDto : deposits) {
        DepositDTO depositDTO = DepositDTO.builder()
                .depositNo(eDto.getDepositNo())
                .depositName(eDto.getDepositName())
                .depositCategory(eDto.getDepositCategory())
                .depositRate(eDto.getDepositRate())
                .depositContent(eDto.getDepositContent())
                .depositState(eDto.getDepositState())
                .build();  // 예금 DTO 생성

        list.add(depositDTO);  // 예금 DTO를 리스트에 추가
    }

    return list;  // 예금 상품 목록 반환
}
//------------------------------------ 대출 관련------------------------------------------------------
    // DTO -> Entity 변환
    /*
    private LoanEntity convertToLoanEntity(LoanDTO loanDTO) {
        System.out.println("<<< AdminService convertToLoanEntity >>>");
        return LoanEntity.builder()
                .loanNo(loanDTO.getLoanNo())
                .loanName(loanDTO.getLoanName())
                .loanRate(loanDTO.getLoanRate())
                .loanContent(loanDTO.getLoanContent())
                .loanState(loanDTO.getLoanState())
                .build();
    }



    // Entity -> DTO 변환
    private LoanDTO convertToLoanDTO(LoanEntity loanEntity) {
        return LoanDTO.builder()
                .loanNo(loanEntity.getLoanNo())
                .loanName(loanEntity.getLoanName())
                .loanRate(loanEntity.getLoanRate())
                .loanContent(loanEntity.getLoanContent())
                .loanState(loanEntity.getLoanState())
                .build();
    }

    // 대출 상품 목록 조회
    public List<LoanDTO> getLoans() {
        Page<LoanEntity> loanEntities = loanRepository.findByLoanState('y',Pageable.unpaged());
        List<LoanDTO> loanDTOs = new ArrayList<>();

        for (LoanEntity entity : loanEntities) {
            LoanDTO loanDTO = LoanDTO.builder()
                    .loanNo(entity.getLoanNo())
                    .loanName(entity.getLoanName())
                    .loanRate(entity.getLoanRate())
                    .loanContent(entity.getLoanContent())
                    .loanState(entity.getLoanState())
                    .build();
            loanDTOs.add(loanDTO);
        }

    return loanDTOs;
    }

    // 대출 상품 등록
    public void registerLoan(LoanDTO loanDTO) {
        LoanEntity loanEntity = LoanEntity.builder()
                .loanName(loanDTO.getLoanName())
                .loanRate(loanDTO.getLoanRate())
                .loanContent(loanDTO.getLoanContent())
                .loanState('y')
                .build();
        System.out.println("<<< AdminService registerLoan  >>> : " + loanEntity);
        loanRepository.save(loanEntity);
    }

    // 대출 상품 수정
    public void editLoan(int loanNo, LoanDTO loanDTO) {
        LoanEntity loanEntity = loanRepository.findById(loanNo)
                .orElseThrow(() -> new IllegalArgumentException("해당 대출 상품을 찾을 수 없습니다."));

        loanEntity.setLoanName(loanDTO.getLoanName());
        loanEntity.setLoanRate(loanDTO.getLoanRate());
        loanEntity.setLoanContent(loanDTO.getLoanContent());

        loanRepository.save(loanEntity);
    }

    // 대출 상품 삭제 (loanState를 'Closed'로 변경)
    public void deleteLoan(int loanNo) {
        LoanEntity loanEntity = loanRepository.findById(loanNo)
                .orElseThrow(() -> new IllegalArgumentException("해당 대출 상품을 찾을 수 없습니다."));

        loanEntity.setLoanState('n');
        loanRepository.save(loanEntity);
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
     */
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
        System.out.println("<<< AdminService getAllLogs - list >>> : "+list);
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
                .accountOpen(accountEntity.getAccountOpen())
                .accountClose(accountEntity.getAccountClose())  // 종료일 추가
                .depositNo(accountEntity.getDeposit().getDepositNo())  // 예금 번호 추가
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
                .accountOpen(accountDTO.getAccountOpen())
                .accountClose(accountDTO.getAccountClose())  // 종료일 추가
                .build();
    }
    // NORMAL 계좌 내역 조회
    public List<AccountDTO> adAccounts() {
        System.out.println("<<< AdminService adAccounts >>>");
        List<AccountDTO> list = new ArrayList<>();
        List<AccountEntity> accounts = accountRepository.findByAccountState("NORMAL");

        for (AccountEntity eDto : accounts) {
            AccountDTO accountDTO = AccountDTO.builder()
                    .accountNo(eDto.getAccountNo())
                    .accountNumber(eDto.getAccountNumber())
                    .userNo(eDto.getUserNo())
                    .bankName(eDto.getBankName())
                    .accountBalance(eDto.getAccountBalance())
                    .accountLimit(eDto.getAccountLimit())
                    .accountPW(eDto.getAccountPW())
                    .accountState(eDto.getAccountState())
                    .accountOpen(eDto.getAccountOpen())
                    .accountClose(eDto.getAccountClose()) // 계좌 종료일 추가
                    .depositNo(eDto.getDeposit().getDepositNo())      // 예금 번호 추가
                    .build();
            list.add(accountDTO);
        }
        System.out.println("<<< AdminService getAllLogs - list >>> : " + list);
        return list;
    }

    // STOP 내역 조회
    public List<AccountDTO> adAccountStop() {
        System.out.println("<<< AdminService adAccountStop >>>");
        List<AccountDTO> list = new ArrayList<>();
        List<AccountEntity> accounts = accountRepository.findByAccountState("STOP");

        for (AccountEntity eDto : accounts) {
            AccountDTO accountDTO = AccountDTO.builder()
                    .accountNo(eDto.getAccountNo())
                    .accountNumber(eDto.getAccountNumber())
                    .userNo(eDto.getUserNo())
                    .bankName(eDto.getBankName())
                    .accountBalance(eDto.getAccountBalance())
                    .accountLimit(eDto.getAccountLimit())
                    .accountPW(eDto.getAccountPW())
                    .accountState(eDto.getAccountState())
                    .accountOpen(eDto.getAccountOpen())
                    .accountClose(eDto.getAccountClose()) // 계좌 종료일 추가
                    .depositNo(eDto.getDeposit().getDepositNo())      // 예금 번호 추가
                    .build();
            list.add(accountDTO);
        }
        System.out.println("<<< AdminService getAllLogs - list >>> : " + list);
        return list;
    }

    // Termination 내역 조회
    public List<AccountDTO> TerminationAccounts() {
        System.out.println("<<< AdminService TerminationAccounts >>>");
        List<AccountDTO> list = new ArrayList<>();
        List<AccountEntity> accounts = accountRepository.findByAccountState("TERMINATION");

        for (AccountEntity eDto : accounts) {
            AccountDTO accountDTO = AccountDTO.builder()
                    .accountNo(eDto.getAccountNo())
                    .accountNumber(eDto.getAccountNumber())
                    .userNo(eDto.getUserNo())
                    .bankName(eDto.getBankName())
                    .accountBalance(eDto.getAccountBalance())
                    .accountLimit(eDto.getAccountLimit())
                    .accountPW(eDto.getAccountPW())
                    .accountState(eDto.getAccountState())
                    .accountOpen(eDto.getAccountOpen())
                    .accountClose(eDto.getAccountClose()) // 계좌 종료일 추가
                    .depositNo(eDto.getDeposit().getDepositNo())      // 예금 번호 추가
                    .build();
            list.add(accountDTO);
        }
        return list;
    }

    //----------------------------------계좌 상태 변경 ---------------
    // 계좌를 STOP으로 변경
    public void stopAccount(int accountNo) {
        accountRepository.updateAccountState("STOP", accountNo);
    }

    // 계좌를 NORMAL로 변경
    public void resumeAccount(int accountNo) {
        accountRepository.updateAccountState("NORMAL", accountNo);
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
