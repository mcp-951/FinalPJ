import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../../resource/css/account/autoTransfer/AutoTransferRegister2.css';
import ApiService from '../../../ApiService';

const Termination = () => {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [availableBalance, setAvailableBalance] = useState(null);
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [repaymentAmount, setRepaymentAmount] = useState('');
  const [errorMessages, setErrorMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(''); // 비밀번호 오류 메시지 상태 추가
  const navigate = useNavigate();

  // 적금 계좌 정보 가져오기
  useEffect(() => {
    ApiService.getDepositAccounts()
      .then((response) => {
        const filteredAccounts = response.data.filter(account => account.accountNumber.startsWith('3')); // 계좌번호가 '3'으로 시작하는 계좌만 필터링
        setAccounts(filteredAccounts);
      })
      .catch((error) => {
        setErrorMessages(prev => ({ ...prev, fetchError: '계좌 정보를 불러오는 중 오류가 발생했습니다.' }));
      })
      .finally(() => setLoading(false));
  }, []);

  // 잔액 확인 및 repaymentAmount 설정
  const handleCheckBalance = () => {
    const selected = accounts.find(account => account.accountNumber === selectedAccount);
    if (selected) {
      setAvailableBalance(selected.accountBalance);
      setRepaymentAmount(selected.accountBalance); // 잔액을 repaymentAmount로 설정
      setErrorMessages(prev => ({ ...prev, selectedAccount: '' }));
    } else {
      setAvailableBalance(null);
      setErrorMessages(prev => ({ ...prev, selectedAccount: '계좌를 선택하세요.' }));
    }
  };

  // 비밀번호 확인 로직 (수정된 핸들러)
  const handlePasswordCheck = async () => {
    const selected = accounts.find(account => account.accountNumber === selectedAccount);
    const token = localStorage.getItem('token');
    const userNo = localStorage.getItem('userNo'); // userNo를 로컬 스토리지에서 가져옴

    if (!selected || !token || !userNo) {
      setErrorMessage('로그인 정보 또는 계좌 정보를 확인해주세요.');
      return;
    }

    if (password.trim() !== "") {
      try {
        const response = await axios.post(`http://localhost:8081/uram/account/${selected.accountNumber}/check-password`, {
          userNo: parseInt(userNo),
          password: password,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (response.status === 200) {
          setIsPasswordValid(true);
          setErrorMessage('비밀번호가 확인되었습니다.');
        }
      } catch (error) {
        setIsPasswordValid(false);
        if (error.response && error.response.status === 401) {
          setErrorMessage('비밀번호가 올바르지 않습니다.');
        } else {
          setErrorMessage('비밀번호 확인 중 오류가 발생했습니다.');
        }
      }
    } else {
      setErrorMessage('비밀번호를 입력하세요.');
    }
  };

  // 중도 해지 제출
  const handleTerminationSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    const newErrorMessages = {};

    const selected = accounts.find(account => account.accountNumber === selectedAccount);

    if (!selectedAccount) {
      newErrorMessages.selectedAccount = '계좌를 선택하세요.';
      hasError = true;
    }
    if (!isPasswordValid) {
      newErrorMessages.password = '비밀번호를 확인해주세요.';
      hasError = true;
    }
    setErrorMessages(newErrorMessages);

    if (!hasError && selected) {
      const token = localStorage.getItem('token');
      if (token) {
        const repaymentData = {
          accountNo: parseInt(selected.accountNo, 10),
          repaymentAmount: parseInt(repaymentAmount, 10),
        };

        try {
          const response = await ApiService.terminateDeposit(repaymentData, token);
          if (response.status === 200) { // 정상적으로 처리되었는지 확인
            alert('입금되었습니다');
            navigate('/');
          } else {
            alert('상환 처리 중 오류가 발생했습니다.');
          }
        } catch (error) {
          console.error('상환 처리 중 오류 발생:', error);
          alert('상환 처리 중 오류가 발생했습니다.');
        }
      } else {
        console.error('토큰이 없습니다.');
      }
    }
  };

  return (
    <div className="auto-transfer-step2-container">
      <h2>적금 중도해지</h2>
      {loading ? (
        <p>계좌 정보를 불러오는 중입니다...</p>
      ) : (
        <form onSubmit={handleTerminationSubmit}>
          <table className="auto-transfer-step2-table">
            <tbody>
              <tr>
                <th>적금계좌선택</th>
                <td>
                  <div className="auto-transfer-step2-balance-section">
                    <select
                      value={selectedAccount}
                      onChange={(e) => {
                        setSelectedAccount(e.target.value);
                        setAvailableBalance(null);
                        setErrorMessages(prev => ({ ...prev, selectedAccount: '' }));
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
                    <span className="auto-transfer-step2-error-message">{errorMessage}</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <button type="submit" className="auto-transfer-step2-submit-button">완료</button>
        </form>
      )}
    </div>
  );
};

export default Termination;
