package com.urambank.uram.service;

import com.urambank.uram.dto.AccountDTO;
import com.urambank.uram.dto.AutoTransferDTO;
import com.urambank.uram.dto.LogDTO;
import com.urambank.uram.dto.OutAccountDTO;
import com.urambank.uram.entities.*;
import com.urambank.uram.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final LogRepository logRepository;
    private final OutAccountRepository outAccountRepository;
    private final UserRepository userRepository;
    private final AutoTransferRepository autoTransferRepository;


    // 'NORMAL' 상태의 모든 계좌와 관련된 정보 조회
    public List<Map<String, Object>> getAllAccountWithProductName(int userNo) {
        List<Object[]> results = accountRepository.findAllAccountWithProductNameAndActive(userNo);
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

    public String getUserNameByUserNo(int userNo) {
        User user = userRepository.findByUserNo(userNo);
        return user != null ? user.getName() : null;
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

    public Map<String, Object> getAccountDetail(int accountNumber, int userNo) {
        AccountEntity accountEntity = accountRepository.findAccountDetailWithProduct(accountNumber, "NORMAL", userNo);
        if (accountEntity != null) {
            Map<String, Object> accountData = new HashMap<>();
            accountData.put("accountNumber", accountEntity.getAccountNumber());
            accountData.put("accountBalance", accountEntity.getAccountBalance());
            accountData.put("accountLimit", accountEntity.getAccountLimit());
            accountData.put("accountMax", accountEntity.getAccountMax());
            accountData.put("productName", accountEntity.getProduct().getProductName());
            return accountData;
        } else {
            return null;
        }
    }

//    public Map<String, Object> getAccount(int accountNumber) {
//        AccountEntity accountEntity = accountRepository.findAccount(accountNumber, "NORMAL");
//        if (accountEntity != null) {
//            Map<String, Object> accountData = new HashMap<>();
//            accountData.put("accountNumber", accountEntity.getAccountNumber());
//            accountData.put("accountBalance", accountEntity.getAccountBalance());
//            accountData.put("accountLimit", accountEntity.getAccountLimit());
//            accountData.put("accountMax", accountEntity.getAccountMax());
//            accountData.put("productName", accountEntity.getProduct().getProductName());
//            // 추가적인 데이터가 필요하다면 여기에 포함
//            return accountData;
//        } else {
//            return null;
//        }
//    }



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
    public boolean checkAccountPassword(int userNo, int accountNumber, int inputPassword) {
        AccountEntity account = accountRepository.findAccountDetailWithProduct(accountNumber, "NORMAL", userNo);
        if (account != null && account.getAccountPW() != 0) {
            return account.getAccountPW() == inputPassword;
        }
        return false;
    }

    // 계좌 비밀번호 변경
    public boolean changeAccountPassword(int userNo, int accountNumber, int newPassword) {
        AccountEntity account = accountRepository.findAccountDetailWithProduct(accountNumber, "NORMAL", userNo);
        if (account != null) {
            account.setAccountPW(newPassword); // 새 비밀번호 설정
            accountRepository.save(account); // 변경 사항 저장
            return true;
        }
        return false;
    }

    // 계좌 해지
    public boolean terminateAccount(int userNo, int accountNumber) {
        AccountEntity account = accountRepository.findAccountDetailWithProduct(accountNumber, "NORMAL", userNo);
        if (account != null) {
            account.setAccountState("TERMINATION"); // 계좌 상태를 'TERMINATION'으로 변경
            accountRepository.save(account); // 변경 사항 저장
            return true;
        }
        return false;
    }

    // 이체한도 변경 로직
    public boolean changeTransferLimits(int userNo, int accountNumber, int newDailyLimit, int newOnceLimit) {
        AccountEntity account = accountRepository.findAccountDetailWithProduct(accountNumber, "NORMAL", userNo);
        if (account != null) {
            account.setAccountMax(newDailyLimit);   // 1일 이체한도 변경
            account.setAccountLimit(newOnceLimit);  // 1회 이체한도 변경
            accountRepository.save(account);        // 변경 사항 저장
            return true;
        }
        return false;
    }



    @Transactional
    public boolean transferAccount(int userNo, int fromAccountNumber, int toAccountNumber, int transferAmount, int password, String toBankName) {
        // 출금 계좌 유효성 확인
        AccountEntity fromAccount = accountRepository.findAccountDetailWithProduct(fromAccountNumber, "NORMAL", userNo);
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
            AccountEntity toAccount = accountRepository.findAccount(toAccountNumber, "NORMAL");
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
            AccountEntity account = accountRepository.findAccount(accountNumber, "NORMAL");
            return account != null; // 계좌가 존재하면 true, 아니면 false 반환
        }
        // 외부 은행일 경우 OutAccount 테이블에서 확인
        OutAccountEntity outAccount = outAccountRepository.findByOAccountNumberAndOBankNameAndOAccountState(accountNumber, bankName, "NORMAL");
        return outAccount != null; // 외부 계좌가 존재하면 true, 아니면 false 반환
    }

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void processAutoTransfers() {
        List<AutoTransferEntity> autoTransfers = autoTransferRepository.findAllActiveAutoTransfers();
        LocalDate today = LocalDate.now();

        for (AutoTransferEntity autoTransfer : autoTransfers) {
            // startDate와 endDate를 고려하여 해당 날짜에 이체할지 결정
            if (!autoTransfer.getStartDate().isAfter(today) && !autoTransfer.getEndDate().isBefore(today)) {
                // transferDay가 오늘의 날짜와 일치하는지 확인
                if (autoTransfer.getTransferDay() == today.getDayOfMonth()) {
                    System.out.println("자동이체 수행: " + autoTransfer.getAccountNo() + " -> " + autoTransfer.getReceiveAccountNo());
                    executeAutoTransfer(autoTransfer);
                }
            }
        }
    }


    public void executeAutoTransfer(AutoTransferEntity autoTransfer) {
        try {
            // 출금 계좌의 accountNumber와 상태로 조회 (우람은행 계좌는 상태가 "NORMAL"이라고 가정)
            AccountEntity fromAccount = accountRepository.findByAccountNoAndState(autoTransfer.getAccountNo(), "NORMAL");
            if (fromAccount == null) {
                System.out.println("출금 계좌가 존재하지 않음");
                return;
            }

            // 입금 계좌의 accountNo와 bankName을 사용해 조회
            AccountEntity toAccount = accountRepository.findByAccountNoAndBankName(
                    autoTransfer.getReceiveAccountNo(), autoTransfer.getToBankName());
            OutAccountEntity toOutAccount = null;

            if (toAccount == null) {
                // Account 테이블에서 입금 계좌를 찾지 못하면 OutAccountEntity에서 외부 계좌 조회
                toOutAccount = outAccountRepository.findByOAccountNoAndOBankName(
                        autoTransfer.getReceiveAccountNo(), autoTransfer.getToBankName());
                if (toOutAccount == null) {
                    System.out.println("입금 계좌가 존재하지 않음");
                    return;
                }
            }

            int transferAmount = autoTransfer.getAutoSendPrice();

            // 출금 계좌 잔액 확인
            if (fromAccount.getAccountBalance() < transferAmount) {
                System.out.println("자동이체 실패: 잔액 부족");
                autoTransfer.setReservationState("FAILED");
                autoTransferRepository.save(autoTransfer);
                return;
            }

            // 출금 계좌의 잔액 업데이트
            fromAccount.setAccountBalance(fromAccount.getAccountBalance() - transferAmount);
            accountRepository.save(fromAccount);

            if (toAccount != null) {
                // 입금 계좌가 내부 계좌인 경우, 잔액 업데이트
                toAccount.setAccountBalance(toAccount.getAccountBalance() + transferAmount);
                accountRepository.save(toAccount);

                // 로그 기록 (내부 계좌 이체)
                logRepository.save(LogEntity.builder()
                        .sendAccountNo(fromAccount.getAccountNumber())
                        .receiveAccountNo(toAccount.getAccountNumber())
                        .sendPrice(transferAmount)
                        .sendDate(new java.sql.Date(System.currentTimeMillis()))
                        .logState("SUCCESS")
                        .build());

                System.out.println("자동이체 성공: " + fromAccount.getAccountNumber() + " -> " + toAccount.getAccountNumber());
            } else if (toOutAccount != null) {
                // 외부 계좌로 입금 처리 로직 추가
                // 외부 계좌는 단순히 로그 기록만 하거나, 외부 API 호출 등 추가 로직이 필요할 수 있음

                // 로그 기록 (외부 계좌 이체)
                logRepository.save(LogEntity.builder()
                        .sendAccountNo(fromAccount.getAccountNumber())
                        .receiveAccountNo(toOutAccount.getOAccountNumber())
                        .sendPrice(transferAmount)
                        .sendDate(new java.sql.Date(System.currentTimeMillis()))
                        .logState("SUCCESS")
                        .build());

                System.out.println("외부 계좌로 자동이체 성공: " + fromAccount.getAccountNumber() + " -> " + toOutAccount.getOAccountNumber());
            }

            // 종료일에 이체가 완료된 경우 상태를 "COMPLETED"로 업데이트
            LocalDate today = LocalDate.now();
            if (autoTransfer.getEndDate().isEqual(today)) {
                autoTransfer.setReservationState("COMPLETED");
                System.out.println("자동이체 완료: 종료일(" + autoTransfer.getEndDate() + ")에 도달하여 상태를 COMPLETED로 변경");
            }

            // 자동이체 상태 저장
            autoTransferRepository.save(autoTransfer);

        } catch (Exception e) {
            e.printStackTrace();
            autoTransfer.setReservationState("ERROR");
            autoTransferRepository.save(autoTransfer);
        }
    }


    public boolean registerAutoTransfer(AutoTransferDTO autoTransferDTO) {
        try {
            // DTO의 필드가 잘 매핑되는지 로그 추가
            System.out.println("AccountNo: " + autoTransferDTO.getAccountNo());
            System.out.println("ReceiveAccountNo: " + autoTransferDTO.getReceiveAccountNo());
            System.out.println("AutoSendPrice: " + autoTransferDTO.getAutoSendPrice());
            System.out.println("은행명 (toBankName): " + autoTransferDTO.getToBankName());

            AutoTransferEntity autoTransfer = AutoTransferEntity.builder()
                    .accountNo(autoTransferDTO.getAccountNo())
                    .receiveAccountNo(autoTransferDTO.getReceiveAccountNo())
                    .autoSendPrice(autoTransferDTO.getAutoSendPrice())
                    .reservationDate(autoTransferDTO.getReservationDate() != null ?
                            autoTransferDTO.getReservationDate() : LocalDate.now())
                    .startDate(autoTransferDTO.getStartDate())
                    .endDate(autoTransferDTO.getEndDate())
                    .reservationState("ACTIVE")
                    .autoShow(autoTransferDTO.getAutoShow())
                    .transferDay(autoTransferDTO.getTransferDay())
                    .toBankName(autoTransferDTO.getToBankName()) // toBankName 저장
                    .build();

            autoTransferRepository.save(autoTransfer);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }



    public List<AutoTransferDTO> getAllAutoTransfers() {
        List<AutoTransferEntity> autoTransferEntities = autoTransferRepository.findAll();
        return autoTransferEntities.stream()
                .map(autoTransfer -> AutoTransferDTO.builder()
                        .autoTransNo(autoTransfer.getAutoTransNo())
                        .accountNo(autoTransfer.getAccountNo())
                        .receiveAccountNo(autoTransfer.getReceiveAccountNo())
                        .autoSendPrice(autoTransfer.getAutoSendPrice())
                        .reservationDate(autoTransfer.getReservationDate()) // reservationDate 포함
                        .startDate(autoTransfer.getStartDate())
                        .endDate(autoTransfer.getEndDate())
                        .transferDay(autoTransfer.getTransferDay())
                        .reservationState(autoTransfer.getReservationState())
                        .autoShow(autoTransfer.getAutoShow())
                        .deleteDate(autoTransfer.getDeleteDate())
                        .build())
                .collect(Collectors.toList());
    }


    public Integer getAccountNoByAccountNumber(int accountNumber) {
        // accountNumber로 Account 테이블에서 accountNo 조회
        AccountEntity accountEntity = accountRepository.findByAccountNumber(accountNumber);
        if (accountEntity != null) {
            System.out.println("조회된 출금 계좌의 AccountNo: " + accountEntity.getAccountNo());
            return accountEntity.getAccountNo();
        }
        System.out.println("해당 accountNumber에 대한 출금 계좌가 존재하지 않습니다.");
        return null; // 계좌가 없는 경우 null 반환
    }

    public Integer getReceiveAccountNoByAccountNumberAndBank(int receiveAccountNumber, String bankName) {
        System.out.println("조회하려는 입금 계좌번호: " + receiveAccountNumber + ", 은행 이름: " + bankName);

        // Account 테이블에서 조회
        AccountEntity accountEntity = accountRepository.findByAccountNumberAndBankName(receiveAccountNumber, bankName);
        if (accountEntity != null) {
            System.out.println("조회된 입금 계좌의 ReceiveAccountNo (Account): " + accountEntity.getAccountNo());
            return accountEntity.getAccountNo();
        }

        System.out.println("Account 테이블에 일치하는 입금 계좌가 없습니다.");
        return null;
    }

    public Integer getExternalAccountNoByAccountNumberAndBank(int receiveAccountNumber, String bankName) {
        // OutAccount 테이블에서 조회
        OutAccountEntity outAccountEntity = outAccountRepository.findByOAccountNumberAndOBankName(receiveAccountNumber, bankName);
        if (outAccountEntity != null) {
            System.out.println("조회된 입금 계좌의 ReceiveAccountNo (OutAccount): " + outAccountEntity.getOAccountNo());
            return outAccountEntity.getOAccountNo();
        }

        System.out.println("OutAccount 테이블에 일치하는 외부 계좌가 없습니다.");
        return null;
    }

    public List<AutoTransferEntity> getAllActiveAutoTransfers() {
        return autoTransferRepository.findAllActiveAutoTransfers();
    }

}
