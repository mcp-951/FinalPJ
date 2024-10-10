import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../resource/css/account/autoTransfer/AutoTransferRegister2.css'; // 고유 스타일 적용
import ApiService from '../../../ApiService'; // API 서비스 임포트

const AutoTransferRegisterStep2 = () => {
  const [selectedAccount, setSelectedAccount] = useState(''); // 선택된 계좌 (출금계좌)
  const [availableBalance, setAvailableBalance] = useState(null); // 출금 가능 금액
  const [password, setPassword] = useState(''); // 비밀번호 입력 (문자열로 처리)
  const [isPasswordValid, setIsPasswordValid] = useState(null); // 비밀번호 유효성 체크
  const [inputAccountNumber, setInputAccountNumber] = useState(''); // 자동 생성된 입금 계좌번호
  const [accounts, setAccounts] = useState([]); // 사용자 계좌 정보 리스트
  const [errorMessages, setErrorMessages] = useState({}); // 에러 메시지 상태
  const [transferDay, setTransferDay] = useState('1'); // 자동 이체일
  const [interestRate, setInterestRate] = useState(''); // 금리 값 추가

  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이트 함수

  // 세션에서 필요한 값 가져오기 (상품명, 상환방식, 대출금액, 대출기간)
  const productName = sessionStorage.getItem('selectedProductName');
  const repaymentMethod = sessionStorage.getItem('selectedRepaymentMethod');
  const loanAmount = sessionStorage.getItem('selectedLoanAmount');
  const loanPeriod = sessionStorage.getItem('selectedLoanPeriod');

  // 계좌 번호 자동 생성 (랜덤 9자리 생성 후 형식에 맞추기)
  useEffect(() => {
    const generateAccountNumber = () => {
      const randomNumber = Math.floor(100000000 + Math.random() * 900000000); // 9자리 랜덤 숫자 생성
      const formattedNumber = `${randomNumber.toString().slice(0, 3)}-${randomNumber.toString().slice(3, 6)}-${randomNumber.toString().slice(6, 9)}`;
      setInputAccountNumber(formattedNumber);
    };

    generateAccountNumber();

    // 사용자 계좌 정보 가져오기
    ApiService.getUserAccounts()
      .then((response) => {
        console.log('API 응답 데이터:', response.data); // 데이터를 확인하는 로그
        setAccounts(response.data); // 계좌 리스트 저장
      })
      .catch((error) => {
        console.error('계좌 정보를 불러오는 중 오류 발생:', error); // 에러 로그
        setErrorMessages({ ...errorMessages, fetchError: '계좌 정보를 불러오는 중 오류가 발생했습니다.' });
      });
  }, []);

  // 출금 가능 금액 확인
  const handleCheckBalance = () => {
    const selected = accounts.find(account => account.accountNumber === selectedAccount); // 계좌 번호를 문자열로 비교
    if (selected) {
      console.log('선택된 계좌의 잔액:', selected.accountBalance); // 잔액을 확인하는 로그
      setAvailableBalance(selected.accountBalance); // 선택된 계좌의 잔액 설정
      setErrorMessages({ ...errorMessages, selectedAccount: '' });
    } else {
      console.error('계좌를 선택하세요.'); // 오류 로그
      setAvailableBalance(null);
      setErrorMessages({ ...errorMessages, selectedAccount: '계좌를 선택하세요.' });
    }
  };

  // 비밀번호 확인 (문자열 비교)
  const handlePasswordCheck = () => {
    const selected = accounts.find(account => account.accountNumber === selectedAccount); // 선택된 계좌를 찾아옴
    if (!password) {
      setErrorMessages({ ...errorMessages, password: '비밀번호를 입력하세요.' });
      setIsPasswordValid(false);
      return;
    }

    // 선택한 계좌의 비밀번호와 입력한 비밀번호 비교
    if (selected && selected.accountPW === password) {  // accountPW는 문자열로 처리
      setIsPasswordValid(true); // 비밀번호 일치
      setErrorMessages({ ...errorMessages, password: '' });
    } else {
      setIsPasswordValid(false); // 비밀번호 불일치
      setErrorMessages({ ...errorMessages, password: '비밀번호가 일치하지 않습니다.' });
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

    if (!isPasswordValid) {
      newErrorMessages.password = '비밀번호를 확인해주세요.';
      hasError = true;
    }

    setErrorMessages(newErrorMessages);

    if (!hasError) {
      // 모든 검증이 통과되면 세션에 필요한 데이터 저장
      sessionStorage.setItem('selectedProductName', productName);
      sessionStorage.setItem('selectedRepaymentMethod', repaymentMethod);
      sessionStorage.setItem('selectedLoanAmount', loanAmount);
      sessionStorage.setItem('selectedLoanPeriod', loanPeriod);
      sessionStorage.setItem('generatedLoanAccountNumber', inputAccountNumber);
      sessionStorage.setItem('selectedTransferAccount', selectedAccount);
      sessionStorage.setItem('selectedTransferDay', transferDay);

      // 다음 페이지로 이동 (chap3)
      navigate('/Accession_chap3'); // 원하는 경로로 변경
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
                      setAvailableBalance(null); // 계좌 변경 시 출금 가능 금액 초기화
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

            {/* 자동 생성된 입금계좌번호 (수정 불가) */}
            <tr>
              <th>입금계좌번호</th>
              <td>
                <input
                  type="text"
                  value={inputAccountNumber}
                  readOnly // 계좌번호는 자동 생성된 후 수정할 수 없도록 readOnly 설정
                />
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

export default AutoTransferRegisterStep2;
