package com.ict03.urambank.service;

import com.ict03.urambank.dto.AccountDTO;
import com.ict03.urambank.dto.LogDTO;
import com.ict03.urambank.dto.OutAccountDTO;
import com.ict03.urambank.entity.AccountEntity;
import com.ict03.urambank.entity.LogEntity;
import com.ict03.urambank.entity.OutAccountEntity;
import com.ict03.urambank.repository.AccountRepository;
import com.ict03.urambank.repository.LogRepository;
import com.ict03.urambank.repository.OutAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final LogRepository logRepository;
    private final OutAccountRepository outAccountRepository;

    // 'NORMAL' 상태의 모든 계좌와 관련된 정보 조회
    public List<Map<String, Object>> getAllAccountWithProductName() {
        List<Object[]> results = accountRepository.findAllAccountWithProductNameAndActive();
        List<Map<String, Object>> accountDataList = new ArrayList<>();

        for (Object[] result : results) {
            Map<String, Object> accountData = new HashMap<>();
            accountData.put("accountNo", result[0]);
            accountData.put("accountNumber", result[1]);
            accountData.put("accountBalance", result[2]);
            accountData.put("accountOpen", result[3]);
            accountData.put("productNo", result[4]);
            accountData.put("productName", result[5]);
            accountData.put("productPeriod", result[6]);

            accountDataList.add(accountData);
        }

        return accountDataList;
    }

    // productNo로 'NORMAL' 상태의 계좌만 조회
    public List<AccountDTO> listCategory(int productNo) {
        List<AccountEntity> eList = accountRepository.findByProductProductNoAndActive(productNo);
        List<AccountDTO> list = new ArrayList<>();

        for (AccountEntity e : eList) {
            list.add(AccountDTO.toAccountDTO(e));
        }

        return list;
    }

    public Map<String, Object> getAccountDetail(int accountNumber) {
        AccountEntity accountEntity = accountRepository.findAccountDetailWithProduct(accountNumber, "NORMAL");
        if (accountEntity != null) {
            Map<String, Object> accountData = new HashMap<>();
            accountData.put("accountNumber", accountEntity.getAccountNumber());
            accountData.put("accountBalance", accountEntity.getAccountBalance());
            accountData.put("accountLimit", accountEntity.getAccountLimit());
            accountData.put("accountMax", accountEntity.getAccountMax());
            accountData.put("productName", accountEntity.getProduct().getProductName());
            // 추가적인 데이터가 필요하다면 여기에 포함
            return accountData;
        } else {
            return null;
        }
    }


    // 계좌의 거래 내역 조회 (성공한 거래만)
    public List<LogDTO> getTransactionLogs(int accountNumber) {
        List<LogEntity> logEntities = logRepository.findByAccountNumberAndLogState(accountNumber);
        return logEntities.stream().map(log -> LogDTO.builder()
                        .logNo(log.getLogNo())
                        .sendAccountNo(log.getSendAccountNo())
                        .receiveAccountNo(log.getReceiveAccountNo())
                        .sendPrice(log.getSendPrice())
                        .sendDate(log.getSendDate())
                        .logState(log.getLogState())
                        .build())
                .collect(Collectors.toList());
    }

    // 계좌 비밀번호 확인
    public boolean checkAccountPassword(int accountNumber, int inputPassword) {
        AccountEntity account = accountRepository.findAccountDetailWithProduct(accountNumber, "NORMAL");
        if (account != null && account.getAccountPW() != 0) {
            return account.getAccountPW() == inputPassword;
        }
        return false;
    }

    // 계좌 비밀번호 변경
    public boolean changeAccountPassword(int accountNumber, int newPassword) {
        AccountEntity account = accountRepository.findAccountDetailWithProduct(accountNumber, "NORMAL");
        if (account != null) {
            account.setAccountPW(newPassword); // 새 비밀번호 설정
            accountRepository.save(account); // 변경 사항 저장
            return true;
        }
        return false;
    }

    // 계좌 해지
    public boolean terminateAccount(int accountNumber) {
        AccountEntity account = accountRepository.findAccountDetailWithProduct(accountNumber, "NORMAL");
        if (account != null) {
            account.setAccountState("TERMINATION"); // 계좌 상태를 'TERMINATION'으로 변경
            accountRepository.save(account); // 변경 사항 저장
            return true;
        }
        return false;
    }

    // 이체한도 변경 로직
    public boolean changeTransferLimits(int accountNumber, int newDailyLimit, int newOnceLimit) {
        AccountEntity account = accountRepository.findAccountDetailWithProduct(accountNumber, "NORMAL");

        if (account != null) {
            account.setAccountMax(newDailyLimit);   // 1일 이체한도 변경
            account.setAccountLimit(newOnceLimit);  // 1회 이체한도 변경
            accountRepository.save(account);        // 변경 사항 저장
            return true;
        }
        return false;
    }


    @Transactional
    public boolean transferAccount(int fromAccountNumber, int toAccountNumber, int transferAmount, int password, String toBankName) {
        // 출금 계좌 유효성 확인
        AccountEntity fromAccount = accountRepository.findAccountDetailWithProduct(fromAccountNumber, "NORMAL");
        if (fromAccount == null) {
            System.out.println("출금 계좌가 존재하지 않음: " + fromAccountNumber);
            return false;
        }

        // 비밀번호 확인
        if (fromAccount.getAccountPW() != password) {
            System.out.println("비밀번호 불일치: " + password);
            return false;
        }

        // 출금 가능 잔액 확인
        if (fromAccount.getAccountBalance() < transferAmount) {
            System.out.println("잔액 부족: " + fromAccount.getAccountBalance());
            return false;
        }

        // 1회 이체 한도 확인
        if (transferAmount > fromAccount.getAccountLimit()) {
            System.out.println("1회 이체 한도 초과: " + fromAccount.getAccountLimit());
            return false;
        }

        // 1일 이체 한도 확인
        int todayTotalTransfers = logRepository.sumTodayTransfers(fromAccountNumber, new java.sql.Date(System.currentTimeMillis()));
        if ((todayTotalTransfers + transferAmount) > fromAccount.getAccountMax()) {
            System.out.println("1일 이체 한도 초과: " + fromAccount.getAccountMax());
            return false;
        }

        // 외부 계좌 확인 및 처리
        if (toBankName.equals("우람은행")) {  // 내부 계좌일 경우
            AccountEntity toAccount = accountRepository.findAccountDetailWithProduct(toAccountNumber, "NORMAL");
            if (toAccount == null) {
                System.out.println("입금 계좌가 존재하지 않음: " + toAccountNumber);
                return false;
            }

            // 출금 처리
            fromAccount.setAccountBalance(fromAccount.getAccountBalance() - transferAmount);

            // 입금 처리
            toAccount.setAccountBalance(toAccount.getAccountBalance() + transferAmount);

            // DB에 저장
            accountRepository.save(fromAccount);
            accountRepository.save(toAccount);
        } else {  // 외부 계좌일 경우
            OutAccountEntity outAccount = outAccountRepository.findByOAccountNumberAndOBankNameAndOAccountState(toAccountNumber, toBankName, "NORMAL");
            if (outAccount == null) {
                System.out.println("외부 입금 계좌가 존재하지 않음 또는 상태가 정상 아님: " + toAccountNumber);
                return false;
            }

            // 출금 처리만 진행 (외부 계좌는 입금 처리하지 않음)
            fromAccount.setAccountBalance(fromAccount.getAccountBalance() - transferAmount);
            accountRepository.save(fromAccount);
        }

        // 이체 로그 기록 (성공)
        logRepository.save(LogEntity.builder()
                .sendAccountNo(fromAccountNumber)
                .receiveAccountNo(toAccountNumber)
                .sendPrice(transferAmount)
                .sendDate(new java.sql.Date(System.currentTimeMillis()))
                .logState("SUCCESS")
                .build());

        return true;  // 성공적으로 이체 완료
    }



    public String getRecipientName(int toAccountNumber, String toBankName) {
        OutAccountEntity outAccount = outAccountRepository.findByOAccountNumberAndOBankNameAndOAccountState(toAccountNumber, toBankName, "NORMAL");
        return outAccount != null ? outAccount.getOUserName() : null; // 수신자 이름 반환
    }


    // 모든 'NORMAL' 상태의 외부 계좌 정보를 가져오는 메서드
    public List<OutAccountDTO> getAllNormalOutAccounts() {
        List<OutAccountEntity> outAccountEntities = outAccountRepository.findAllNormalOutAccounts();
        return outAccountEntities.stream()
                .map(outAccount -> OutAccountDTO.builder()
                        .oUserName(outAccount.getOUserName())
                        .oAccountNumber(outAccount.getOAccountNumber()) // 필드 이름 확인
                        .oAccountState(outAccount.getOAccountState()) // null 처리
                        .oBankName(outAccount.getOBankName())
                        .oAccountNo(outAccount.getOAccountNo())
                        .build())
                .collect(Collectors.toList());
    }

    public boolean validateAccountNumberWithBank(int accountNumber, String bankName) {
        // 같은 은행인 경우 Account 테이블에서 유효성 확인
        if ("우람은행".equals(bankName)) { // 우람은행(자사은행)의 계좌일 경우
            AccountEntity account = accountRepository.findAccountDetailWithProduct(accountNumber, "NORMAL");
            return account != null; // 계좌가 존재하면 true, 아니면 false 반환
        }
        // 외부 은행일 경우 OutAccount 테이블에서 확인
        OutAccountEntity outAccount = outAccountRepository.findByOAccountNumberAndOBankNameAndOAccountState(accountNumber, bankName, "NORMAL");
        return outAccount != null; // 외부 계좌가 존재하면 true, 아니면 false 반환
    }


}
