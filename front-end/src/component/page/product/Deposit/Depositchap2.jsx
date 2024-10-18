import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../resource/css/account/autoTransfer/AutoTransferRegister2.css'; 
import ApiService from '../../../ApiService'; 

const Depositchap2 = () => {
  const [selectedAccount, setSelectedAccount] = useState(''); 
  const [availableBalance, setAvailableBalance] = useState(null); 
  const [depositPassword, setDepositPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [withdrawPassword, setWithdrawPassword] = useState(''); 
  const [isPasswordValid, setIsPasswordValid] = useState(null); 
  const [isWithdrawPasswordValid, setIsWithdrawPasswordValid] = useState(null); 
  const [accounts, setAccounts] = useState([]); 
  const [errorMessages, setErrorMessages] = useState({}); 
  const [transferDay, setTransferDay] = useState('1'); 
  const [depositAccountNumber, setDepositAccountNumber] = useState(''); 

  const navigate = useNavigate(); 

  // 세션에서 필요한 값 가져오기
  const productName = sessionStorage.getItem('selectedProductName');
  const repaymentMethod = sessionStorage.getItem('selectedRepaymentMethod');
  const depositAmount = sessionStorage.getItem('selectedDepositAmount'); 
  const depositPeriod = sessionStorage.getItem('selectedDepositPeriod'); 
  const depositNo = sessionStorage.getItem('selectedDepositNo'); 

  // 계좌 정보 가져오기
  useEffect(() => {
    ApiService.getUserAccounts()
      .then((response) => {
        setAccounts(response.data); 
      })
      .catch((error) => {
        setErrorMessages({ ...errorMessages, fetchError: '계좌 정보를 불러오는 중 오류가 발생했습니다.' });
      });
  }, []);

  // 적금 계좌번호 생성 함수
  const generateDepositAccountNumber = () => {
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString(); 
    return `${randomNumber.slice(0, 3)}-02-${randomNumber.slice(2, 7)}`; 
  };

  // 출금 가능 금액 확인
  const handleCheckBalance = () => {
    const selected = accounts.find(account => account.accountNumber === selectedAccount); 
    if (selected) {
      setAvailableBalance(selected.accountBalance); 
      setErrorMessages({ ...errorMessages, selectedAccount: '' });
    } else {
      setAvailableBalance(null);
      setErrorMessages({ ...errorMessages, selectedAccount: '계좌를 선택하세요.' });
    }
  };

  // 출금 계좌 비밀번호 확인 로직
  const handleWithdrawPasswordCheck = () => {
    const selected = accounts.find(account => account.accountNumber === selectedAccount); 
    if (!withdrawPassword) {
      setErrorMessages({ ...errorMessages, withdrawPassword: '출금 계좌 비밀번호를 입력하세요.' });
      setIsWithdrawPasswordValid(false);
      return;
    }

    if (selected && selected.accountPW === withdrawPassword) {  
      setIsWithdrawPasswordValid(true); 
      setErrorMessages({ ...errorMessages, withdrawPassword: '' });
    } else {
      setIsWithdrawPasswordValid(false); 
      setErrorMessages({ ...errorMessages, withdrawPassword: '비밀번호가 일치하지 않습니다.' });
    }
  };

  // 비밀번호 확인 (적금 계좌 비밀번호)
  const handleDepositPasswordCheck = () => {
    if (!depositPassword) {
      setErrorMessages({ ...errorMessages, password: '적금 계좌 비밀번호를 입력하세요.' });
      setIsPasswordValid(false);
      return;
    }
    if (depositPassword.length !== 4) { 
      setIsPasswordValid(false);
      setErrorMessages({ ...errorMessages, password: '적금 계좌 비밀번호는 4자리여야 합니다.' });
      return;
    }
    if (depositPassword !== confirmPassword) {  
      setIsPasswordValid(false); 
      setErrorMessages({ ...errorMessages, password: '적금 계좌 비밀번호가 일치하지 않습니다.' });
    } else {
      setIsPasswordValid(true); 
      setErrorMessages({ ...errorMessages, password: '' });
    }
  };

  // 폼 제출 처리
  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    const newErrorMessages = {};

    const selected = accounts.find(account => account.accountNumber === selectedAccount); 

    if (!selectedAccount) {
      newErrorMessages.selectedAccount = '계좌를 선택하세요.';
      hasError = true;
    }

    if (availableBalance === null) {
      newErrorMessages.availableBalance = '출금 가능 금액을 확인하세요.';
      hasError = true;
    }

    if (!isPasswordValid) {
      newErrorMessages.password = '적금 계좌 비밀번호를 확인해주세요.';
      hasError = true;
    }

    if (!isWithdrawPasswordValid) {
      newErrorMessages.withdrawPassword = '출금 계좌 비밀번호를 확인해주세요.';
      hasError = true;
    }

    setErrorMessages(newErrorMessages);

    if (!hasError && selected) {
      // 세션에 필요한 데이터 저장
      sessionStorage.setItem('selectedProductName', productName);
      sessionStorage.setItem('selectedRepaymentMethod', repaymentMethod); 
      sessionStorage.setItem('selectedDepositAmount', depositAmount); 
      sessionStorage.setItem('selectedDepositPeriod', depositPeriod); 
      sessionStorage.setItem('selectedTransferAccount', selectedAccount);
      sessionStorage.setItem('selectedTransferDay', transferDay);
      sessionStorage.setItem('selectedDepositNo', depositNo); 
      sessionStorage.setItem('selectedAccountNo', selected.accountNo); 
      sessionStorage.setItem('generatedDepositAccountNumber', depositAccountNumber); 
      sessionStorage.setItem('depositPassword', depositPassword); 

      // 다음 페이지로 이동 (DepositChap3)
      navigate('/DepositChap3');
    }
  };

  // 적금 계좌번호를 페이지 로드 시 한 번 생성
  useEffect(() => {
    const accountNumber = generateDepositAccountNumber();
    setDepositAccountNumber(accountNumber);
  }, []);

  return (
    <div className="auto-transfer-step2-container">
      <h2>자동이체 등록</h2>
      <form onSubmit={handleSubmit}>
        <table className="auto-transfer-step2-table">
          <tbody>
            {/* 적금 계좌번호 */}
            <tr>
              <th>적금계좌번호</th>
              <td>{depositAccountNumber}</td>
            </tr>
            {/* 적금 계좌 비밀번호 */}
            <tr>
              <th>적금계좌비밀번호</th>
              <td>
                <input
                  type="password"
                  value={depositPassword}
                  onChange={(e) => setDepositPassword(e.target.value)}
                  maxLength="4"
                  placeholder="적금 계좌 비밀번호 입력 (4자리)"
                />
              </td>
            </tr>
            {/* 적금 계좌 비밀번호 확인 */}
            <tr>
              <th>적금계좌비밀번호 확인</th>
              <td>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  maxLength="4"
                  placeholder="비밀번호 재입력"
                />
                <button type="button" onClick={handleDepositPasswordCheck} className="auto-transfer-step2-balance-button">
                  확인
                </button>
                {isPasswordValid ? (
                  <span className="auto-transfer-step2-valid-check">✔ 적금 계좌 비밀번호 확인 완료</span>
                ) : (
                  <span className="auto-transfer-step2-error-message">{errorMessages.password}</span>
                )}
              </td>
            </tr>
            {/* 출금계좌번호 */}
            <tr>
              <th>출금계좌번호</th>
              <td>
                <div className="auto-transfer-step2-balance-section">
                  <select
                    value={selectedAccount}
                    onChange={(e) => {
                      setSelectedAccount(e.target.value);
                      setAvailableBalance(null); 
                      setErrorMessages({ ...errorMessages, selectedAccount: '' });
                    }}
                  >
                    <option value="">계좌 선택</option>
                    {accounts.map(account => (
                      <option key={account.accountNo} value={account.accountNumber}>
                        {account.accountNumber}
                      </option>
                    ))} 
                  </select>
                  <button type="button" onClick={handleCheckBalance} className="auto-transfer-step2-balance-button">
                    출금가능금액
                  </button>
                  {availableBalance !== null ? (
                    <span className="auto-transfer-step2-balance-info">{availableBalance.toLocaleString()}원</span>
                  ) : (
                    <span className="auto-transfer-step2-error-message">{errorMessages.selectedAccount}</span>
                  )}
                </div>
              </td>
            </tr>
            {/* 출금계좌 비밀번호 */}
            <tr>
              <th>출금계좌 비밀번호</th>
              <td>
                <input
                  type="password"
                  value={withdrawPassword}
                  onChange={(e) => setWithdrawPassword(e.target.value)}
                  placeholder="출금 계좌 비밀번호 입력"
                />
                <button type="button" onClick={handleWithdrawPasswordCheck} className="auto-transfer-step2-balance-button">
                  확인
                </button>
                {isWithdrawPasswordValid ? (
                  <span className="auto-transfer-step2-valid-check">✔ 출금 계좌 비밀번호 확인 완료</span>
                ) : (
                  <span className="auto-transfer-step2-error-message">{errorMessages.withdrawPassword}</span>
                )}
              </td>
            </tr>

            {/* 자동 이체일 */}
            <tr>
              <th>자동 이체일</th>
              <td>
                <select
                  value={transferDay}
                  onChange={(e) => setTransferDay(e.target.value)}
                  className="transfer-day-select"
                >
                  <option value="1">1일</option>
                  <option value="10">10일</option>
                  <option value="20">20일</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit" className="auto-transfer-step2-submit-button">다음</button>
      </form>
    </div>
  );
};

export default Depositchap2;
