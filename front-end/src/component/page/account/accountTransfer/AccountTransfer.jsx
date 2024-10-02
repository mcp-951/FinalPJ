import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../../../resource/css/account/accountTransfer/AccountTransfer.css'; // 이체 페이지 전용 CSS

const AccountTransfer = () => {
  const location = useLocation();
  const { selectedAccount: initialAccount } = location.state || {}; // 이전 페이지에서 전달받은 계좌번호

  const [selectedAccount, setSelectedAccount] = useState(initialAccount || ''); // 선택된 계좌
  const [availableBalance, setAvailableBalance] = useState(null); // 출금 가능 금액
  const [transferAmount, setTransferAmount] = useState('');
  const [password, setPassword] = useState(''); // 비밀번호 입력 필드
  const [isPasswordValid, setIsPasswordValid] = useState(null); // 비밀번호 유효성 체크
  const [selectedBank, setSelectedBank] = useState('');
  const [targetAccountNumber, setTargetAccountNumber] = useState('');
  const [isAccountValid, setIsAccountValid] = useState(null); // 입금 계좌번호 유효성 체크
  const [errorMessages, setErrorMessages] = useState({}); // 각 필드에 대한 에러 메시지 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 사용

  // 계좌 데이터 예시 (출금 가능 금액 포함)
  const accountData = {
    '123-456-789': 100000,
    '234-567-890': 200000,
  };

  // 유효한 입금 계좌 데이터 (실제 은행 API와 연동 시 이 부분은 API 호출로 대체 가능)
  const validTargetAccounts = ['987-654-321', '876-543-210', '111'];

  // 초기 계좌 설정
  useEffect(() => {
    if (initialAccount) {
      setSelectedAccount(initialAccount);
    }
  }, [initialAccount]);

  // 출금 가능 금액 확인
  const handleCheckBalance = () => {
    if (selectedAccount && accountData[selectedAccount]) {
      setAvailableBalance(accountData[selectedAccount]);
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

  // 비밀번호 확인 로직
  const handlePasswordCheck = () => {
    if (!password) {
      setErrorMessages({ ...errorMessages, password: '비밀번호를 입력하세요.' });
      setIsPasswordValid(false);
      return;
    }
    setIsPasswordValid(true); // 비밀번호가 입력된 경우 유효성 통과
    setErrorMessages({ ...errorMessages, password: '' });
  };

  // 입금 계좌 확인 로직
  const handleAccountCheck = () => {
    if (validTargetAccounts.includes(targetAccountNumber)) {
      setIsAccountValid(true);
      setErrorMessages({ ...errorMessages, targetAccountNumber: '' });
    } else {
      setIsAccountValid(false);
      setErrorMessages({ ...errorMessages, targetAccountNumber: '유효하지 않은 계좌번호입니다.' });
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

    if (!transferAmount) {
      newErrorMessages.transferAmount = '이체 금액을 입력하세요.';
      hasError = true;
    }

    if (!isPasswordValid) {
      newErrorMessages.password = '비밀번호를 확인해주세요.';
      hasError = true;
    }

    if (parseInt(transferAmount) > availableBalance) {
      newErrorMessages.transferAmount = '이체 금액이 잔액보다 큽니다.';
      hasError = true;
    }

    setErrorMessages(newErrorMessages);

    // 에러가 없을 경우 이체 확인 페이지로 이동
    if (!hasError) {
      navigate('/account/transfer-confirmation', {
        state: {
          selectedAccount,
          selectedBank,
          targetAccountNumber,
          transferAmount,
          availableBalance, // 이체 후 잔액 계산을 위해 전달
          recipientName: '홍길동', // 예금주명 하드코딩 (추후 변경 가능)
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
                      setAvailableBalance(null); // 계좌 변경 시 출금 가능 금액 초기화
                      setErrorMessages({ ...errorMessages, selectedAccount: '' });
                    }}
                  >
                    <option value="">계좌 선택</option>
                    <option value="123-456-789">123-456-789</option>
                    <option value="234-567-890">234-567-890</option>
                  </select>
                  <button type="button" onClick={handleCheckBalance} className="balance-button">
                    출금가능금액
                  </button>
                  {/* 출금 가능 금액 또는 오류 메시지 표시 */}
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
                  onChange={(e) => {
                    setSelectedBank(e.target.value);
                    setErrorMessages({ ...errorMessages, selectedBank: '' });
                  }}
                >
                  <option value="">은행명 선택</option>
                  <option value="은행A">은행A</option>
                  <option value="은행B">은행B</option>
                </select>
                {errorMessages.selectedBank && <p className="error-message">{errorMessages.selectedBank}</p>}
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
                {isAccountValid === false && <p className="error-message">{errorMessages.targetAccountNumber}</p>}
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
                {errorMessages.transferAmount && <p className="error-message">{errorMessages.transferAmount}</p>}
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
                {isPasswordValid === false && <p className="error-message">{errorMessages.password}</p>}
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit" className="submit-button">확인</button>
      </form>
    </div>
  );
};

export default AccountTransfer;
