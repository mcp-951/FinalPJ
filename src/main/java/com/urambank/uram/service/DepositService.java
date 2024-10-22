package com.urambank.uram.service;

import com.urambank.uram.dto.AccountDTO;
import com.urambank.uram.dto.DepositDTO;
import com.urambank.uram.entities.*;
import com.urambank.uram.repository.*;
import com.urambank.uram.util.JWTUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.sql.Date;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepositService {
    private static final Logger logger = LoggerFactory.getLogger(DepositService.class); // 로거 초기화
    private final JWTUtil jwtUtil;
    private final DepositRepository depositRepository;
    private final AccountRepository accountRepository;
    private final LogRepository logRepository;
    private final UserRepository userRepository;
    private final AutoTransferRepository autoTransferRepository; // AutoTransferRepository 추가
    private final BCryptPasswordEncoder passwordEncoder;

    public List<Map<String, Object>> getNormalAccountData(String token) {
        int userNo = jwtUtil.getUserNo(token);
        List<Object[]> results = accountRepository.findAccountDataWithDeposit(userNo, "NORMAL");

        List<Map<String, Object>> accountDataList = new ArrayList<>();

        for (Object[] result : results) {
            Map<String, Object> accountData = new HashMap<>();
            accountData.put("accountNo", result[0]);
            accountData.put("accountNumber", result[1]);
            accountData.put("accountBalance", result[2]);
            accountData.put("accountOpen", result[3]);
            accountData.put("accountClose", result[4]);
            accountData.put("depositNo", result[5]);
            accountData.put("depositName", result[6]);

            accountDataList.add(accountData);
        }

        return accountDataList;
    }

    public Page<DepositDTO> getDepositProductsPaged(Pageable pageable) {
        return depositRepository.findByDepositState('Y', pageable).map(DepositDTO::toDepositDTO);
    }

    // 적금가입 , 자동이체
    @Transactional
    public String saveDepositJoinWithStringValues(DepositDTO dto, String token) {
        logger.info("DepositJoinEntity 저장 시작: depositJoin = {}", dto);

        // 토큰에서 userNo 추출
        int userNo = jwtUtil.getUserNo(token);

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(dto.getDepositPw());
        dto.setDepositPw(encodedPassword);

        // 가입일 및 만기일 설정
        LocalDate localDepositJoinDay = LocalDate.now();
        Date depositJoinDay = Date.valueOf(localDepositJoinDay);
        int depositPeriod = dto.getDepositPeriod();
        LocalDate localDepositFinishDay = localDepositJoinDay.plusMonths(depositPeriod);
        Date depositFinishDay = Date.valueOf(localDepositFinishDay);

        dto.setDepositJoinDay(depositJoinDay.toLocalDate());
        dto.setDepositFinishDay(depositFinishDay.toLocalDate());
        dto.setDepositState('Y');

        // 사용자 조회
        User user = userRepository.findById(userNo)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 기존 계좌 조회
        AccountEntity accountEntity = accountRepository.findByUserNoAndAccountNo(user.getUserNo(), Integer.parseInt(dto.getAccountNo()))
                .orElseThrow(() -> new IllegalArgumentException("계좌를 찾을 수 없습니다."));

        // 상품 정보 조회
        DepositEntity depositEntity = depositRepository.findById(dto.getDepositNo())
                .orElseThrow(() -> new IllegalArgumentException("예금 상품을 찾을 수 없습니다."));

        // 계좌 잔액 확인
        if (accountEntity.getAccountBalance() < dto.getDepositBalance()) {
            throw new IllegalArgumentException("계좌 잔액이 부족합니다.");
        }

        // 계좌 잔액 업데이트
        accountEntity.setAccountBalance(accountEntity.getAccountBalance() - dto.getDepositBalance());
        accountRepository.save(accountEntity);

        // 새 적금 계좌 생성 및 저장
        AccountEntity newAccount = createNewAccount(dto, depositEntity, userNo, depositJoinDay, depositFinishDay);
        AccountEntity savedNewAccount = accountRepository.save(newAccount);

        // 로그 기록
        logDepositTransaction(accountEntity, savedNewAccount, dto.getDepositBalance());

        // 자동이체 설정
        setUpAutoTransfer(accountEntity, savedNewAccount, dto.getDepositTransferDay());

        return "ok";
    }

    private AccountEntity createNewAccount(DepositDTO dto, DepositEntity depositEntity, int userNo, Date depositJoinDay, Date depositFinishDay) {
        AccountEntity newAccount = new AccountEntity();
        newAccount.setAccountNumber(dto.getAccountNumber());
        newAccount.setAccountBalance(dto.getDepositBalance());
        newAccount.setAccountPW(dto.getDepositPw());
        newAccount.setAccountState("NORMAL");
        newAccount.setBankName("우람은행");
        newAccount.setAccountOpen(depositJoinDay);
        newAccount.setAccountClose(depositFinishDay);
        newAccount.setUserNo(userNo);
        newAccount.setDeposit(depositEntity);
        newAccount.setWithdrawal('Y');
        newAccount.setAgreement('Y');

        // 사용자 등급에 따른 이자율 계산
        int userGrade = userRepository.findById(userNo).get().getGrade();
        double depositMaximumRate = depositEntity.getDepositMaximumRate();
        double userRate = depositMaximumRate - (0.2 * (userGrade - 1));
        newAccount.setAccountRate((float) userRate);

        return newAccount;
    }

    private void logDepositTransaction(AccountEntity sendingAccount, AccountEntity receivingAccount, int amount) {
        LogEntity logEntry = LogEntity.builder()
                .sendAccountNumber(sendingAccount.getAccountNumber())
                .receiveAccountNumber(receivingAccount.getAccountNumber())
                .sendPrice(amount)
                .sendDate(new Date(System.currentTimeMillis()))
                .logState("SUCCESS")
                .build();
        logRepository.save(logEntry);
    }

    private void setUpAutoTransfer(AccountEntity sendingAccount, AccountEntity savedNewAccount, int transferDate) {
        logger.info("자동이체 설정 시작: sendingAccount = {}", sendingAccount);

        LocalDate date = LocalDate.of(2024, 10, transferDate);
        Date startDate = (Date) savedNewAccount.getAccountOpen();
        Date endDate = (Date) savedNewAccount.getAccountClose();

        AutoTransferEntity autoTransfer = new AutoTransferEntity();
        autoTransfer.setAccountNo(sendingAccount.getAccountNo());
        autoTransfer.setReceiveAccountNo(savedNewAccount.getAccountNo());
        autoTransfer.setAutoSendPrice(savedNewAccount.getAccountBalance());
        autoTransfer.setReservationDate(date);
        autoTransfer.setReservationState("SUCCESS");
        autoTransfer.setStartDate(startDate.toLocalDate());
        autoTransfer.setEndDate(endDate.toLocalDate());
        autoTransfer.setTransferDay(transferDate);
        autoTransfer.setToBankName("우람은행");
        autoTransfer.setAutoAgreement('Y');

        autoTransferRepository.save(autoTransfer);
        logger.info("자동이체 저장 완료: autoTransfer = {}", autoTransfer);
    }

    // 정기예금
    @Transactional
    public String saveDeposit(DepositDTO dto, String token) {
        logger.info("정기예금 가입 시작: {}", dto);

        int userNo = jwtUtil.getUserNo(token);
        User user = userRepository.findById(userNo)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        String encodedPassword = passwordEncoder.encode(dto.getDepositPw());
        dto.setDepositPw(encodedPassword);

        LocalDate localDepositJoinDay = LocalDate.now();
        Date depositJoinDay = Date.valueOf(localDepositJoinDay);

        int depositPeriod = dto.getDepositPeriod();
        LocalDate localDepositFinishDay = localDepositJoinDay.plusMonths(depositPeriod);
        Date depositFinishDay = Date.valueOf(localDepositFinishDay);

        dto.setDepositFinishDay(depositFinishDay.toLocalDate());
        dto.setDepositState('Y');

        DepositEntity depositEntity = depositRepository.findById(dto.getDepositNo())
                .orElseThrow(() -> new IllegalArgumentException("적금 상품을 찾을 수 없습니다."));

        double depositMaximumRate = depositEntity.getDepositMaximumRate();
        int userGrade = user.getGrade();
        double userRate = depositMaximumRate - (0.2 * (userGrade - 1));

        // 기존 계좌 조회
        AccountEntity existingAccount = accountRepository.findByUserNoAndAccountNo(user.getUserNo(), Integer.parseInt(dto.getAccountNo()))
                .orElseThrow(() -> new IllegalArgumentException("계좌를 찾을 수 없습니다."));

        if (existingAccount.getAccountBalance() < dto.getDepositBalance()) {
            throw new IllegalArgumentException("계좌 잔액이 부족합니다.");
        }

        existingAccount.setAccountBalance(existingAccount.getAccountBalance() - dto.getDepositBalance());
        accountRepository.save(existingAccount);

        AccountEntity newAccount = new AccountEntity();
        newAccount.setAccountNumber(dto.getAccountNumber());
        newAccount.setAccountPW(dto.getDepositPw());
        newAccount.setAccountState("NORMAL");
        newAccount.setBankName("우람은행");
        newAccount.setAccountOpen(depositJoinDay);
        newAccount.setAccountClose(depositFinishDay);
        newAccount.setUserNo(userNo);
        newAccount.setDeposit(depositEntity);
        newAccount.setAccountRate((float) userRate);
        newAccount.setAccountBalance(dto.getDepositBalance()); // 초기 잔액 설정
        newAccount.setAgreement('Y');
        newAccount.setWithdrawal('Y');
        accountRepository.save(newAccount);

        // 로그 기록 추가
        LogEntity logEntry = LogEntity.builder()
                .sendAccountNumber(existingAccount.getAccountNumber())
                .receiveAccountNumber(newAccount.getAccountNumber())
                .sendPrice(dto.getDepositBalance())
                .sendDate(new Date(System.currentTimeMillis()))
                .logState("SUCCESS")
                .build();
        logRepository.save(logEntry);
        logger.info("정기예금 가입 로그 기록 완료: {}", logEntry);

        return "ok";
    }


    // 가입 예적금찾기
    public List<Map<String, Object>> getUserDepositAccounts(String token) {
        int userNo = jwtUtil.getUserNo(token);
        List<Object[]> results = accountRepository.findUserDepositAccounts(userNo, "NORMAL");

        System.out.println("사용자 번호: " + userNo);
        System.out.println("조회된 계좌 수: " + results.size());

        List<Map<String, Object>> accountDataList = new ArrayList<>();

        for (Object[] result : results) {
            // 각 배열 요소 출력
            System.out.println("조회된 계좌 데이터13231231232:");
            for (int i = 0; i < result.length; i++) {
                System.out.println("Index " + i + ": " + result[i]);
            }

            Map<String, Object> accountData = new HashMap<>();
            accountData.put("accountNo", result[0]);
            accountData.put("accountNumber", result[1]);
            accountData.put("accountBalance", result[2]);
            accountData.put("accountOpen", result[3]);
            accountData.put("accountClose", result[4]);
            accountData.put("withdrawal", result[5]);
            accountData.put("depositNo", result[6]);
            accountData.put("depositName", result[7]);
            accountData.put("depositCategory", result[8]);

            accountDataList.add(accountData);
        }

        return accountDataList;
    }

    @Transactional
    public AccountDTO processEmergencyWithdrawal(String accountNumber, String targetAccountNumber, int amount, String token) {
        int userNo = jwtUtil.getUserNo(token);

        // 출금 계좌 확인 (accountNo와 userNo를 이용)
        AccountEntity withdrawalAccount = accountRepository.findByAccountNumberAndUserNo(accountNumber, userNo)
                .orElseThrow(() -> new IllegalArgumentException("출금 계좌를 찾을 수 없습니다."));
        System.out.println("withdrawalAccount 번호: " + withdrawalAccount);

        // 잔액 확인
        if (withdrawalAccount.getAccountBalance() < amount) {
            throw new IllegalArgumentException("계좌 잔액이 부족합니다.");
        }

        // 입금 계좌 확인
        AccountEntity depositAccount = accountRepository.findByAccountNumber(targetAccountNumber)
                .orElseThrow(() -> new IllegalArgumentException("입금 계좌를 찾을 수 없습니다."));

        // 출금 처리
        withdrawalAccount.setAccountBalance(withdrawalAccount.getAccountBalance() - amount);
        withdrawalAccount.setWithdrawal('N'); // 출금된 계좌의 withdrawal을 'N'로 설정
        accountRepository.save(withdrawalAccount);

        // 입금 처리
        depositAccount.setAccountBalance(depositAccount.getAccountBalance() + amount);
        accountRepository.save(depositAccount);

        // 로그 기록 추가
        LogEntity logEntry = LogEntity.builder()
                .sendAccountNumber(withdrawalAccount.getAccountNumber())
                .receiveAccountNumber(depositAccount.getAccountNumber())
                .sendPrice(amount)
                .sendDate(new Date(System.currentTimeMillis()))
                .logState("SUCCESS")
                .build();
        logRepository.save(logEntry);
        logger.info("긴급 출금 로그 기록 완료: {}", logEntry);

        // DTO로 변환하여 반환
        return AccountDTO.toAccountDTO(withdrawalAccount);
    }

    // 입출금 가입
    @Transactional
    public String ReceivedPaid(DepositDTO dto, String token) {
        logger.info("정기예금 가입 시작: {}", dto);

        int userNo = jwtUtil.getUserNo(token);
        User user = userRepository.findById(userNo)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        String encodedPassword = passwordEncoder.encode(dto.getDepositPw());
        dto.setDepositPw(encodedPassword);

        LocalDate localDepositJoinDay = LocalDate.now();
        Date depositJoinDay = Date.valueOf(localDepositJoinDay);

        // 종료일을 2099-12-31로 고정
        Date depositFinishDay = Date.valueOf("2099-12-31");
        dto.setDepositFinishDay(LocalDate.parse("2099-12-31"));
        dto.setDepositState('Y');

        DepositEntity depositEntity = depositRepository.findById(dto.getDepositNo())
                .orElseThrow(() -> new IllegalArgumentException("적금 상품을 찾을 수 없습니다."));

        AccountEntity newAccount = new AccountEntity();
        newAccount.setAccountNumber(dto.getAccountNumber());
        newAccount.setAccountPW(dto.getDepositPw());
        newAccount.setAccountState("NORMAL");
        newAccount.setBankName("우람은행");
        newAccount.setAccountOpen(depositJoinDay);
        newAccount.setAccountClose(depositFinishDay); // 고정된 종료일 설정
        newAccount.setUserNo(userNo);
        newAccount.setDeposit(depositEntity);
        newAccount.setAgreement('Y');
        newAccount.setWithdrawal('N');
        accountRepository.save(newAccount);

        return "ok";
    }

    public String getUserPhoneNumber(String token) {
        int userNo = jwtUtil.getUserNo(token);
        User user = userRepository.findByUserNo(userNo);
        if (user != null) {
            return user.getHp(); // 휴대폰 번호 필드가 `hp`인 경우
        }
        return null; // 유저가 없을 경우 null 반환
    }

}







