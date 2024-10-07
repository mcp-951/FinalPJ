import React, { useState } from 'react';
import '../../../../resource/css/account/autoTransfer/AutoTransferRegister2.css'; // 고유 스타일 적용

const AutoTransferRegisterStep2 = () => {
  const [selectedAccount, setSelectedAccount] = useState(''); // 선택된 계좌
  const [availableBalance, setAvailableBalance] = useState(null); // 출금 가능 금액
  const [password, setPassword] = useState(''); // 비밀번호 입력
  const [isPasswordValid, setIsPasswordValid] = useState(null); // 비밀번호 유효성 체크
  const [inputAccountNumber, setInputAccountNumber] = useState(''); // 입금 계좌
  const [isAccountValid, setIsAccountValid] = useState(false); // 계좌 유효성 체크
  const [errorMessages, setErrorMessages] = useState({}); // 에러 메시지 상태

  // 추가된 상태
  const [transferAmount, setTransferAmount] = useState(0); // 이체금액
  const [transferDay, setTransferDay] = useState('30'); // 자동 이체일

  // 유효한 계좌번호 리스트 예시
  const validAccountNumbers = ['987-654-321', '123-456-789', '111'];

  // 계좌 데이터 예시 (출금 가능 금액 포함)
  const accountData = {
    '123-456-789': 100000,
    '234-567-890': 200000,
  };

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

  // 비밀번호 확인
  const handlePasswordCheck = () => {
    if (!password) {
      setErrorMessages({ ...errorMessages, password: '비밀번호를 입력하세요.' });
      setIsPasswordValid(false);
      return;
    }
    setIsPasswordValid(true);
    setErrorMessages({ ...errorMessages, password: '' });
  };

  // 계좌 확인 로직
  const handleAccountCheck = () => {
    if (validAccountNumbers.includes(inputAccountNumber)) {
      setIsAccountValid(true);
      setErrorMessages({ ...errorMessages, inputAccountNumber: '' });
    } else {
      setIsAccountValid(false);
      setErrorMessages({ ...errorMessages, inputAccountNumber: '유효하지 않은 계좌번호입니다.' });
    }
  };

  // 이체 금액 버튼 클릭 시 금액 증가
  const handleAmountButtonClick = (amount) => {
    setTransferAmount(prevAmount => prevAmount + amount);
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

    if (!isAccountValid) {
      newErrorMessages.inputAccountNumber = '입금 계좌를 확인해주세요.';
      hasError = true;
    }

    if (!isPasswordValid) {
      newErrorMessages.password = '비밀번호를 확인해주세요.';
      hasError = true;
    }

    if (!transferAmount) {
      newErrorMessages.transferAmount = '이체 금액을 입력하세요.';
      hasError = true;
    }

    
    setErrorMessages(newErrorMessages);

    if (!hasError) {
      // 모든 검증이 통과되면 다음 페이지로 이동 (여기에서는 페이지 이동 로직은 포함하지 않음)
      alert('자동이체 등록이 완료되었습니다.');
    }
  };

  return (
    <div className="auto-transfer-step2-container">
      <h2>자동이체 등록</h2>
      <form onSubmit={handleSubmit}>
        <table className="auto-transfer-step2-table">
          <tbody>
            {/* 기존 출금계좌번호 */}
            <tr>
              <th>출금계좌번호</th>
              <td>
                <div className="auto-transfer-step2-balance-section">
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

            {/* 기존 비밀번호 확인 */}
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
                {isPasswordValid && <span className="auto-transfer-step2-valid-check">✔ 비밀번호 확인</span>}
                {errorMessages.password && <p className="auto-transfer-step2-error-message">{errorMessages.password}</p>}
              </td>
            </tr>

            {/* 추가된 이체금액 */}
            <tr>
              <th>이체금액</th>
              <td>
                <div className="transfer-amount-buttons">
                  <button type="button" onClick={() => handleAmountButtonClick(1000000)}>100만</button>
                  <button type="button" onClick={() => handleAmountButtonClick(500000)}>50만</button>
                  <button type="button" onClick={() => handleAmountButtonClick(100000)}>10만</button>
                  <button type="button" onClick={() => handleAmountButtonClick(50000)}>5만</button>
                  <button type="button" onClick={() => handleAmountButtonClick(10000)}>1만</button>
                </div>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(parseInt(e.target.value))}
                  placeholder="금액 입력란"
                  className="transfer-amount-input"
                />
                {errorMessages.transferAmount && <p className="auto-transfer-step2-error-message">{errorMessages.transferAmount}</p>}
              </td>
            </tr>

            {/* 기존 입금계좌번호 */}
            <tr>
              <th>입금계좌번호</th>
              <td>
                <input
                  type="text" 
                  value={inputAccountNumber}
                  onChange={(e) => setInputAccountNumber(e.target.value)}
                  placeholder="입금 계좌번호 입력"
                />
                <button type="button" onClick={handleAccountCheck} className="auto-transfer-step2-balance-button">
                  계좌 확인
                </button>
                {isAccountValid && <span className="auto-transfer-step2-valid-check">✔ 계좌 유효</span>}
                {errorMessages.inputAccountNumber && <p className="auto-transfer-step2-error-message">{errorMessages.inputAccountNumber}</p>}
              </td>
            </tr>

            {/* 추가된 자동 이체일 */}
            <tr>
              <th>자동 이체일</th>
              <td>
                <select
                  value={transferDay}
                  onChange={(e) => setTransferDay(e.target.value)}
                  className="transfer-day-select"
                >
                  {[...Array(31).keys()].map(day => (
                    <option key={day + 1} value={day + 1}>{day + 1}</option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit" className="auto-transfer-step2-submit-button">확인</button>
      </form>
    </div>
  );
};

export default AutoTransferRegisterStep2;  