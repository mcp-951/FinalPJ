import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../resource/css/account/autoTransfer/AutoTransferRegister2.css'; 
import ApiService from '../../../ApiService'; 

const Loanchap2 = () => {
  const [selectedAccount, setSelectedAccount] = useState(''); 
  const [availableBalance, setAvailableBalance] = useState(null); 
  const [password, setPassword] = useState(''); 
  const [isPasswordValid, setIsPasswordValid] = useState(null); 
  const [accounts, setAccounts] = useState([]); 
  const [errorMessages, setErrorMessages] = useState({}); 
  const [transferDay, setTransferDay] = useState('1'); 
  const [interestRate, setInterestRate] = useState(''); 

  const navigate = useNavigate(); 

  // 세션에서 필요한 값 가져오기 (상품명, 상환방식, 대출금액, 대출기간, loanNo)
  const productName = sessionStorage.getItem('selectedProductName');
  const repaymentMethod = sessionStorage.getItem('selectedRepaymentMethod');
  const loanAmount = sessionStorage.getItem('selectedLoanAmount');
  const loanPeriod = sessionStorage.getItem('selectedLoanPeriod');
  const loanNo = sessionStorage.getItem('selectedLoanNo'); // 추가된 loanNo

  // 계좌 정보 가져오기
  useEffect(() => {
    ApiService.getUserAccounts()
      .then((response) => {
        console.log('API 응답 데이터:', response.data); 
        setAccounts(response.data); 
      })
      .catch((error) => {
        console.error('계좌 정보를 불러오는 중 오류 발생:', error); 
        setErrorMessages({ ...errorMessages, fetchError: '계좌 정보를 불러오는 중 오류가 발생했습니다.' });
      });
  }, []);

  // 출금 가능 금액 확인
  const handleCheckBalance = () => {
    const selected = accounts.find(account => account.accountNumber === selectedAccount); 
    if (selected) {
      console.log('선택된 계좌의 잔액:', selected.accountBalance); 
      setAvailableBalance(selected.accountBalance); 
      setErrorMessages({ ...errorMessages, selectedAccount: '' });
    } else {
      console.error('계좌를 선택하세요.'); 
      setAvailableBalance(null);
      setErrorMessages({ ...errorMessages, selectedAccount: '계좌를 선택하세요.' });
    }
  };

  // 비밀번호 확인
  const handlePasswordCheck = () => {
    const selected = accounts.find(account => account.accountNumber === selectedAccount); 
    if (!password) {
      setErrorMessages({ ...errorMessages, password: '비밀번호를 입력하세요.' });
      setIsPasswordValid(false);
      return;
    }

    if (selected && selected.accountPW === password) {  
      setIsPasswordValid(true); 
      setErrorMessages({ ...errorMessages, password: '' });
    } else {
      setIsPasswordValid(false); 
      setErrorMessages({ ...errorMessages, password: '비밀번호가 일치하지 않습니다.' });
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
      newErrorMessages.password = '비밀번호를 확인해주세요.';
      hasError = true;
    }

    setErrorMessages(newErrorMessages);

    if (!hasError && selected) {
      // 세션에 필요한 데이터 저장
      sessionStorage.setItem('selectedProductName', productName);
      sessionStorage.setItem('selectedRepaymentMethod', repaymentMethod);
      sessionStorage.setItem('selectedLoanAmount', loanAmount);
      sessionStorage.setItem('selectedLoanPeriod', loanPeriod);
      sessionStorage.setItem('selectedTransferAccount', selectedAccount);
      sessionStorage.setItem('selectedTransferDay', transferDay);
      sessionStorage.setItem('selectedLoanNo', loanNo); // loanNo 추가
      sessionStorage.setItem('selectedAccountNo', selected.accountNo); // accountNo 저장

      // 다음 페이지로 이동 (Loanchap3)
      navigate('/Loanchap3');
    }
  };

  return (
    <div className="auto-transfer-step2-container">
      <h2>자동이체 등록</h2>
      <form onSubmit={handleSubmit}>
        <table className="auto-transfer-step2-table">
          <tbody>
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

            {/* 비밀번호 확인 */}
            <tr>
              <th>비밀번호 확인</th>
              <td>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                />
                <button type="button" onClick={handlePasswordCheck} className="auto-transfer-step2-balance-button">
                  확인
                </button>
                {isPasswordValid ? (
                  <span className="auto-transfer-step2-valid-check">✔ 비밀번호 확인 완료</span>
                ) : (
                  <span className="auto-transfer-step2-error-message">{errorMessages.password}</span>
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

export default Loanchap2;
