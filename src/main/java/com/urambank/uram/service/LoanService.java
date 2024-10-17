package com.urambank.uram.service;

import com.urambank.uram.dto.LoanDTO;
import com.urambank.uram.dto.LoanJoinDTO;
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
import java.util.List;

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
    private final UserRepository userRepository;

    // 페이징 처리된 대출 상품 리스트 반환 (loanState가 "Y"인 것만)
    public Page<LoanEntity> getLoanProductsPaged(Pageable pageable) {
        return loanRepository.findByLoanState('Y', pageable);
    }

    public List<AccountEntity> getNormalAccounts(String token) {
        int userNo = jwtUtil.getUserNo(token); // JWT 유틸을 사용해 토큰에서 userNo 추출
        return accountRepository.findByUserNoAndAccountState(userNo, "NORMAL"); // "NORMAL" 상태의 계좌만 조회
    }

    @Transactional
    public LoanJoinEntity saveLoanJoin(String accountNoStr, String loanNoStr, LoanJoinEntity loanJoin, String token) {
        logger.info("LoanJoinEntity 저장 시작: loanJoin = {}", loanJoin);

        // String을 Integer로 변환
        int accountNo = Integer.parseInt(accountNoStr);
        int loanNo = Integer.parseInt(loanNoStr);

        // 토큰에서 userNo 추출
        int userNo = jwtUtil.getUserNo(token);
        User user = userRepository.findById(userNo)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // userNo와 accountNo로 AccountEntity 찾기
        AccountEntity accountEntity = accountRepository.findByUserNoAndAccountNo(userNo, accountNo)
                .orElseThrow(() -> new IllegalArgumentException("계좌를 찾을 수 없습니다."));

        // loanNo로 LoanEntity 찾기
        LoanEntity loanEntity = loanRepository.findById(loanNo)
                .orElseThrow(() -> new IllegalArgumentException("대출 상품을 찾을 수 없습니다."));

        // LoanJoinEntity에 AccountEntity와 LoanEntity 설정
        loanJoin.setAccount(accountEntity);
        loanJoin.setLoan(loanEntity);
        loanJoin.setUser(user);

        // loanName을 LoanEntity에서 가져와 설정
        loanJoin.setLoanName(loanEntity.getLoanName()); // LoanEntity에서 loanName 가져오기

        // loanJoinDay를 현재 날짜로 설정
        LocalDate loanJoinDay = LocalDate.now();
        loanJoin.setLoanJoinDay(loanJoinDay);
        logger.info("loanJoinDay 설정: loanJoinDay = {}", loanJoin.getLoanJoinDay());

        // loanFinishDay를 loanJoinDay에 loanPeriod(개월 수)를 더하여 설정
        int loanPeriod = loanJoin.getLoanPeriod();
        LocalDate loanFinishDay = loanJoinDay.plusMonths(loanPeriod);
        loanJoin.setLoanFinishDay(loanFinishDay);
        logger.info("loanFinishDay 설정: loanFinishDay = {}", loanJoin.getLoanFinishDay());

        // loanStatus를 'Y'로 고정
        loanJoin.setLoanStatus("Y");
        logger.info("loanStatus 설정: Y");

        // remainingLoanAmount에 loanAmount 값을 설정
        loanJoin.setRemainingLoanAmount(loanJoin.getLoanAmount());
        logger.info("remainingLoanAmount 설정: {}", loanJoin.getRemainingLoanAmount());

        // loanJoin 데이터를 저장
        LoanJoinEntity savedLoanJoin = loanJoinRepository.save(loanJoin);
        logger.info("LoanJoinEntity 저장 완료: savedLoanJoin = {}", savedLoanJoin);

        // 계좌의 잔액을 대출금만큼 수정
        updateAccountBalance(savedLoanJoin);

        // 대출금 로그 기록
        LogEntity logEntry = LogEntity.builder()
                .sendAccountNumber("987-65-43210") // 대출금이 입금되는 계좌의 accountNumber
                .receiveAccountNumber(accountEntity.getAccountNumber())
                .sendPrice(savedLoanJoin.getLoanAmount()) // 대출금
                .sendDate(new Date(System.currentTimeMillis())) // 현재 날짜
                .logState("SUCCESS") // 고정된 상태
                .build();

        // 로그 레포지토리에 저장
        logRepository.save(logEntry);
        logger.info("대출금 로그 기록 완료: logEntry = {}", logEntry);

        // 자동이체 설정 호출
        setUpAutoTransfer(savedLoanJoin);

        return savedLoanJoin;
    }

    // 계좌의 잔액을 대출금만큼 수정하는 메서드
    private void updateAccountBalance(LoanJoinEntity loanJoin) {
        AccountEntity account = accountRepository.findById(loanJoin.getAccount().getAccountNo())
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
        LoanEntity loanEntity = loanRepository.findById(loanJoin.getLoan().getLoanNo())
                .orElseThrow(() -> new IllegalArgumentException("Loan not found"));
        logger.info("Loan 정보 조회 완료: loanEntity = {}", loanEntity);

        // 이체 금액 계산
        int autoSendPrice = calculateRepayment(loanJoin);
        logger.info("이체 금액 계산 완료: autoSendPrice = {}", autoSendPrice);

        // receiveAccountNo 가져오기
        int receiveAccountNo = getReceiveAccountNo(loanJoin.getUser().getUserNo());
        logger.info("receiveAccountNo 조회 완료: receiveAccountNo = {}", receiveAccountNo);

        // LoanAutoTransferEntity 생성
        LoanAutoTransferEntity loanAutoTransfer = new LoanAutoTransferEntity();
        loanAutoTransfer.setLoanJoin(loanJoin);
        loanAutoTransfer.setAccountNo(loanJoin.getAccount());
        loanAutoTransfer.setReceiveAccountNo(receiveAccountNo);
        loanAutoTransfer.setAutoSendPrice(autoSendPrice);
        loanAutoTransfer.setReservationDate(loanJoin.getLoanJoinDay());
        loanAutoTransfer.setReservationState("ACTIVE");
        loanAutoTransfer.setAutoShow('Y');
        loanAutoTransfer.setStartDate(loanJoin.getLoanJoinDay());
        loanAutoTransfer.setEndDate(loanJoin.getLoanFinishDay());
        loanAutoTransfer.setTransferDay(loanJoin.getLoanTransferDay());
        loanAutoTransfer.setToBankName("동명은행");

        // 자동이체 데이터 저장
        loanAutoTransferRepository.save(loanAutoTransfer);
        logger.info("자동이체 저장 완료: autoTransfer = {}", loanAutoTransfer);
    }

    // 이체 금액을 계산하는 메서드
    private int calculateRepayment(LoanJoinEntity loanJoin) {
        LoanEntity loan = loanJoin.getLoan();
        double rate = loan.getLoanRate() / 12 / 100; // 월 이자율 계산
        int amount = loanJoin.getLoanAmount();
        int months = loanJoin.getLoanPeriod();
        double balance = loanJoin.getRemainingLoanAmount();

        switch (loanJoin.getRepaymentMethod()) {
            case "원리금균등상환":
                double monthlyPayment = (amount * rate) / (1 - Math.pow(1 + rate, -months));
                return (int) Math.round(monthlyPayment);
            case "원금균등상환":
                int principalPayment = amount / months;
                double interest = balance * rate;
                return (int) Math.round(principalPayment + interest);
            case "원금만기일시상환":
                return (months == 1) ? (int) Math.round(amount + (amount * rate)) : (int) Math.round(amount * rate);
            default:
                throw new IllegalArgumentException("잘못된 상환방식입니다.");
        }
    }
    // receiveAccountNo를 가져오는 메서드
    private int getReceiveAccountNo(int userNo) {
        logger.info("receiveAccountNo를 1로 고정: userNo = {}", userNo);
        return 1;
    }

    public List<LoanJoinEntity> getActiveLoans(String token) {
        int userNo = jwtUtil.getUserNo(token); // JWT 유틸을 사용해 토큰에서 userNo 추출
        System.out.println("Extracted userNo: "+userNo); // userNo를 콘솔에 출력
        return loanJoinRepository.findByUser_UserNoAndLoanStatus(userNo, "Y"); // "Y" 상태의 대출만 조회
    }

    @Transactional
    public void processRepayment(String token, int accountNo, int loanJoinNo, int repaymentAmount) {
        int userNo = jwtUtil.getUserNo(token);

        AccountEntity accountEntity = accountRepository.findByUserNoAndAccountNo(userNo, accountNo)
                .orElseThrow(() -> new IllegalArgumentException("계좌를 찾을 수 없습니다."));

        accountEntity.setAccountBalance(accountEntity.getAccountBalance() - repaymentAmount);
        accountRepository.save(accountEntity);

        LoanJoinEntity loanJoinEntity = loanJoinRepository.findByUser_UserNoAndLoanJoinNo(userNo, loanJoinNo)
                .orElseThrow(() -> new IllegalArgumentException("대출 정보를 찾을 수 없습니다."));

        int newRemainingLoanAmount = loanJoinEntity.getRemainingLoanAmount() - repaymentAmount;
        loanJoinEntity.setRemainingLoanAmount(newRemainingLoanAmount);
        loanJoinRepository.save(loanJoinEntity);

        if (newRemainingLoanAmount <= 0) {
            loanJoinEntity.setLoanStatus("N");
            loanJoinRepository.save(loanJoinEntity);
        }

        LogEntity logEntry = LogEntity.builder()
                .sendAccountNumber(accountEntity.getAccountNumber())
                .receiveAccountNumber("987-65-43210")
                .sendPrice(repaymentAmount)
                .sendDate(new Date(System.currentTimeMillis()))
                .logState("SUCCESS")
                .build();

        logRepository.save(logEntry);
    }
}
