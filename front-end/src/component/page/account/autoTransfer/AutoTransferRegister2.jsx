import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../resource/css/account/autoTransfer/AutoTransferRegister2.css'; // 자동이체 등록 페이지 전용 CSS

const AutoTransferRegisterStep2 = () => {
  const [selectedAutoAccount, setSelectedAutoAccount] = useState(''); // 선택된 자동이체 계좌
  const [availableAutoBalance, setAvailableAutoBalance] = useState(null); // 출금 가능 금액
  const [autoTransferAmount, setAutoTransferAmount] = useState(''); // 자동이체 금액
  const [autoTransferPassword, setAutoTransferPassword] = useState(''); // 비밀번호 입력
  const [isAutoPasswordValid, setIsAutoPasswordValid] = useState(null); // 비밀번호 유효성 체크
  const [selectedAutoBank, setSelectedAutoBank] = useState(''); // 선택된 은행
  const [autoTargetAccount, setAutoTargetAccount] = useState(''); // 입금 계좌번호
  const [isAutoAccountValid, setIsAutoAccountValid] = useState(null); // 입금 계좌번호 유효성 체크
  const [autoTransferLimit, setAutoTransferLimit] = useState({ dailyLimit: null, onceLimit: null }); // 이체 한도
  const [errorMessages, setErrorMessages] = useState({}); // 각 필드에 대한 에러 메시지 상태
  const [accounts, setAccounts] = useState([]); // 사용자의 계좌 목록
  const [transferDay, setTransferDay] = useState('1'); // 자동 이체일
  const [startDate, setStartDate] = useState(''); // 시작년월
  const [endDate, setEndDate] = useState(''); // 종료년월
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 사용

  // 초기 계좌 목록 로드 및 이체 한도 정보 로드
  useEffect(() => {
    fetchAccounts();
  }, []);

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
  const fetchAutoTransferLimits = async (accountNumber) => {
    try {
      const response = await fetch(`http://localhost:8081/uram/account/${accountNumber}`);
      const data = await response.json();
      setAutoTransferLimit({
        dailyLimit: data.accountMax, // 1일 이체 한도
        onceLimit: data.accountLimit, // 1회 이체 한도
      });
    } catch (error) {
      console.error('이체 한도 정보를 불러오는 중 오류 발생:', error);
    }
  };

  // 출금 가능 금액 확인
  const handleCheckAutoBalance = () => {
    console.log('계좌 선택 시 선택된 출금 계좌번호:', selectedAutoAccount);
    const account = accounts.find((acc) => acc.accountNumber === parseInt(selectedAutoAccount));
    if (account) {
      setAvailableAutoBalance(account.accountBalance);
      setErrorMessages({ ...errorMessages, selectedAutoAccount: '' });
    } else {
      setAvailableAutoBalance(null);
      setErrorMessages({ ...errorMessages, selectedAutoAccount: '계좌를 선택하세요.' });
    }
  };

  // 입금 계좌 확인 로직 (API 호출)
  const handleAutoAccountCheck = async () => {
    console.log('입금 은행:', selectedAutoBank);
    console.log('입금 계좌번호:', autoTargetAccount);
  
    if (!selectedAutoBank || !autoTargetAccount) {
      setErrorMessages({ ...errorMessages, autoTargetAccount: '은행명과 입금 계좌번호를 입력하세요.' });
      return;
    }
  
    try {
      const response = await fetch(
        `http://localhost:8081/uram/account/validate?accountNumber=${autoTargetAccount}&bankName=${selectedAutoBank}`
      );
      const isValid = await response.json();
  
      if (isValid) {
        setIsAutoAccountValid(true);
        setErrorMessages({ ...errorMessages, autoTargetAccount: '' });
      } else {
        setIsAutoAccountValid(false);
        setErrorMessages({ ...errorMessages, autoTargetAccount: '유효하지 않은 계좌입니다.' });
      }
    } catch (error) {
      console.error('계좌 확인 실패:', error);
      setIsAutoAccountValid(false);
      setErrorMessages({ ...errorMessages, autoTargetAccount: '계좌 확인 중 오류가 발생했습니다.' });
    }
  };

  // 금액 클릭 시 설정
  const handleAutoAmountClick = (amount) => {
    setAutoTransferAmount(amount);
    setErrorMessages({ ...errorMessages, autoTransferAmount: '' });
  };

  // 비밀번호 확인 로직 (API 호출)
  const handleAutoPasswordCheck = async () => {
    if (!autoTransferPassword) {
      setErrorMessages({ ...errorMessages, autoTransferPassword: '비밀번호를 입력하세요.' });
      setIsAutoPasswordValid(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8081/uram/account/${selectedAutoAccount}/check-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password: parseInt(autoTransferPassword, 10) }), // 비밀번호는 숫자형으로 변환
        }
      );

      if (response.ok) {
        setIsAutoPasswordValid(true);
        setErrorMessages({ ...errorMessages, autoTransferPassword: '' });
      } else {
        setIsAutoPasswordValid(false);
        setErrorMessages({ ...errorMessages, autoTransferPassword: '비밀번호가 일치하지 않습니다.' });
      }
    } catch (error) {
      console.error('비밀번호 확인 실패:', error);
      setIsAutoPasswordValid(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    const newErrorMessages = {};
  
    console.log('선택된 출금 계좌번호 (selectedAutoAccount):', selectedAutoAccount);
    console.log('선택된 입금 계좌번호 (autoTargetAccount):', autoTargetAccount);
  
    // 필드 검증 로직
    if (!selectedAutoAccount) {
      newErrorMessages.selectedAutoAccount = '계좌를 선택하세요.';
      hasError = true;
    }
  
    if (availableAutoBalance === null) {
      newErrorMessages.availableAutoBalance = '출금 가능 금액을 확인하세요.';
      hasError = true;
    }
  
    if (!selectedAutoBank) {
      newErrorMessages.selectedAutoBank = '입금 은행을 선택하세요.';
      hasError = true;
    }
  
    if (!autoTargetAccount) {
      newErrorMessages.autoTargetAccount = '입금 계좌번호를 입력하세요.';
      hasError = true;
    } else if (!isAutoAccountValid) {
      newErrorMessages.autoTargetAccount = '유효하지 않은 입금 계좌번호입니다.';
      hasError = true;
    }
  
    if (selectedAutoAccount === autoTargetAccount) {
      newErrorMessages.autoTargetAccount = '출금 계좌와 입금 계좌가 동일할 수 없습니다.';
      hasError = true;
    }
  
    if (!autoTransferAmount) {
      newErrorMessages.autoTransferAmount = '이체 금액을 입력하세요.';
      hasError = true;
    } else if (parseInt(autoTransferAmount) > availableAutoBalance) {
      newErrorMessages.autoTransferAmount = '이체 금액이 잔액보다 큽니다.';
      hasError = true;
    }
  
    if (!isAutoPasswordValid) {
      newErrorMessages.autoTransferPassword = '비밀번호를 확인해주세요.';
      hasError = true;
    }
  
    if (!startDate || !endDate) {
      newErrorMessages.transferPeriod = '이체 기간을 설정하세요.';
      hasError = true;
    }
  
    setErrorMessages(newErrorMessages);
  
    if (!hasError) {
      // 시작년월과 이체일을 합쳐서 yyyy-MM-dd 형식으로 변환
      const startYearMonth = startDate.split('-');
      const endYearMonth = endDate.split('-');
      const formattedStartDate = `${startYearMonth[0]}-${startYearMonth[1]}-${String(
        transferDay
      ).padStart(2, '0')}`;
      const formattedEndDate = `${endYearMonth[0]}-${endYearMonth[1]}-${String(
        transferDay
      ).padStart(2, '0')}`;
  
      // 자동이체 등록을 위한 데이터 구성
      const autoTransferData = {
        accountNo: selectedAutoAccount,          // 수정된 필드 이름
        receiveAccountNo: autoTargetAccount,     // 수정된 필드 이름
        autoSendPrice: parseInt(autoTransferAmount, 10), // 수정된 필드 이름
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        transferDay: parseInt(transferDay, 10),
        toBankName: selectedAutoBank,            // 수정된 필드 이름
      };
  
      console.log('자동이체 등록 요청 데이터:', autoTransferData);
  
      try {
        const response = await fetch('http://localhost:8081/uram/auto-transfer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(autoTransferData),
        });
  
        if (response.ok) {
          alert('자동이체가 등록되었습니다.');
          navigate(`/auto-transfers`);
        } else {
          const errorMessage = await response.text();
          setErrorMessages({ general: `자동이체 등록 실패: ${errorMessage}` });
        }
      } catch (error) {
        console.error('자동이체 등록 실패:', error);
        setErrorMessages({ general: '자동이체 등록 중 오류가 발생했습니다.' });
      }
    }
  };
  

  return (
    <div className="transfer-container">
      <h2>자동이체 등록</h2>
      <form onSubmit={handleSubmit}>
        <table className="transfer-table">
          <tbody>
            <tr>
              <th>출금계좌번호</th>
              <td>
                <div className="account-balance-section">
                  <select
                    value={selectedAutoAccount}
                    onChange={(e) => {
                      setSelectedAutoAccount(e.target.value);
                      setAvailableAutoBalance(null);
                      setErrorMessages({ ...errorMessages, selectedAutoAccount: '' });
                      fetchAutoTransferLimits(e.target.value);
                    }}
                  >
                    <option value="">계좌 선택</option>
                    {accounts.map((account) => (
                      <option key={account.accountNumber} value={account.accountNumber}>
                        {account.accountNumber}
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={handleCheckAutoBalance} className="balance-button">
                    출금가능금액
                  </button>
                  {availableAutoBalance !== null ? (
                    <span className="balance-info">{availableAutoBalance.toLocaleString()}원</span>
                  ) : (
                    <span className="error-message">{errorMessages.selectedAutoAccount}</span>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <th>입금기관</th>
              <td>
                <select
                  value={selectedAutoBank}
                  onChange={(e) => setSelectedAutoBank(e.target.value)}
                >
                  <option value="">은행명 선택</option>
                  <option value="동명은행">동명은행</option>
                  <option value="우람은행">우람은행</option>
                </select>
                {errorMessages.selectedAutoBank && <span className="error-message">{errorMessages.selectedAutoBank}</span>}
              </td>
            </tr>
            <tr>
              <th>입금계좌번호</th>
              <td>
                <input
                  type="text"
                  value={autoTargetAccount}
                  onChange={(e) => {
                    setAutoTargetAccount(e.target.value);
                    setErrorMessages({ ...errorMessages, autoTargetAccount: '' });
                  }}
                  placeholder="입금 계좌번호 입력"
                />
                <button type="button" onClick={handleAutoAccountCheck}>계좌 확인</button>
                {isAutoAccountValid === true && <span className="valid-check">✔ 계좌 유효</span>}
                {errorMessages.autoTargetAccount && <span className="error-message">{errorMessages.autoTargetAccount}</span>}
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
                      onClick={() => handleAutoAmountClick(amount)}
                    >
                      {amount.toLocaleString()}원
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={autoTransferAmount}
                  onChange={(e) => setAutoTransferAmount(e.target.value)}
                  placeholder="금액 입력"
                />
                {errorMessages.autoTransferAmount && <span className="error-message">{errorMessages.autoTransferAmount}</span>}
              </td>
            </tr>
            <tr>
              <th>비밀번호 확인</th>
              <td>
                <input
                  type="password"
                  value={autoTransferPassword}
                  onChange={(e) => setAutoTransferPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                />
                <button type="button" onClick={handleAutoPasswordCheck}>
                  확인
                </button>
                {isAutoPasswordValid === true && <span className="valid-check">✔ 비밀번호 확인</span>}
                {errorMessages.autoTransferPassword && <span className="error-message">{errorMessages.autoTransferPassword}</span>}
              </td>
            </tr>
            <tr>
              <th>자동 이체일</th>
              <td>
                <select
                  value={transferDay}
                  onChange={(e) => setTransferDay(e.target.value)}
                  className="transfer-day-select"
                >
                  <option value="1">1일</option>
                  <option value="8">8일</option>
                  <option value="10">10일</option>
                  <option value="20">20일</option>
                </select>
              </td>
            </tr>
            <tr>
              <th>이체 기간</th>
              <td>
                <div className="transfer-period">
                  <input
                    type="month"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="transfer-period-input"
                  />
                  ~
                  <input
                    type="month"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="transfer-period-input"
                  />
                </div>
                {errorMessages.transferPeriod && <span className="error-message">{errorMessages.transferPeriod}</span>}
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

export default AutoTransferRegisterStep2;
