package com.urambank.uram.service;

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
import java.time.ZoneId;
import java.util.List;

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


    // 페이징 처리된 적금 상품 리스트 반환 (depositState가 "Y"인 것만)
    public Page<DepositEntity> getDepositProductsPaged(Pageable pageable) {
        return depositRepository.findByDepositState('Y', pageable);
    }

    @Transactional
    public String saveDepositJoinWithStringValues(DepositDTO dto, String token) {
        logger.info("DepositJoinEntity 저장 시작: depositJoin = {}", dto);
        int accountNo = Integer.parseInt(dto.getAccountNo());
        // 토큰에서 userNo 추출
        int userNo = jwtUtil.getUserNo(token);

        // 비밀번호 암호화
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(dto.getDepositPw());
        dto.setDepositPw(encodedPassword);

        // depositJoinDay를 현재 날짜로 설정
        LocalDate localDepositJoinDay = LocalDate.now();
        Date depositJoinDay = Date.valueOf(localDepositJoinDay);
        dto.setDepositJoinDay(depositJoinDay.toLocalDate());

        // depositPeriod만큼 depositJoinDay에 더해서 depositFinishDay 설정
        int depositPeriod = dto.getDepositPeriod();
        LocalDate localDepositFinishDay = localDepositJoinDay.plusMonths(depositPeriod);
        Date depositFinishDay = Date.valueOf(localDepositFinishDay);
        dto.setDepositFinishDay(depositFinishDay.toLocalDate());

        // depositStatus를 'Y'로 설정
        dto.setDepositState('Y');

        // 조회
        // 토큰에서 추출한 userNo 데이터를 가지고 실존하는지 데이터 베이스 조회 후 있을 경우 데이터를 엔티티에 저장
        User user = userRepository.findById(userNo)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // User 테이블에서 조회한 정보를 기반으로 해당 userNo로 계좌를 조회 -> 조회한정보 accountentitiy저장
        AccountEntity accountEntity = accountRepository.findByUserNoAndAccountNo(user.getUserNo(), accountNo)
                .orElseThrow(() -> new IllegalArgumentException("계좌를 찾을 수 없습니다."));

        // 가입한 상품 정보를 데이터베이스에서 조회 -> DepositEntity 저장
        DepositEntity depositEntity = depositRepository.findById(dto.getDepositNo())
                .orElseThrow(() -> new IllegalArgumentException("대출 상품을 찾을 수 없습니다."));

        // 계좌 잔액이 충분한지 확인 getDepositBalance = 가입금액
        if (accountEntity.getAccountBalance() < dto.getDepositBalance()) {
            throw new IllegalArgumentException("계좌 잔액이 부족합니다.");
        }

        // 계좌 잔액에서 적금 가입 금액을 차감(기존계좌 업데이트)
        accountEntity.setAccountBalance(accountEntity.getAccountBalance() - dto.getDepositBalance());
        accountRepository.save(accountEntity);

        // 적금 계좌 정보를 업데이트
        AccountEntity newAccount = new AccountEntity();
        newAccount.setAccountNumber(dto.getAccountNumber()); // 적금 계좌번호 설정
        newAccount.setAccountBalance(dto.getDepositBalance()); // 적금 가입 금액
        newAccount.setAccountPW(dto.getDepositPw()); // 적금 비밀번호
        newAccount.setAccountState("NORMAL"); // 계좌 상태 설정
        newAccount.setBankName("우람은행"); // 은행 정보 설정
        newAccount.setAccountOpen(depositJoinDay); // 적금 시작일
        newAccount.setAccountClose(depositFinishDay);
        newAccount.setUserNo(userNo);
        newAccount.setDeposit(depositEntity); // 적금 상품 정보 설정 추가
        accountRepository.save(newAccount); // 적금 계좌 저장

        // 적금 가입 로그 기록
        LogEntity logEntry = LogEntity.builder()
                .sendAccountNumber(accountEntity.getAccountNumber()) // 출금 계좌의 accountNumber
                .receiveAccountNumber(dto.getAccountNumber()) // 적금 계좌번호
                .sendPrice(dto.getDepositBalance()) // 적금 가입 금액
                .sendDate(new Date(System.currentTimeMillis())) // 현재 날짜
                .logState("SUCCESS") // 고정된 상태
                .build();

        logRepository.save(logEntry); // 로그 레포지토리에 저장

        // 자동이체 설정 호출
        setUpAutoTransfer(accountEntity, newAccount,dto.getDepositTransferDay()); // depositEntity를 매개변수로 전달

        return "ok";
    }

    private void setUpAutoTransfer(AccountEntity oldAccount, AccountEntity newAccount,int transferDate) {
        logger.info("자동이체 설정 시작: savedDepositJoin = {}", oldAccount);
        // 자동이체일 설정
        LocalDate date = LocalDate.of(2024,10,transferDate);
        LocalDate startDate = LocalDate.of(newAccount.getAccountOpen().getYear(),newAccount.getAccountOpen().getMonth(),newAccount.getAccountOpen().getDate());
        LocalDate EndDate = LocalDate.of(newAccount.getAccountClose().getYear(),newAccount.getAccountClose().getMonth(),newAccount.getAccountClose().getDate());

        // 기존 계좌 조회
        AccountEntity accountEntity = accountRepository.findByAccountNumber(oldAccount.getAccountNumber())
                .orElseThrow(() -> new IllegalArgumentException("계좌를 찾을 수 없습니다."));

        // AutoTransferEntity 생성
        AutoTransferEntity autoTransfer = new AutoTransferEntity();
        autoTransfer.setAccountNo(oldAccount.getAccountNo()); // 적금 계좌 정보
        autoTransfer.setReceiveAccountNo(newAccount.getAccountNo()); // 수신 계좌 번호
        autoTransfer.setAutoSendPrice(newAccount.getAccountBalance()); // 이체 금액
        autoTransfer.setReservationDate(date); // 예약 날짜
        autoTransfer.setReservationState("ACTIVE"); // 예약 상태
        autoTransfer.setAutoShow('Y'); // 자동 표시 여부
        autoTransfer.setStartDate(startDate); // 시작일
        autoTransfer.setEndDate(EndDate); // 종료일
        autoTransfer.setTransferDay(1); // 매월 이체할 날 (예: 1일)
        autoTransfer.setToBankName("우람은행"); // 수신 은행명

        // 자동이체 데이터 저장
        autoTransferRepository.save(autoTransfer);
        logger.info("자동이체 저장 완료: autoTransfer = {}", autoTransfer);
    }

//    @Transactional
//    public String terminateDeposit(String token, int accountNo) {
//        // JWT 토큰에서 userNo 추출
//        int userNo = jwtUtil.getUserNo(token);
//
//        // 계좌 정보 가져오기
//        AccountEntity accountEntity = accountRepository.findByUserNoAndAccountNo(userNo, accountNo)
//                .orElseThrow(() -> new IllegalArgumentException("해당 계좌를 찾을 수 없습니다."));
//
//        // AccountEntity의 accountNumber로 DepositJoinEntity 찾기
//        DepositJoinEntity depositJoin = depositJoinRepository.findByDepositAccountNumber(accountEntity.getAccountNumber())
//                .orElseThrow(() -> new IllegalArgumentException("해당 적금을 찾을 수 없습니다."));
//
//        // 가입 기간 계산
//        LocalDate now = LocalDate.now();
//        LocalDate joinDate = depositJoin.getDepositJoinDay();
//        long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(joinDate, now);
//
//        // 이자율 계산
//        double interestRate = calculateInterestRate(daysBetween);
//        int totalAmount = depositJoin.getRemainingDepositAmount();
//        double interest = totalAmount * interestRate;
//
//        // 계좌 잔액 업데이트
//        accountEntity.setAccountBalance(depositJoin.getAccount().getAccountBalance()+ (int) (totalAmount + interest));
//        accountEntity.setAccountBalance(0);
//        accountEntity.setAccountState("STOP");
//        accountRepository.save(accountEntity);
//
//        // DepositJoinEntity 업데이트 (적금 잔액 및 상태 업데이트)
//        depositJoin.setRemainingDepositAmount(0);
//        depositJoin.setDepositStatus("STOP");
//        int updatedBalance = depositJoin.getAccount().getAccountBalance() + (int) (totalAmount + interest);
//        depositJoin.getAccount().setAccountBalance(updatedBalance);
//        depositJoinRepository.save(depositJoin);
//
//        // 로그 기록
//        LogEntity logEntry = LogEntity.builder()
//                .sendAccountNumber(depositJoin.getDepositAccountNumber())
//                .receiveAccountNumber(depositJoin.getAccount().getAccountNumber())
//                .sendPrice((int) (totalAmount + interest))
//                .sendDate(new Date(System.currentTimeMillis()))
//                .logState("SUCCESS")
//                .build();
//
//        logRepository.save(logEntry);
//        logger.info("적금 중도해지 완료: {}원, 계좌: {}", totalAmount + interest, accountEntity.getAccountNumber());
//
//        return "적금 중도해지가 완료되었습니다.";
//    }
//
//    private double calculateInterestRate(long daysBetween) {
//        if (daysBetween < 15) {
//            return 0.0; // 15일 미만인 경우 이자율을 0으로 설정
//        } else if (daysBetween >= 15 && daysBetween < 90) {
//            return 0.005; // 0.50%
//        } else if (daysBetween >= 90 && daysBetween < 365) {
//            return 0.01; // 1.00%
//        } else if (daysBetween >= 365) {
//            return 0.015; // 1.50%
//        } else {
//            throw new IllegalArgumentException("중도해지 가능한 기간이 아닙니다.");
//        }
//    }
//
//    public List<AccountEntity> getNormalAccounts(String token) {
//        int userNo = jwtUtil.getUserNo(token); // JWT 유틸을 사용해 토큰에서 userNo 추출
//        return accountRepository.findByUserNoAndAccountState(userNo, "NORMAL"); // "NORMAL" 상태의 계좌만 조회
//    }
}






