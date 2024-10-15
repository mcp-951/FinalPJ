package com.urambank.uram.service;

import com.urambank.uram.entities.*;
import com.urambank.uram.repository.*;
import com.urambank.uram.util.JWTUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoanService {
    private static final Logger logger = LoggerFactory.getLogger(LoanService.class);
    private final LoanRepository loanRepository;
    private final JWTUtil jwtUtil;
    private final AccountRepository accountRepository;
    private final LoanJoinRepository loanJoinRepository;
    private final LoanAutoTransferRepository loanAutoTransferRepository;
    private final LogRepository logRepository;

    // 페이징 처리된 대출 상품 리스트 반환 (loanState가 "Y"인 것만)
    public Page<LoanEntity> getLoanProductsPaged(Pageable pageable) {
        return loanRepository.findByLoanState('Y', pageable);
    }

    public List<AccountEntity> getNormalAccounts(String token) {
        System.out.println("service - getNormalAccounts");
        int userNo = jwtUtil.getUserNo(token); // JWT 유틸을 사용해 토큰에서 userNo 추출
        List<AccountEntity> list = accountRepository.findByUserNoAndAccountState(userNo, "NORMAL");
        System.out.println("list =" + list.size());
        return list; // "NORMAL" 상태의 계좌만 조회
    }

    public LoanJoinEntity saveLoanJoin(LoanJoinEntity loanJoin, String token) {
        logger.info("LoanJoinEntity 저장 시작: loanJoin = {}", loanJoin);

        // 토큰에서 userNo를 추출하여 LoanJoin 엔티티에 설정
        int userNo = jwtUtil.getUserNo(token);
        loanJoin.setUserNo(userNo);
        logger.info("토큰에서 추출한 userNo 설정: userNo = {}", userNo);

        // loanJoinDay를 현재 날짜로 설정
        LocalDate localLoanJoinDay = LocalDate.now();
        Date loanJoinDay = Date.valueOf(localLoanJoinDay);
        loanJoin.setLoanJoinDay(loanJoinDay);
        logger.info("loanJoinDay 설정: loanJoinDay = {}", loanJoinDay);

        // loanPeriod만큼 loanJoinDay에 더해서 loanFinishDay 설정
        int loanPeriod = loanJoin.getLoanPeriod();
        LocalDate localLoanFinishDay = localLoanJoinDay.plusMonths(loanPeriod);
        Date loanFinishDay = Date.valueOf(localLoanFinishDay);
        loanJoin.setLoanFinishDay(loanFinishDay);
        logger.info("loanFinishDay 설정: loanFinishDay = {}", loanFinishDay);

        // loanStatus를 'Y'로 설정
        loanJoin.setLoanStatus("Y");
        logger.info("loanStatus 설정: Y");

        // remainingLoanAmount에 loanAmount 값을 설정
        loanJoin.setRemainingLoanAmount(loanJoin.getLoanAmount());
        logger.info("remainingLoanAmount 설정: {}", loanJoin.getRemainingLoanAmount());

        // loanNo를 사용하여 loanName을 가져오기
        LoanEntity loanEntity = loanRepository.findByLoanNo(loanJoin.getLoanNo());
        String loanName = loanEntity != null ? loanEntity.getLoanName() : ""; // null 체크 후 loanName 설정
        loanJoin.setLoanName(loanName);
        logger.info("loanName 설정: {}", loanName);

        // loanJoin 데이터를 저장
        LoanJoinEntity savedLoanJoin = loanJoinRepository.save(loanJoin);
        logger.info("LoanJoinEntity 저장 완료: savedLoanJoin = {}", savedLoanJoin);

        // 계좌의 잔액을 대출금만큼 수정
        updateAccountBalance(savedLoanJoin);

        AccountEntity accountEntity = accountRepository.findByUserNoAndAccountNo(userNo, savedLoanJoin.getAccountNo())
                .orElseThrow(() -> new IllegalArgumentException("계좌를 찾을 수 없습니다."));

        // 대출금 로그 기록
        LogEntity logEntry = LogEntity.builder()
                .sendAccountNumber("987-65-43210") // 대출금이 입금되는 계좌의 accountNumber
                .receiveAccountNumber(accountEntity.getAccountNumber())
                .sendPrice(savedLoanJoin.getLoanAmount()) // 대출금
                .sendDate(new Date(System.currentTimeMillis())) // 현재 날짜
                .logState("SUCCESS") // 고정된 상태
                .build();

        // 로그 레포지토리에 저장
        logRepository.save(logEntry); // 로그 엔티티 저장
        logger.info("대출금 로그 기록 완료: logEntry = {}", logEntry);

        // 자동이체 설정 호출
        setUpAutoTransfer(savedLoanJoin);

        return savedLoanJoin;
    }


    // 계좌의 잔액을 대출금만큼 수정하는 메서드
    private void updateAccountBalance(LoanJoinEntity loanJoin) {
        AccountEntity account = accountRepository.findById(loanJoin.getAccountNo())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        // 대출금만큼 계좌 잔액을 추가
        int updatedBalance = account.getAccountBalance() + loanJoin.getLoanAmount();
        account.setAccountBalance(updatedBalance);

        // 수정된 계좌 정보를 저장
        accountRepository.save(account);
        logger.info("계좌 잔액 수정 완료: accountNo = {}, updatedBalance = {}", account.getAccountNo(), updatedBalance);
    }


    // 자동이체를 설정하는 메서드
    private void setUpAutoTransfer(LoanJoinEntity loanJoin) {
        logger.info("자동이체 설정 시작: loanJoin = {}", loanJoin);

        // Loan 정보를 가져오기
        LoanEntity loanEntity = loanRepository.findById(loanJoin.getLoanNo())
                .orElseThrow(() -> new IllegalArgumentException("Loan not found"));
        logger.info("Loan 정보 조회 완료: loanEntity = {}", loanEntity);

        // 이체 금액 계산
        int autoSendPrice = calculateAutoSendPrice(
                loanJoin.getLoanAmount(),
                loanEntity.getLoanRate(),
                loanJoin.getLoanPeriod(),
                loanJoin.getRepaymentMethod()
        );
        logger.info("이체 금액 계산 완료: autoSendPrice = {}", autoSendPrice);

        // OutAccountEntity에서 receiveAccountNo 가져오기
        int receiveAccountNo = getReceiveAccountNo(loanJoin.getUserNo());
        logger.info("receiveAccountNo 조회 완료: receiveAccountNo = {}", receiveAccountNo);

        // LoanAutoTransferEntity 생성
        LoanAutoTransferEntity loanAutoTransfer = new LoanAutoTransferEntity(); // 변경된 부분
        loanAutoTransfer.setLoanJoinNo(loanJoin.getLoanNo());
        loanAutoTransfer.setAccountNo(loanJoin.getAccountNo());
        loanAutoTransfer.setReceiveAccountNo(receiveAccountNo);
        loanAutoTransfer.setAutoSendPrice(autoSendPrice);
        loanAutoTransfer.setReservationDate(loanJoin.getLoanJoinDay().toLocalDate());
        loanAutoTransfer.setReservationState("ACTIVE");
        loanAutoTransfer.setAutoShow('Y');
        loanAutoTransfer.setStartDate(loanJoin.getLoanJoinDay().toLocalDate());
        loanAutoTransfer.setEndDate(loanJoin.getLoanFinishDay().toLocalDate());
        loanAutoTransfer.setTransferDay(loanJoin.getLoanTransferDay());
        loanAutoTransfer.setToBankName("동명은행");

        // loanJoinNo를 설정
        loanAutoTransfer.setLoanJoinNo(loanJoin.getLoanJoinNo());
        logger.info("LoanAutoTransferEntity 생성 완료: loanJoinNo = {}", loanAutoTransfer.getLoanJoinNo());

        // 자동이체 데이터 저장
        loanAutoTransferRepository.save(loanAutoTransfer);
        logger.info("자동이체 저장 완료: autoTransfer = {}", loanAutoTransfer);
    }


    // 이체 금액을 계산하는 메서드
    private int calculateAutoSendPrice(int loanAmount, double loanRate, int loanPeriod, String repaymentMethod) {
        logger.info("이체 금액 계산 시작: loanAmount = {}, loanRate = {}, loanPeriod = {}, repaymentMethod = {}",
                loanAmount, loanRate, loanPeriod, repaymentMethod);

        double rate = loanRate / 12 / 100; // 월 이자율로 변환
        int totalPayment = 0;

        switch (repaymentMethod) {
            case "원리금균등상환":
                totalPayment = (int) ((loanAmount * rate) / (1 - Math.pow(1 + rate, -loanPeriod)));
                break;
            case "원금균등상환":
                totalPayment = loanAmount / loanPeriod;
                break;
            case "원금만기일시상환":
                totalPayment = (int) (loanAmount * rate);
                break;
        }
        logger.info("이체 금액 계산 완료: totalPayment = {}", totalPayment);
        return totalPayment;
    }

    // OutAccountEntity에서 receiveAccountNo를 가져오는 메서드
    private int getReceiveAccountNo(int userNo) {
        // receiveAccountNo를 1로 고정
        logger.info("receiveAccountNo를 1로 고정: userNo = {}", userNo);
        return 1; // receiveAccountNo는 1로 고정
    }

    public List<LoanJoinEntity> getActiveLoans(String token) {
        int userNo = jwtUtil.getUserNo(token); // JWT 유틸을 사용해 토큰에서 userNo 추출
        System.out.println("Extracted userNo: "+userNo); // userNo를 콘솔에 출력
        return loanJoinRepository.findByUserNoAndLoanStatus(userNo, "Y"); // "Y" 상태의 대출만 조회
    }

    @Transactional
    public void processRepayment(String token, int accountNo, int loanJoinNo, int repaymentAmount) {
        // 토큰에서 userNo 추출
        int userNo = jwtUtil.getUserNo(token);

        // 해당 userNo와 accountNo로 계좌 찾기
        AccountEntity accountEntity = accountRepository.findByUserNoAndAccountNo(userNo, accountNo)
                .orElseThrow(() -> new IllegalArgumentException("계좌를 찾을 수 없습니다."));

        // 계좌 잔액에서 입금할 금액 차감
        accountEntity.setAccountBalance(accountEntity.getAccountBalance() - repaymentAmount);
        accountRepository.save(accountEntity); // 계좌 잔액 업데이트

        // 해당 userNo와 loanJoinNo로 대출 찾기
        LoanJoinEntity loanJoinEntity = loanJoinRepository.findByUserNoAndLoanJoinNo(userNo, loanJoinNo)
                .orElseThrow(() -> new IllegalArgumentException("대출 정보를 찾을 수 없습니다."));

        // 대출 잔액에서 입금할 금액 차감
        int newRemainingLoanAmount = loanJoinEntity.getRemainingLoanAmount() - repaymentAmount;
        loanJoinEntity.setRemainingLoanAmount(newRemainingLoanAmount);
        loanJoinRepository.save(loanJoinEntity); // 대출 잔액 업데이트

        // 만약 남은 대출 금액이 0이면 loanStatus를 "N"으로 변경
        if (newRemainingLoanAmount <= 0) {
            loanJoinEntity.setLoanStatus("N");
            loanJoinRepository.save(loanJoinEntity); // 대출 상태 업데이트
        }

        // 로그 기록
        LogEntity logEntry = LogEntity.builder()
                .sendAccountNumber(accountEntity.getAccountNumber()) // 선택한 계좌의 accountNumber
                .receiveAccountNumber("987-65-43210") // 고정된 수신 계좌번호
                .sendPrice(repaymentAmount) // 대출 이체 금액
                .sendDate(new Date(System.currentTimeMillis())) // 현재 날짜
                .logState("SUCCESS") // 고정된 상태
                .build();

        // 로그 레포지토리에 저장
        logRepository.save(logEntry); // 로그 엔티티 저장
    }



}




