import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../../resource/css/account/autoTransfer/AutoTransferRegister2.css'; // 자동이체 등록 페이지 전용 CSS

const AutoTransferRegister2 = () => {
  const { autoTransNo } = useParams(); // 수정 모드 시 URL에서 자동이체 번호 가져오기
  const location = useLocation();
  const { fromAccountNumber: initialAccount, autoAgreement } = location.state || {}; // 출금 계좌번호와 약관 동의 여부 받기

  const [selectedAutoAccount, setSelectedAutoAccount] = useState(initialAccount || ''); // 선택된 자동이체 계좌
  const [availableAutoBalance, setAvailableAutoBalance] = useState(null); // 출금 가능 금액
  const [autoTransferAmount, setAutoTransferAmount] = useState(''); // 자동이체 금액
  const [autoTransferPassword, setAutoTransferPassword] = useState(''); // 비밀번호 입력
  const [isAutoPasswordValid, setIsAutoPasswordValid] = useState(null); // 비밀번호 유효성 체크
  const [selectedAutoBank, setSelectedAutoBank] = useState(''); // 선택된 은행
  const [autoTargetAccount, setAutoTargetAccount] = useState(''); // 입금 계좌번호
  const [isAutoAccountValid, setIsAutoAccountValid] = useState(null); // 입금 계좌번호 유효성 체크
  const [recipientName, setRecipientName] = useState(''); // 계좌주명 상태 추가
  const [autoTransferLimit, setAutoTransferLimit] = useState({ onceLimit: null }); // 1회 이체 한도
  const [errorMessages, setErrorMessages] = useState({}); // 각 필드에 대한 에러 메시지 상태
  const [accounts, setAccounts] = useState([]); // 사용자의 계좌 목록
  const [transferDay, setTransferDay] = useState('1'); // 자동 이체일
  const [startDate, setStartDate] = useState(''); // 시작년월
  const [endDate, setEndDate] = useState(''); // 종료년월
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 사용

  const token = localStorage.getItem("token");
  const userNo = localStorage.getItem("userNo");

  useEffect(() => {
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login'); // 로그인 페이지로 리다이렉트
    }
  }, [navigate]);

  useEffect(() => {
    console.log('Location State:', location.state); // 전달된 state 값 확인
    fetchAccounts(); 
    if (autoTransNo) {
      fetchAutoTransferDetails(autoTransNo);
    } else if (initialAccount) {
      setSelectedAutoAccount(initialAccount);
      fetchAutoTransferLimits(initialAccount);
    }
  }, [initialAccount, autoTransNo]);
  
  const fetchAccounts = async () => {
    try {
      const response = await axios.get('http://localhost:8081/uram/accounts', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          userNo: userNo // userNo를 쿼리 파라미터로 추가
        }
      });

      const { accounts } = response.data;

      if (Array.isArray(accounts) && accounts.length > 0) {
        setAccounts(accounts);
      } else {
        alert('등록된 계좌가 없습니다.'); // 계좌가 없을 때 알림
        navigate('/'); // 메인 페이지로 리다이렉트
      }
    } catch (error) {
      console.error('계좌 목록 불러오기 실패:', error);
      setErrorMessages({ general: '계좌 목록을 불러오는 중 오류가 발생했습니다.' });
      setAccounts([]); // 계좌가 없을 경우 빈 배열로 설정
    }
  };

  const fetchAutoTransferLimits = async (accountNumber) => {
    try {
      const response = await axios.get(`http://localhost:8081/uram/account/${accountNumber}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          userNo: userNo
        }
      });
      setAutoTransferLimit({
        onceLimit: response.data.accountLimit // 1회 이체 한도만 가져옴
      });
    } catch (error) {
      console.error('이체 한도 정보를 불러오는 중 오류 발생:', error);
    }
  };

  const fetchAutoTransferDetails = async (autoTransNo) => {
    try {
      const response = await axios.get(`http://localhost:8081/uram/auto-transfer/${autoTransNo}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        const transfer = response.data;
        setAutoTransferAmount(transfer.autoSendPrice);
        setSelectedAutoBank(transfer.toBankName);
        setAutoTargetAccount(transfer.receiveAccountNumber);
        setStartDate(transfer.startDate);
        setEndDate(transfer.endDate);
        setTransferDay(transfer.transferDay);
        setSelectedAutoAccount(transfer.fromAccountNumber); // 출금 계좌번호
      }
    } catch (error) {
      console.error('자동이체 정보를 가져오는 중 오류 발생:', error);
    }
  };

  const handleCheckAutoBalance = () => {
    const account = accounts.find((acc) => acc.accountNumber === selectedAutoAccount);
    if (account) {
      setAvailableAutoBalance(account.accountBalance);
      setErrorMessages({ ...errorMessages, selectedAutoAccount: '' });
    } else {
      setAvailableAutoBalance(null);
      setErrorMessages({ ...errorMessages, selectedAutoAccount: '계좌를 선택하세요.' });
    }
  };

  const handleAutoAccountCheck = async () => {
    if (!selectedAutoBank || !autoTargetAccount) {
      setErrorMessages({ ...errorMessages, autoTargetAccount: '은행명과 입금 계좌번호를 입력하세요.' });
      return;
    }

    try {
      const response = await axios.get('http://localhost:8081/uram/account/validate', {
        params: {
          accountNumber: autoTargetAccount,
          bankName: selectedAutoBank,
          userNo: parseInt(userNo, 10)
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const { recipientName } = response.data; // 계좌주명 가져오기
      const isValid = recipientName !== null;

      if (isValid) {
        setIsAutoAccountValid(true);
        setRecipientName(recipientName); // 계좌주명 상태에 저장
        setErrorMessages({ ...errorMessages, autoTargetAccount: '' });
      } else {
        setIsAutoAccountValid(false);
        setRecipientName(''); // 유효하지 않으면 계좌주명 초기화
        setErrorMessages({ ...errorMessages, autoTargetAccount: '유효하지 않은 계좌입니다.' });
      }
    } catch (error) {
      console.error('계좌 확인 실패:', error);
      setIsAutoAccountValid(false);
      setRecipientName(''); // 오류 발생 시 계좌주명 초기화
      setErrorMessages({ ...errorMessages, autoTargetAccount: '계좌 확인 중 오류가 발생했습니다.' });
    }
  };

  const handleAutoAmountClick = (amount) => {
    setAutoTransferAmount(amount);
    setErrorMessages({ ...errorMessages, autoTransferAmount: '' });
  };

  const handleAutoPasswordCheck = async () => {
    if (!autoTransferPassword) {
      setErrorMessages({ ...errorMessages, autoTransferPassword: '비밀번호를 입력하세요.' });
      setIsAutoPasswordValid(false);
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8081/uram/account/${selectedAutoAccount}/check-password`, {
        password: autoTransferPassword,
        userNo: parseInt(userNo, 10)
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setIsAutoPasswordValid(true);
        setErrorMessages({ ...errorMessages, autoTransferPassword: '' });
      } else {
        setIsAutoPasswordValid(false);
        setErrorMessages({ ...errorMessages, autoTransferPassword: '비밀번호가 일치하지 않습니다.' });
      }
    } catch (error) {
      console.error('비밀번호 확인 실패:', error);
      setIsAutoPasswordValid(false);
      setErrorMessages({ ...errorMessages, autoTransferPassword: '비밀번호 확인 중 오류가 발생했습니다.' });
    }
  };

  // 계좌번호 포맷팅 함수 (111-22-33333 형식으로 변경)
  const formatAccountNumber = (value) => {
    const cleanValue = value.replace(/\D+/g, ''); // 숫자가 아닌 문자는 제거
    const formattedValue = cleanValue.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3'); // 111-22-33333 형식으로 변환
    return formattedValue;
  };

  const handleAutoTargetAccountChange = (e) => {
    const inputValue = e.target.value;
    setAutoTargetAccount(formatAccountNumber(inputValue));
    setErrorMessages({ ...errorMessages, autoTargetAccount: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    const newErrorMessages = {};

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

    if (selectedAutoAccount && autoTargetAccount && selectedAutoAccount === autoTargetAccount) {
      newErrorMessages.autoTargetAccount = '출금 계좌와 입금 계좌가 동일할 수 없습니다.';
      hasError = true;
    }

    // 이체 금액 검증 추가 (이체 금액은 0원 이상이어야 하며 입력이 필요함)
    if (!autoTransferAmount) {
      newErrorMessages.autoTransferAmount = '이체 금액을 입력해주세요.';
      hasError = true;
    } else if (parseInt(autoTransferAmount) <= 0) {
      newErrorMessages.autoTransferAmount = '이체 금액은 0원보다 커야 합니다.';
      hasError = true;
    } else if (parseInt(autoTransferAmount) > availableAutoBalance) {
      newErrorMessages.autoTransferAmount = '이체 금액이 잔액보다 큽니다.';
      hasError = true;
    } else if (autoTransferLimit.onceLimit && parseInt(autoTransferAmount) > autoTransferLimit.onceLimit) {
      newErrorMessages.autoTransferAmount = '이체 금액이 1회 이체 한도를 초과합니다.';
      hasError = true;
    }

    if (!isAutoPasswordValid) {
      newErrorMessages.autoTransferPassword = '비밀번호를 확인해주세요.';
      hasError = true;
    }

    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 이체 기간 검증 추가
    if (!startDate || !endDate) {
      newErrorMessages.transferPeriod = '이체 기간을 설정하세요.';
      hasError = true;
    } else if (start <= currentDate) {
      newErrorMessages.transferPeriod = '시작일은 현재 날짜보다 미래여야 합니다.';
      hasError = true;
    } else if (end <= start) {
      newErrorMessages.transferPeriod = '종료일은 시작일보다 미래여야 합니다.';
      hasError = true;
    }

    setErrorMessages(newErrorMessages);

    if (!hasError) {
      const startYearMonth = startDate.split('-');
      const endYearMonth = endDate.split('-');
      const formattedStartDate = `${startYearMonth[0]}-${startYearMonth[1]}-${String(transferDay).padStart(2, '0')}`;
      const formattedEndDate = `${endYearMonth[0]}-${endYearMonth[1]}-${String(transferDay).padStart(2, '0')}`;

      const autoTransferData = {
        fromAccountDTO: { accountNumber: selectedAutoAccount },
        toAccountDTO: selectedAutoBank === '우람은행' ? { accountNumber: autoTargetAccount, bankName: selectedAutoBank } : null,
        outAccountDTO: selectedAutoBank !== '우람은행' ? { oAccountNumber: autoTargetAccount, oBankName: selectedAutoBank } : null,
        autoSendPrice: parseInt(autoTransferAmount, 10),
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        transferDay: parseInt(transferDay, 10),
        userNo: parseInt(userNo, 10),
        autoAgreement, // 필수 약관 동의 여부 추가
      };

      // 백엔드로 보내는 데이터 로그 출력
      console.log('Sending autoTransferData to backend:', autoTransferData);

      try {
        let response;
        if (autoTransNo) {
          // 수정일 경우 PUT 요청
          response = await axios.put(`http://localhost:8081/uram/auto-transfer/${autoTransNo}/update`, autoTransferData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });
        } else {
          // 등록일 경우 POST 요청
          response = await axios.post('http://localhost:8081/uram/auto-transfer', autoTransferData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });
        }

        if (response.status === 200) {
          alert(autoTransNo ? '자동이체가 수정되었습니다.' : '자동이체가 등록되었습니다.');
          navigate('/auto-transfer/list');
        } else {
          const errorMessage = response.data || '이체 처리 실패';
          setErrorMessages({ general: `자동이체 처리 실패: ${errorMessage}` });
        }
      } catch (error) {
        console.error('자동이체 처리 실패:', error);
        setErrorMessages({ general: '자동이체 처리 중 오류가 발생했습니다.' });
      }
    }
  };

  return (
    <div className="transfer-container">
      <h2>{autoTransNo ? '자동이체 수정' : '자동이체 등록'}</h2>
      <form onSubmit={handleSubmit}>
        <table className="transfer-table">
          <tbody>
          <tr>
            <th>출금계좌번호</th>
            <td>
              <div className="account-balance-section">
                {initialAccount ? ( // 수정 모드일 경우 (출금 계좌번호가 전달된 경우)
                  <input
                    type="text"
                    value={initialAccount} // 리스트에서 넘어온 출금 계좌번호를 고정
                    disabled // 수정할 수 없도록 비활성화
                  />
                ) : ( // 등록 모드일 경우
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
                )}

                {/* 수정 모드에서도 출금 가능 금액 확인을 활성화 상태로 유지 */}
                <button
                  type="button"
                  onClick={handleCheckAutoBalance}
                  className="balance-button"
                >
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
                  onChange={handleAutoTargetAccountChange}
                  placeholder="입금 계좌번호 입력"
                />
                <button type="button" onClick={handleAutoAccountCheck}>계좌 확인</button>
                {isAutoAccountValid === true && <span className="valid-check">✔ 계좌 유효</span>}
                {recipientName && <span className="recipient-name">계좌주: {recipientName}</span>} {/* 계좌주명 표시 */}
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
                  onChange={(e) => setAutoTransferAmount(e.target.value)}  // 금액 입력 시 바로 설정
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

export default AutoTransferRegister2;
