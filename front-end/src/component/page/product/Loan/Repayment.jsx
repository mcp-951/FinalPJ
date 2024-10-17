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
  const [loans, setLoans] = useState([]); // 대출 상품 목록
  const [selectedLoan, setSelectedLoan] = useState(''); // 선택한 대출 상품
  const [repaymentAmount, setRepaymentAmount] = useState(''); // 입금할 금액
  const [errorMessages, setErrorMessages] = useState({});
  const [transferDay, setTransferDay] = useState('1');

  const navigate = useNavigate();

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

    // 대출 정보 가져오기
    ApiService.getActiveLoans()
      .then((response) => {
        console.log('대출 정보:', response.data);
        setLoans(response.data);
      })
      .catch((error) => {
        console.error('대출 정보를 불러오는 중 오류 발생:', error);
        setErrorMessages({ ...errorMessages, loanFetchError: '대출 정보를 불러오는 중 오류가 발생했습니다.' });
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

  // 입금할 금액 버튼 처리
  const handleAmountButtonClick = (amount) => {
    setRepaymentAmount((prevAmount) => {
      const newAmount = parseInt(prevAmount || 0) + amount;
      return newAmount.toString();
    });
  };

  // 폼 제출 처리
  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    const newErrorMessages = {};

    const selected = accounts.find(account => account.accountNumber === selectedAccount);
    const selectedLoanData = loans.find(loan => loan.loanJoinNo === parseInt(selectedLoan)); // 선택한 대출 상품

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

    if (!repaymentAmount) {
      newErrorMessages.repaymentAmount = '입금할 금액을 입력하세요.';
      hasError = true;
    } else if (parseInt(repaymentAmount, 10) > availableBalance) {
      newErrorMessages.repaymentAmount = '입금할 금액이 출금 가능 금액을 초과했습니다.';
      hasError = true;
    } else if (parseInt(repaymentAmount, 10) > selectedLoanData.remainingLoanAmount) {
      // 대출상품 남은 금액보다 입금할 금액이 크면 에러 처리
      newErrorMessages.repaymentAmount = '입금할 금액이 대출상품의 남은 금액을 초과했습니다.';
      hasError = true;
    }

    if (!selectedLoan) {
      newErrorMessages.selectedLoan = '대출 상품을 선택하세요.';
      hasError = true;
    }

    setErrorMessages(newErrorMessages);

    if (!hasError && selected && selectedLoanData) {
      const token = localStorage.getItem('token'); // 토큰 가져오기
    
      if (token) {
        const repaymentData = {
          accountNo: parseInt(selected.accountNo, 10),   // 명시적으로 int로 변환
          loanJoinNo: parseInt(selectedLoanData.loanJoinNo, 10),  // 명시적으로 int로 변환
          repaymentAmount: parseInt(repaymentAmount, 10)  // 명시적으로 int로 변환
        };
    
        ApiService.processRepayment(repaymentData, token) // 데이터를 객체로 넘김
          .then(() => {
            alert('입금되었습니다'); // 입금 성공 시 알림창 표시
            navigate('/');
          })
          .catch((error) => {
            console.error('상환 처리 중 오류 발생:', error);
          });
      } else {
        console.error('토큰이 없습니다.');
      }
    }
  };

  return (
    <div className="auto-transfer-step2-container">
      <h2>대출 중도상환</h2>
      <form onSubmit={handleSubmit}>
        <table className="auto-transfer-step2-table">
          <tbody>
            {/* 대출 상품 선택 */}
            <tr>
              <th>대출상품 선택</th>
              <td>
                <div className="auto-transfer-step2-loan-section">
                  <select
                    value={selectedLoan}
                    onChange={(e) => {
                      setSelectedLoan(e.target.value);
                      setErrorMessages({ ...errorMessages, selectedLoan: '' });
                    }}
                  >
                    <option value="">대출 상품 선택</option>
                    {loans.map(loan => (
                      <option key={loan.loanJoinNo} value={loan.loanJoinNo}>
                        {loan.loanName}
                      </option>
                    ))}
                  </select>
                  {selectedLoan && (
                    <span className="auto-transfer-step2-loan-info">
                      남은 금액: {loans.find(loan => loan.loanJoinNo === parseInt(selectedLoan)).remainingLoanAmount.toLocaleString()}원
                    </span>
                  )}
                  {errorMessages.selectedLoan && (
                    <span className="auto-transfer-step2-error-message">{errorMessages.selectedLoan}</span>
                  )}
                </div>
              </td>
            </tr>

            {/* 출금 계좌 선택 및 잔액 확인 */}
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

            {/* 입금할 금액 입력 및 버튼 */}
            <tr>
              <th>입금할 금액</th>
              <td>
                <div className="auto-transfer-step2-repayment-section">
                  <input
                    type="number"
                    value={repaymentAmount}
                    onChange={(e) => setRepaymentAmount(e.target.value)}
                    placeholder="입금할 금액 입력"
                  />
                  <div className="auto-transfer-step2-repayment-buttons">
                    <button type="button" onClick={() => handleAmountButtonClick(1000000)}>+100만원</button>
                    <button type="button" onClick={() => handleAmountButtonClick(500000)}>+50만원</button>
                    <button type="button" onClick={() => handleAmountButtonClick(100000)}>+10만원</button>
                    <button type="button" onClick={() => handleAmountButtonClick(50000)}>+5만원</button>
                    <button type="button" onClick={() => handleAmountButtonClick(10000)}>+1만원</button>
                    <button type="button" onClick={() => setRepaymentAmount(0)}>초기화</button>
                  </div>
                  {errorMessages.repaymentAmount && (
                    <span className="auto-transfer-step2-error-message">{errorMessages.repaymentAmount}</span>
                  )}
                </div>
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
        <button type="submit" className="auto-transfer-step2-submit-button">완료</button>
      </form>
    </div>
  );
};

export default Loanchap2;
