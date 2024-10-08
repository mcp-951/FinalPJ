import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../../../resource/css/account/accountManagement/AccountClose.css';
import localStorage from 'localStorage';

const AccountClose = () => {
  const navigate = useNavigate();
  const location = useLocation();  // 이전 페이지에서 전달된 계좌번호와 계좌명을 받기 위한 useLocation 사용
  const [balance, setBalance] = useState(null); // 잔액 상태
  const [isVerified, setIsVerified] = useState(false); // 휴대폰 인증 여부
  const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지 상태

  const accountNumber = location.state?.accountNumber || 'Unknown';  // 전달된 계좌번호 확인
  const productName = location.state?.productName || 'Unknown';  // 전달된 계좌명 확인

    const token = localStorage.getItem("token");
  // 잔액 조회 API 호출
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/uram/account/${accountNumber}`,{
            headers: {
                'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
            }
        })
        setBalance(response.data.accountBalance);  // 잔액 상태에 반영
      } catch (error) {
        setErrorMessage('잔액 정보를 불러오는 중 오류가 발생했습니다.');
        console.error('Error fetching balance:', error);
      }
    };

    if (accountNumber !== 'Unknown') {
      fetchBalance();  // 계좌번호가 있으면 잔액 조회
    }
  }, [accountNumber]);

  const handleTransfer = () => {
    navigate('/account/transfer'); // 이체 페이지로 이동
  };

  const handlePhoneVerification = () => {
    setIsVerified(true);
    alert('휴대폰 인증이 완료되었습니다.');
  };

  const confirmClose = async () => {
    try {
      const response = await axios.post(`http://localhost:8081/uram/account/${accountNumber}/terminate`);
      if (response.status === 200) {
        alert('계좌가 성공적으로 해지되었습니다.');
        navigate('/'); // 메인 페이지로 이동
      }
    } catch (error) {
      setErrorMessage('계좌 해지 중 오류가 발생했습니다.');
      console.error('Account termination error:', error);
    }
  };

  const handleAccountClose = () => {
    if (balance === 0) {
      if (window.confirm('계좌를 정말 해지하시겠습니까?')) {
        confirmClose();
      }
    } else {
      alert('잔액이 남아 있습니다. 먼저 잔액을 이체해주세요.');
    }
  };

  return (
    <div className="account-close-container">
      <h2>계좌 해지</h2>
      <table className="account-info-table">
        <tbody>
          <tr>
            <th>해지 계좌번호</th>
            <td>{accountNumber}</td> {/* 전달받은 계좌번호 표시 */}
          </tr>
          <tr>
            <th>계좌명</th>
            <td>{productName}</td> {/* 전달받은 계좌명 표시 */}
          </tr>
          <tr>
            <th>잔액</th>
            <td>
              <div className="balance-section">
                {balance !== null ? `${balance.toLocaleString()}원` : '로딩 중...'} {/* 조회한 잔액 표시 */}
                {balance > 0 && (
                  <>
                    <span className="balance-warning">잔액이 0원이 아닙니다.</span>
                    <button onClick={handleTransfer} className="transfer-button">이체하기</button>
                  </>
                )}
              </div>
            </td>
          </tr>
          <tr>
            <th>휴대폰 인증</th>
            <td>
              <button
                onClick={handlePhoneVerification}
                className="verify-button"
                disabled={isVerified}
              >
                {isVerified ? '인증 완료' : '인증하기'}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="close-button-container">
        <button
          onClick={handleAccountClose}
          className="close-button"
          disabled={!isVerified}
        >
          해지
        </button>
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default AccountClose;
