package com.urambank.uram.service;

import com.urambank.uram.dto.AccountDTO;
import com.urambank.uram.dto.AutoTransferDTO;
import com.urambank.uram.dto.LogDTO;
import com.urambank.uram.dto.OutAccountDTO;
import com.urambank.uram.entities.*;
import com.urambank.uram.repository.*;
import jakarta.persistence.EntityNotFoundException;
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
    public List<Map<String, Object>> getAllAccountWithDepositName(int userNo) {
        List<Object[]> results = accountRepository.findAllAccountWithDepositAndActive(userNo);
        List<Map<String, Object>> accountDataList = new ArrayList<>();

        for (Object[] result : results) {
            Map<String, Object> accountData = new HashMap<>();
            accountData.put("accountNo", result[0]);
            accountData.put("accountNumber", result[1]);
            accountData.put("accountBalance", result[2]);
            accountData.put("accountOpen", result[3]);
            accountData.put("accountClose", result[4]);
            accountData.put("depositNo", result[5]);  // Deposit 번호
            accountData.put("depositName", result[6]); // Deposit 이름

            accountDataList.add(accountData);
        }

        return accountDataList;
    }


    public String getUserNameByUserNo(int userNo) {
        User user = userRepository.findByUserNo(userNo);
        return user != null ? user.getName() : null;
    }

    public List<Map<String, Object>> listCategory(int depositCategory) {
        List<Object[]> results = accountRepository.findByDepositCategoryAndActive(depositCategory);
        List<Map<String, Object>> accountDataList = new ArrayList<>();

        for (Object[] result : results) {
            Map<String, Object> accountData = new HashMap<>();
            accountData.put("accountNo", result[0]);
            accountData.put("accountNumber", result[1]);
            accountData.put("accountBalance", result[2]);
            accountData.put("accountOpen", result[3]);
            accountData.put("accountClose", result[4]);
            accountData.put("depositNo", result[5]);  // Deposit 번호
            accountData.put("depositName", result[6]); // Deposit 이름 추가

            accountDataList.add(accountData);
        }

        return accountDataList;
    }


    public Map<String, Object> getAccountDetail(String accountNumber, int userNo) {
        AccountEntity accountEntity = accountRepository.findAccountDetailWithDeposit(accountNumber, "NORMAL", userNo);
        if (accountEntity != null) {
            Map<String, Object> accountData = new HashMap<>();
            accountData.put("accountNumber", accountEntity.getAccountNumber());
            accountData.put("accountBalance", accountEntity.getAccountBalance());
            accountData.put("accountLimit", accountEntity.getAccountLimit());
            accountData.put("depositName", accountEntity.getDeposit().getDepositName());  // deposit 테이블의 depositName 가져오기
            return accountData;
        } else {
            return null;
        }
    }

    // 계좌의 거래 내역 조회 (성공한 거래만)
    public List<LogDTO> getTransactionLogs(String accountNumber) {
        List<LogEntity> logEntities = logRepository.findByAccountNumberAndLogState(accountNumber);
        return logEntities.stream().map(log -> LogDTO.builder()
                        .logNo(log.getLogNo())
                        .sendAccountNumber(log.getSendAccountNumber())  // sendAccountNumber 필드 이름 변경 반영
                        .receiveAccountNumber(log.getReceiveAccountNumber())  // receiveAccountNumber 필드 이름 변경 반영
                        .sendPrice(log.getSendPrice())
                        .sendDate(log.getSendDate())
                        .logState(log.getLogState())
                        .build())
                .collect(Collectors.toList());
    }


    // 계좌 비밀번호 확인
    public boolean checkAccountPassword(int userNo, String accountNumber, String inputPassword) {  // accountNumber와 accountPW를 String으로 처리
        AccountEntity account = accountRepository.findAccountDetailWithDeposit(accountNumber, "NORMAL", userNo);  // deposit으로 변경
        if (account != null && account.getAccountPW() != null) {  // accountPW를 String으로 처리
            return account.getAccountPW().equals(inputPassword);  // 비밀번호 비교
        }
        return false;
    }


    // 계좌 비밀번호 변경
    public boolean changeAccountPassword(int userNo, String accountNumber, String newPassword) {  // accountNumber와 accountPW를 String으로 처리
        AccountEntity account = accountRepository.findAccountDetailWithDeposit(accountNumber, "NORMAL", userNo);  // deposit으로 변경
        if (account != null) {
            account.setAccountPW(newPassword);  // 새 비밀번호 설정 (String으로 변경)
            accountRepository.save(account);  // 변경 사항 저장
            return true;
        }
        return false;
    }


    // 계좌 해지
    public boolean terminateAccount(int userNo, String accountNumber) {  // accountNumber를 String으로 변경
        AccountEntity account = accountRepository.findAccountDetailWithDeposit(accountNumber, "NORMAL", userNo);  // deposit으로 변경
        if (account != null) {
            account.setAccountState("TERMINATION"); // 계좌 상태를 'TERMINATION'으로 변경
            accountRepository.save(account); // 변경 사항 저장
            return true;
        }
        return false;
    }


    // 이체한도 변경 로직
    public boolean changeTransferLimits(int userNo, String accountNumber, int newDailyLimit) {  // accountNumber와 newDailyLimit 처리
        AccountEntity account = accountRepository.findAccountDetailWithDeposit(accountNumber, "NORMAL", userNo);  // deposit으로 변경
        if (account != null) {
            account.setAccountLimit(newDailyLimit);   // 1일 이체한도 변경
            accountRepository.save(account);        // 변경 사항 저장
            return true;
        }
        return false;
    }

    @Transactional
    public boolean transferAccount(int userNo, String fromAccountNumber, String toAccountNumber, int transferAmount, String password, String toBankName) {
        String failureReason = null;

        try {
            // 출금 계좌 유효성 확인
            AccountEntity fromAccount = accountRepository.findAccountDetailWithDeposit(fromAccountNumber, "NORMAL", userNo);  // accountNumber를 String으로 처리
            if (fromAccount == null) {
                failureReason = "출금 계좌가 존재하지 않음: " + fromAccountNumber;
                System.out.println(failureReason);
                return false;
            }

            // 비밀번호 확인
            if (!fromAccount.getAccountPW().equals(password)) {  // password를 String으로 처리
                failureReason = "비밀번호 불일치: " + password;
                System.out.println(failureReason);
                return false;
            }

            // 출금 가능 잔액 확인
            if (fromAccount.getAccountBalance() < transferAmount) {
                failureReason = "잔액 부족: " + fromAccount.getAccountBalance();
                System.out.println(failureReason);
                return false;
            }

            // 1회 이체 한도 확인
            if (transferAmount > fromAccount.getAccountLimit()) {
                failureReason = "1회 이체 한도 초과: " + fromAccount.getAccountLimit();
                System.out.println(failureReason);
                return false;
            }

            // 외부 계좌 확인 및 처리
            if (toBankName.equals("우람은행")) {
                AccountEntity toAccount = accountRepository.findAccount(toAccountNumber, "NORMAL");
                if (toAccount == null) {
                    failureReason = "입금 계좌가 존재하지 않음: " + toAccountNumber;
                    System.out.println(failureReason);
                    return false;
                }

                // 출금 처리
                fromAccount.setAccountBalance(fromAccount.getAccountBalance() - transferAmount);

                // 입금 처리
                toAccount.setAccountBalance(toAccount.getAccountBalance() + transferAmount);

                // DB에 저장
                accountRepository.save(fromAccount);
                accountRepository.save(toAccount);
            } else {
                OutAccountEntity outAccount = outAccountRepository.findByOAccountNumberAndOBankNameAndOAccountState(toAccountNumber, toBankName, "NORMAL");
                if (outAccount == null) {
                    failureReason = "외부 입금 계좌가 존재하지 않음 또는 상태가 정상 아님: " + toAccountNumber;
                    System.out.println(failureReason);
                    return false;
                }

                // 출금 처리만 진행
                fromAccount.setAccountBalance(fromAccount.getAccountBalance() - transferAmount);
                accountRepository.save(fromAccount);
            }

            // 이체 로그 기록 (성공)
            logRepository.save(LogEntity.builder()
                    .sendAccountNumber(fromAccountNumber)
                    .receiveAccountNumber(toAccountNumber)
                    .sendPrice(transferAmount)
                    .sendDate(new java.sql.Date(System.currentTimeMillis()))
                    .logState("SUCCESS")
                    .build());

            return true;

        } catch (Exception e) {
            e.printStackTrace();
            failureReason = "서버 오류로 인한 이체 실패";
            return false;
        } finally {
            // 실패한 경우에만 로그 기록
            if (failureReason != null) {
                logRepository.save(LogEntity.builder()
                        .sendAccountNumber(fromAccountNumber)
                        .receiveAccountNumber(toAccountNumber)
                        .sendPrice(transferAmount)
                        .sendDate(new java.sql.Date(System.currentTimeMillis()))
                        .logState("FAIL")
                        .build());
            }
        }
    }


    public String getRecipientName(String toAccountNumber, String toBankName) {  // toAccountNumber를 String으로 변경
        if ("우람은행".equals(toBankName)) { // 내부 계좌의 경우
            AccountEntity account = accountRepository.findByAccountNumberAndBankName(toAccountNumber, toBankName);
            if (account != null) {
                // 계좌의 userNo를 이용해 User 테이블에서 사용자 조회
                User user = userRepository.findByUserNo(account.getUserNo());
                return user != null ? user.getName() : "사용자 이름 없음";
            }
        } else { // 외부 계좌의 경우
            OutAccountEntity outAccount = outAccountRepository.findByOAccountNumberAndOBankNameAndOAccountState(toAccountNumber, toBankName, "NORMAL");
            return outAccount != null ? outAccount.getOUserName() : "외부 계좌 사용자 이름 없음";
        }
        return null;
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

    public boolean validateAccountNumberWithBank(String accountNumber, String bankName) {  // accountNumber를 String으로 변경
        // 같은 은행인 경우 Account 테이블에서 유효성 확인
        if ("우람은행".equals(bankName)) { // 우람은행(자사은행)의 계좌일 경우
            AccountEntity account = accountRepository.findAccount(accountNumber, "NORMAL");  // String으로 변경된 accountNumber 처리
            return account != null; // 계좌가 존재하면 true, 아니면 false 반환
        }
        // 외부 은행일 경우 OutAccount 테이블에서 확인
        OutAccountEntity outAccount = outAccountRepository.findByOAccountNumberAndOBankNameAndOAccountState(accountNumber, bankName, "NORMAL");  // String으로 변경된 oAccountNumber 처리
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
                        .sendAccountNumber(fromAccount.getAccountNumber())
                        .receiveAccountNumber(toAccount.getAccountNumber())
                        .sendPrice(transferAmount)
                        .sendDate(new java.sql.Date(System.currentTimeMillis()))
                        .logState("SUCCESS")
                        .build());

                System.out.println("자동이체 성공: " + fromAccount.getAccountNumber() + " -> " + toAccount.getAccountNumber());
            } else if (toOutAccount != null) {
                // 외부 계좌로 입금 처리 로직 추가
                logRepository.save(LogEntity.builder()
                        .sendAccountNumber(fromAccount.getAccountNumber())
                        .receiveAccountNumber(toOutAccount.getOAccountNumber())
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

    public boolean registerAutoTransfer(AutoTransferDTO autoTransferDTO) throws Exception {
        try {
            // 출금 계좌 조회
            AccountEntity fromAccount = accountRepository.findByAccountNumber(autoTransferDTO.getFromAccountDTO().getAccountNumber())
                    .orElseThrow(() -> new Exception("출금 계좌를 찾을 수 없습니다."));

            // 입금 계좌 조회
            AccountEntity toAccount = null;
            Integer receiveAccountNo = null; // 입금 계좌 번호
            String toBankName = autoTransferDTO.getToBankName();  // 은행명 설정

            // 내부 계좌인 경우 처리
            if (autoTransferDTO.getToAccountDTO() != null && autoTransferDTO.getToAccountDTO().getAccountNumber() != null) {
                toAccount = accountRepository.findByAccountNumber(autoTransferDTO.getToAccountDTO().getAccountNumber())
                        .orElseThrow(() -> new Exception("입금 계좌를 찾을 수 없습니다."));
                receiveAccountNo = toAccount.getAccountNo(); // 내부 계좌일 때 계좌 번호 설정
                toBankName = "우람은행";  // 내부 계좌일 때 은행명 설정
            }
            // 외부 계좌인 경우 처리
            else if (autoTransferDTO.getOutAccountDTO() != null && autoTransferDTO.getOutAccountDTO().getOAccountNumber() != null) {
                // 외부 계좌 처리 로직
                OutAccountEntity outAccount = outAccountRepository.findByOAccountNumberAndOBankName(
                        autoTransferDTO.getOutAccountDTO().getOAccountNumber(),
                        autoTransferDTO.getOutAccountDTO().getOBankName());

                if (outAccount == null) {
                    throw new Exception("외부 입금 계좌를 찾을 수 없습니다.");
                }

                // 여기서부터 외부 계좌 처리를 진행
                receiveAccountNo = outAccount.getOAccountNo();  // 외부 계좌의 경우 계좌 번호 설정
                toBankName = outAccount.getOBankName();  // 외부 계좌 은행명 설정
            }

            // 자동이체 엔티티 생성 및 저장
            AutoTransferEntity autoTransferEntity = AutoTransferEntity.builder()
                    .accountNo(fromAccount.getAccountNo())
                    .receiveAccountNo(receiveAccountNo)  // 내부 또는 외부 계좌의 경우 처리
                    .autoSendPrice(autoTransferDTO.getAutoSendPrice())
                    .reservationDate(LocalDate.now())  // 예약일
                    .startDate(autoTransferDTO.getStartDate())
                    .endDate(autoTransferDTO.getEndDate())
                    .transferDay(autoTransferDTO.getTransferDay())
                    .toBankName(toBankName)  // 은행명 설정
                    .reservationState("ACTIVE")
                    .build();

            // 자동이체 정보 저장
            autoTransferRepository.save(autoTransferEntity);

            // 성공 시 true 반환
            return true;
        } catch (Exception e) {
            e.printStackTrace();

            // 실패 시 false 반환
            return false;
        }
    }




    public List<Map<String, Object>> getAllAutoTransfers() {
        // 'ACTIVE' 상태의 자동이체만 조회
        List<AutoTransferEntity> autoTransferEntities = autoTransferRepository.findAllActiveAutoTransfers();

        return autoTransferEntities.stream()
                .map(autoTransfer -> {
                    // 출금 계좌의 accountNo를 이용해 accountNumber 조회
                    String fromAccountNumber = accountRepository.findAccountNumberByAccountNo(autoTransfer.getAccountNo());

                    // receiveAccountNo와 bankName을 이용해 입금 계좌의 accountNumber 조회
                    String receiveAccountNumber = accountRepository.findAccountNumberByAccountNoAndBankName(
                            autoTransfer.getReceiveAccountNo(), autoTransfer.getToBankName());

                    // 입금 계좌가 Account 테이블에 없을 경우, OutAccount 테이블에서 조회
                    if (receiveAccountNumber == null) {
                        receiveAccountNumber = outAccountRepository.findOAccountNumberByOAccountNoAndOBankName(
                                autoTransfer.getReceiveAccountNo(), autoTransfer.getToBankName());
                    }

                    // DTO와 함께 추가 정보인 계좌 번호들을 프론트엔드로 전달할 객체 생성
                    Map<String, Object> responseMap = new HashMap<>();
                    responseMap.put("autoTransfer", AutoTransferDTO.builder()
                            .autoTransNo(autoTransfer.getAutoTransNo())
                            .accountNo(autoTransfer.getAccountNo())
                            .receiveAccountNo(autoTransfer.getReceiveAccountNo())
                            .autoSendPrice(autoTransfer.getAutoSendPrice())
                            .reservationDate(autoTransfer.getReservationDate())
                            .startDate(autoTransfer.getStartDate())
                            .endDate(autoTransfer.getEndDate())
                            .transferDay(autoTransfer.getTransferDay())
                            .reservationState(autoTransfer.getReservationState())
                            .autoShow(autoTransfer.getAutoShow())
                            .deleteDate(autoTransfer.getDeleteDate())
                            .build());
                    responseMap.put("fromAccountNumber", fromAccountNumber);
                    responseMap.put("receiveAccountNumber", receiveAccountNumber);

                    return responseMap;
                })
                .collect(Collectors.toList());
    }


    // accountNumber로 Account 테이블에서 accountNo 조회
    public Integer getAccountNoByAccountNumber(String accountNumber) {  // accountNumber를 String으로 처리
        AccountEntity accountEntity = accountRepository.findByAccountNumber(accountNumber)
                .orElse(null);  // Optional 처리, 없으면 null 반환

        if (accountEntity != null) {
            System.out.println("조회된 출금 계좌의 AccountNo: " + accountEntity.getAccountNo());
            return accountEntity.getAccountNo();
        }

        System.out.println("해당 accountNumber에 대한 출금 계좌가 존재하지 않습니다.");
        return null; // 계좌가 없는 경우 null 반환
    }


    // receiveAccountNumber와 bankName으로 Account 테이블에서 receiveAccountNo 조회
    public Integer getReceiveAccountNoByAccountNumberAndBank(String receiveAccountNumber, String bankName) {  // receiveAccountNumber를 String으로 처리
        System.out.println("조회하려는 입금 계좌번호: " + receiveAccountNumber + ", 은행 이름: " + bankName);

        AccountEntity accountEntity = accountRepository.findByAccountNumberAndBankName(receiveAccountNumber, bankName);  // String으로 처리
        if (accountEntity != null) {
            System.out.println("조회된 입금 계좌의 ReceiveAccountNo (Account): " + accountEntity.getAccountNo());
            return accountEntity.getAccountNo();
        }

        System.out.println("Account 테이블에 일치하는 입금 계좌가 없습니다.");
        return null;
    }

    public Integer getExternalAccountNoByAccountNumberAndBank(String receiveAccountNumber, String bankName) {
        System.out.println("외부 계좌 조회 시도: receiveAccountNumber = " + receiveAccountNumber + ", bankName = " + bankName);

        OutAccountEntity outAccountEntity = outAccountRepository.findByOAccountNumberAndOBankName(receiveAccountNumber, bankName);
        if (outAccountEntity != null) {
            System.out.println("조회된 입금 계좌의 ReceiveAccountNo (OutAccount): " + outAccountEntity.getOAccountNo());
            return outAccountEntity.getOAccountNo();
        }

        System.out.println("OutAccount 테이블에 일치하는 외부 계좌가 없습니다.");
        return null;
    }


    // 모든 활성화된 자동이체 목록 조회
    public List<AutoTransferEntity> getAllActiveAutoTransfers() {
        return autoTransferRepository.findAllActiveAutoTransfers();
    }

    public boolean updateAutoTransfer(AutoTransferDTO autoTransferDTO) throws Exception {
        try {
            // 기존 자동이체 정보 조회
            AutoTransferEntity existingTransfer = autoTransferRepository.findById(autoTransferDTO.getAutoTransNo())
                    .orElseThrow(() -> new Exception("자동이체 정보를 찾을 수 없습니다."));

            // 출금 계좌 조회
            AccountEntity fromAccount = accountRepository.findByAccountNumber(autoTransferDTO.getFromAccountDTO().getAccountNumber())
                    .orElseThrow(() -> new Exception("출금 계좌를 찾을 수 없습니다."));

            // 입금 계좌 조회
            AccountEntity toAccount = null;
            String toBankName = autoTransferDTO.getToBankName();  // 은행명 설정

            // 내부 계좌인 경우 처리
            if (autoTransferDTO.getToAccountDTO() != null && autoTransferDTO.getToAccountDTO().getAccountNumber() != null) {
                toAccount = accountRepository.findByAccountNumber(autoTransferDTO.getToAccountDTO().getAccountNumber())
                        .orElseThrow(() -> new Exception("입금 계좌를 찾을 수 없습니다."));
                toBankName = "우람은행";  // 내부 계좌일 때 은행명 설정
            }

            // 기존 자동이체 정보 업데이트
            existingTransfer.setAccountNo(fromAccount.getAccountNo());
            existingTransfer.setReceiveAccountNo(toAccount != null ? toAccount.getAccountNo() : null);  // 내부 계좌의 경우 처리
            existingTransfer.setAutoSendPrice(autoTransferDTO.getAutoSendPrice());
            existingTransfer.setStartDate(autoTransferDTO.getStartDate());
            existingTransfer.setEndDate(autoTransferDTO.getEndDate());
            existingTransfer.setTransferDay(autoTransferDTO.getTransferDay());
            existingTransfer.setToBankName(toBankName);  // 은행명 설정
            existingTransfer.setReservationState("ACTIVE");

            // 자동이체 정보 저장
            autoTransferRepository.save(existingTransfer);

            // 성공 시 true 반환
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            // 실패 시 false 반환
            return false;
        }
    }

    // 자동이체 상태 업데이트 메서드 (해지 처리)
    public void cancelAutoTransfer(int autoTransNo) {
        // 해당 자동이체 번호(autoTransNo)를 조회
        AutoTransferEntity autoTransfer = autoTransferRepository.findById(autoTransNo)
                .orElseThrow(() -> new EntityNotFoundException("자동이체를 찾을 수 없습니다."));

        // 예약 상태를 'CANCELED'로 업데이트
        autoTransfer.setReservationState("CANCELED");

        // 업데이트된 정보를 저장
        autoTransferRepository.save(autoTransfer);
    }

}
