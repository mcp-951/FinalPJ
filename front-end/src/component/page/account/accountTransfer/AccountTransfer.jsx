import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  const [onceLimit, setOnceLimit] = useState(null); // 1회 이체 한도
  const [errorMessages, setErrorMessages] = useState({}); // 각 필드에 대한 에러 메시지 상태
  const [accounts, setAccounts] = useState([]); // 사용자의 계좌 목록
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 사용

  // 로그인 확인 추가 부분
  useEffect(() => {
    const token = localStorage.getItem('token'); // 토큰 확인
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login'); // 로그인 페이지로 리다이렉트
    }
  }, [navigate]);

  // 로컬 스토리지에서 JWT 토큰과 userNo 가져오기
  const token = localStorage.getItem("token");
  const userNo = localStorage.getItem("userNo");

  // 계좌번호 포맷팅 함수 (###-##-##### 형식)
  const formatAccountNumber = (value) => {
    const cleanValue = value.replace(/\D+/g, ''); // 숫자만 남김
    const formattedValue = cleanValue.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3'); // 형식 적용
    return formattedValue;
  };

  // 계좌번호 입력 시 포맷 적용
  const handleAccountNumberChange = (e) => {
    const inputValue = e.target.value;
    const formattedAccountNumber = formatAccountNumber(inputValue);
    setTargetAccountNumber(formattedAccountNumber); // 포맷팅된 계좌번호 저장
  };

  // 초기 계좌 목록 로드 및 이체 한도 정보 로드
  useEffect(() => {
    fetchAccounts();
    if (initialAccount) {
      setSelectedAccount(initialAccount);
      fetchOnceLimit(initialAccount); // 이체 한도 정보를 가져옴
    }
  }, [initialAccount]);

  // 백엔드에서 계좌 목록 가져오기
  const fetchAccounts = async () => {
    try {
      const response = await axios.get('http://localhost:8081/uram/accounts/category-one', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          userNo: userNo // userNo를 쿼리 파라미터로 추가
        }
      });

      const { accounts } = response.data;

      if (Array.isArray(accounts) && accounts.length > 0) {
        setAccounts(accounts); // 사용자의 계좌 목록 설정
      } else {
        alert('등록된 계좌가 없습니다.'); // 계좌가 없을 때 알림
        navigate('/'); // 메인 페이지로 리다이렉트
      }
    } catch (error) {
      console.error('계좌 목록 불러오기 실패:', error);
      setErrorMessages({ general: '계좌 목록을 불러오는 중 오류가 발생했습니다.' });
      setAccounts([]); // 오류가 발생한 경우 빈 배열로 설정
    } finally {
      setLoading(false); // 로딩 완료
    }
  };

  // 1회 이체 한도 정보를 받아오는 함수
  const fetchOnceLimit = async (accountNumber) => {
    try {
      const response = await axios.get(`http://localhost:8081/uram/account/${accountNumber}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          userNo: userNo // userNo를 쿼리 파라미터로 추가
        }
      });
      setOnceLimit(response.data.accountLimit); // 1회 이체 한도 설정
    } catch (error) {
      console.error('이체 한도 정보를 불러오는 중 오류 발생:', error);
    }
  };

  // 출금 가능 금액 확인
  const handleCheckBalance = () => {
    const account = accounts.find(acc => acc.accountNumber === selectedAccount);
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
    setTransferAmount(amount); // 클릭한 금액을 설정
    setErrorMessages((prevState) => ({
      ...prevState,
      transferAmount: '',
    }));
  };

  // 비밀번호 확인 로직 (API 호출)
  const handlePasswordCheck = async () => {
    if (!password) {
      setErrorMessages({ ...errorMessages, password: '비밀번호를 입력하세요.' });
      setIsPasswordValid(false);
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8081/uram/account/${selectedAccount}/check-password`, {
        password: password,
        userNo: userNo // userNo를 요청 본문에 포함
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setIsPasswordValid(true);
        setErrorMessages({ ...errorMessages, password: '' });
      } else {
        setIsPasswordValid(false);
        setErrorMessages({ ...errorMessages, password: '비밀번호가 일치하지 않습니다.' });
      }
    } catch (error) {
      console.error('비밀번호 확인 실패:', error);
      setIsPasswordValid(false);
      setErrorMessages({ ...errorMessages, password: '비밀번호가 일치하지 않습니다.' });
    }
  };

  // 입금 계좌 확인 로직 (API 호출)
  const handleAccountCheck = async () => {
    if (!selectedBank || !targetAccountNumber) {
      setErrorMessages({ ...errorMessages, targetAccountNumber: '은행명과 입금 계좌번호를 입력하세요.' });
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8081/uram/account/validate`, {
        params: {
          accountNumber: targetAccountNumber,
          bankName: selectedBank,
          userNo: userNo // userNo를 쿼리 파라미터로 추가
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const isValid = response.data;
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

    // 출금 가능 금액을 확인했는지 여부 확인
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

    if (selectedAccount && targetAccountNumber && selectedAccount === targetAccountNumber) {
      newErrorMessages.targetAccountNumber = '출금 계좌와 입금 계좌가 동일할 수 없습니다.';
      hasError = true;
    }

    // 금액 검증: 0원 초과여야 함
    if (!transferAmount) {
      newErrorMessages.transferAmount = '이체 금액을 입력해주세요.';
      hasError = true;
    } else if (parseInt(transferAmount, 10) <= 0) {
      newErrorMessages.transferAmount = '이체 금액은 0원보다 커야 합니다.';
      hasError = true;
    } else if (availableBalance !== null && parseInt(transferAmount, 10) > availableBalance) {
      newErrorMessages.transferAmount = '이체 금액이 잔액보다 큽니다.';
      hasError = true;
    } else if (onceLimit !== null && parseInt(transferAmount, 10) > onceLimit) {  // onceLimit이 null인지 확인
      newErrorMessages.transferAmount = `이체 금액이 1회 이체 한도(${onceLimit?.toLocaleString() ?? 'N/A'}원)를 초과했습니다.`;
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
                      fetchOnceLimit(e.target.value); // 선택된 계좌의 이체 한도 가져오기
                    }}
                    disabled={isPasswordValid} // 비밀번호 확인 완료 후 비활성화
                  >
                    <option value="">계좌 선택</option>
                    {accounts.length > 0 ? (
                      accounts.map((account) => (
                        <option key={account.accountNumber} value={account.accountNumber}>
                          {account.accountNumber}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        등록된 계좌가 없습니다
                      </option>
                    )}
                  </select>
                  <button type="button" onClick={handleCheckBalance} className="balance-button">
                  출금가능금액
                  </button>
                  {availableBalance !== null ? (
                    <span className="balance-info">{availableBalance.toLocaleString()}원</span>
                  ) : (
                    <span className="error-message">{errorMessages.selectedAccount}</span> // 출금 가능 금액 확인 경고 메시지
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
                  onChange={handleAccountNumberChange}
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
                  onChange={(e) => setTransferAmount(e.target.value)} // 금액 입력 시 바로 설정
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
                  disabled={isPasswordValid} // 비밀번호 확인 완료 후 비활성화
                />
                <button type="button" onClick={handlePasswordCheck} disabled={isPasswordValid}>
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
