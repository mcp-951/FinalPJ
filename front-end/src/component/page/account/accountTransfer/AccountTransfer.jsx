import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../../../resource/css/account/accountTransfer/AccountTransfer.css'; // 이체 페이지 전용 CSS

const AccountTransfer = () => {
  const location = useLocation();
  const { selectedAccount: initialAccount } = location.state || {};

  const [selectedAccount, setSelectedAccount] = useState(initialAccount || ''); // 선택된 계좌
  const [availableBalance, setAvailableBalance] = useState(null); // 출금 가능 금액
  const [transferAmount, setTransferAmount] = useState(''); // 이체 금액
  const [password, setPassword] = useState(''); // 비밀번호 입력
  const [isPasswordValid, setIsPasswordValid] = useState(null); // 비밀번호 유효성 체크
  const [selectedBank, setSelectedBank] = useState(''); // 선택된 은행
  const [targetAccountNumber, setTargetAccountNumber] = useState(''); // 입금 계좌번호
  const [isAccountValid, setIsAccountValid] = useState(null); // 입금 계좌번호 유효성 체크
  const [transferLimit, setTransferLimit] = useState({ dailyLimit: null, onceLimit: null }); // 이체 한도
  const [errorMessages, setErrorMessages] = useState({}); // 각 필드에 대한 에러 메시지 상태
  const [accounts, setAccounts] = useState([]); // 사용자의 계좌 목록
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 사용

  // 초기 계좌 목록 로드 및 이체 한도 정보 로드
  useEffect(() => {
    fetchAccounts();
    if (initialAccount) {
      setSelectedAccount(initialAccount);
      fetchTransferLimits(initialAccount); // 이체 한도 정보를 가져옴
    }
  }, [initialAccount]);

  // 백엔드에서 계좌 목록 가져오기
  const fetchAccounts = async () => {
    try {
      const response = await fetch('http://localhost:8081/uram/account'); // 계좌 목록 API 호출
      const data = await response.json();
      setAccounts(data); // 사용자의 계좌 목록 설정
    } catch (error) {
      console.error('계좌 목록 불러오기 실패:', error);
    }
  };

  // 이체 한도 정보를 받아오는 함수
  const fetchTransferLimits = async (accountNumber) => {
    try {
      const response = await fetch(`http://localhost:8081/uram/account/${accountNumber}`);
      const data = await response.json();
      setTransferLimit({
        dailyLimit: data.accountMax, // 1일 이체 한도
        onceLimit: data.accountLimit   // 1회 이체 한도
      });
    } catch (error) {
      console.error('이체 한도 정보를 불러오는 중 오류 발생:', error);
    }
  };

  // 출금 가능 금액 확인
  const handleCheckBalance = () => {
    const account = accounts.find(acc => acc.accountNumber === parseInt(selectedAccount));
    if (account) {
      setAvailableBalance(account.accountBalance); // 계좌의 잔액을 설정
      setErrorMessages({ ...errorMessages, selectedAccount: '' });
    } else {
      setAvailableBalance(null);
      setErrorMessages({ ...errorMessages, selectedAccount: '계좌를 선택하세요.' });
    }
  };

  // 금액 클릭 시 설정
  const handleAmountClick = (amount) => {
    setTransferAmount(amount);
    setErrorMessages({ ...errorMessages, transferAmount: '' });
  };

  // 비밀번호 확인 로직 (API 호출)
  const handlePasswordCheck = async () => {
    if (!password) {
      setErrorMessages({ ...errorMessages, password: '비밀번호를 입력하세요.' });
      setIsPasswordValid(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/uram/account/${selectedAccount}/check-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: parseInt(password, 10) }), // 비밀번호는 숫자형으로 변환
      });

      if (response.ok) {
        setIsPasswordValid(true);
        setErrorMessages({ ...errorMessages, password: '' });
      } else {
        setIsPasswordValid(false);
        setErrorMessages({ ...errorMessages, password: '비밀번호가 일치하지 않습니다.' });
      }
    } catch (error) {
      console.error('비밀번호 확인 실패:', error);
      setIsPasswordValid(false);
    }
  };

  // 입금 계좌 확인 로직 (API 호출)
  const handleAccountCheck = async () => {
    if (!selectedBank || !targetAccountNumber) {
      setErrorMessages({ ...errorMessages, targetAccountNumber: '은행명과 입금 계좌번호를 입력하세요.' });
      return;
    }

    try {
      // 계좌 유효성 확인 API 호출 (은행명과 계좌번호 함께 전달)
      const response = await fetch(`http://localhost:8081/uram/account/validate?accountNumber=${targetAccountNumber}&bankName=${selectedBank}`);
      const isValid = await response.json();

      if (isValid) {
        setIsAccountValid(true);
        setErrorMessages({ ...errorMessages, targetAccountNumber: '' });
      } else {
        setIsAccountValid(false);
        setErrorMessages({ ...errorMessages, targetAccountNumber: '유효하지 않은 계좌입니다.' });
      }
    } catch (error) {
      console.error('계좌 확인 실패:', error);
      setIsAccountValid(false);
      setErrorMessages({ ...errorMessages, targetAccountNumber: '계좌 확인 중 오류가 발생했습니다.' });
    }
  };

  // 폼 제출 처리
  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    const newErrorMessages = {};

    if (!selectedAccount) {
      newErrorMessages.selectedAccount = '계좌를 선택하세요.';
      hasError = true;
    }

    if (availableBalance === null) {
      newErrorMessages.availableBalance = '출금 가능 금액을 확인하세요.';
      hasError = true;
    }

    if (!selectedBank) {
      newErrorMessages.selectedBank = '입금 은행을 선택하세요.';
      hasError = true;
    }

    if (!targetAccountNumber) {
      newErrorMessages.targetAccountNumber = '입금 계좌번호를 입력하세요.';
      hasError = true;
    } else if (!isAccountValid) {
      newErrorMessages.targetAccountNumber = '유효하지 않은 입금 계좌번호입니다.';
      hasError = true;
    }

    if (selectedAccount === targetAccountNumber) {
      newErrorMessages.targetAccountNumber = '출금 계좌와 입금 계좌가 동일할 수 없습니다.';
      hasError = true;
    }

    if (!transferAmount) {
      newErrorMessages.transferAmount = '이체 금액을 입력하세요.';
      hasError = true;
    } else if (parseInt(transferAmount) > availableBalance) {
      newErrorMessages.transferAmount = '이체 금액이 잔액보다 큽니다.';
      hasError = true;
    }

    if (!isPasswordValid) {
      newErrorMessages.password = '비밀번호를 확인해주세요.';
      hasError = true;
    }

    setErrorMessages(newErrorMessages);

    if (!hasError) {
      navigate('/account/transfer-confirmation', {
        state: {
          selectedAccount,
          selectedBank,
          targetAccountNumber,
          transferAmount,
          availableBalance,
          password,
        },
      });
    }
  };

  return (
    <div className="transfer-container">
      <h2>계좌이체</h2>
      <form onSubmit={handleSubmit}>
        <table className="transfer-table">
          <tbody>
            <tr>
              <th>출금계좌번호</th>
              <td>
                <div className="account-balance-section">
                  <select
                    value={selectedAccount}
                    onChange={(e) => {
                      setSelectedAccount(e.target.value);
                      setAvailableBalance(null);
                      setErrorMessages({ ...errorMessages, selectedAccount: '' });
                      fetchTransferLimits(e.target.value); // 선택된 계좌의 이체 한도 가져오기
                    }}
                  >
                    <option value="">계좌 선택</option>
                    {accounts.map((account) => (
                      <option key={account.accountNumber} value={account.accountNumber}>
                        {account.accountNumber}
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={handleCheckBalance} className="balance-button">
                    출금가능금액
                  </button>
                  {availableBalance !== null ? (
                    <span className="balance-info">{availableBalance.toLocaleString()}원</span>
                  ) : (
                    <span className="error-message">{errorMessages.selectedAccount}</span>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <th>입금기관</th>
              <td>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                >
                  <option value="">은행명 선택</option>
                  <option value="동명은행">동명은행</option>
                  <option value="우람은행">우람은행</option>
                </select>
                {errorMessages.selectedBank && <span className="error-message">{errorMessages.selectedBank}</span>}
              </td>
            </tr>
            <tr>
              <th>입금계좌번호</th>
              <td>
                <input
                  type="text"
                  value={targetAccountNumber}
                  onChange={(e) => {
                    setTargetAccountNumber(e.target.value);
                    setErrorMessages({ ...errorMessages, targetAccountNumber: '' });
                  }}
                  placeholder="입금 계좌번호 입력"
                />
                <button type="button" onClick={handleAccountCheck}>계좌 확인</button>
                {isAccountValid === true && <span className="valid-check">✔ 계좌 유효</span>}
                {errorMessages.targetAccountNumber && <span className="error-message">{errorMessages.targetAccountNumber}</span>}
              </td>
            </tr>
            <tr>
              <th>이체금액</th>
              <td>
                <div className="amount-buttons">
                  {[1000000, 500000, 100000, 50000, 10000].map((amount) => (
                    <button
                      type="button"
                      key={amount}
                      onClick={() => handleAmountClick(amount)}
                    >
                      {amount.toLocaleString()}원
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="금액 입력"
                />
                {errorMessages.transferAmount && <span className="error-message">{errorMessages.transferAmount}</span>}
              </td>
            </tr>
            <tr>
              <th>비밀번호 확인</th>
              <td>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                />
                <button type="button" onClick={handlePasswordCheck}>
                  확인
                </button>
                {isPasswordValid === true && <span className="valid-check">✔ 비밀번호 확인</span>}
                {errorMessages.password && <span className="error-message">{errorMessages.password}</span>}
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit" className="submit-button">확인</button>
      </form>
      {errorMessages.general && <div className="error-message">{errorMessages.general}</div>}
    </div>
  );
};

export default AccountTransfer;
