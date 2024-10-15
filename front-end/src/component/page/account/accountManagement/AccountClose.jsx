import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../../../resource/css/account/accountManagement/AccountClose.css';

const AccountClose = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [balance, setBalance] = useState(null); 
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const accountNumber = location.state?.accountNumber || 'Unknown';
  const productName = location.state?.productName || 'Unknown';

  // 로컬 스토리지에서 JWT 토큰과 userNo를 가져오기
  const token = localStorage.getItem("token");
  const userNo = localStorage.getItem("userNo");

  // 잔액 조회 API 호출
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/uram/account/${accountNumber}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Authorization 헤더에 JWT 추가
          },
          params: {
            userNo: userNo // userNo를 쿼리 파라미터로 추가
          }
        });
        setBalance(response.data.accountBalance);
      } catch (error) {
        setErrorMessage('잔액 정보를 불러오는 중 오류가 발생했습니다.');
        console.error('Error fetching balance:', error);
      }
    };

    if (accountNumber !== 'Unknown') {
      fetchBalance();
    }
  }, [accountNumber, userNo, token]);

  const handleTransfer = () => {
    navigate('/account/transfer');
  };

  const handlePhoneVerification = () => {
    setIsVerified(true);
    alert('휴대폰 인증이 완료되었습니다.');
  };

  const confirmClose = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8081/uram/account/${accountNumber}/terminate`,
        {
          userNo: userNo, // userNo를 요청 본문에 포함
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Authorization 헤더에 JWT 추가
          },
        }
      );

      if (response.status === 200) {
        alert('계좌가 성공적으로 해지되었습니다.');
        navigate('/'); 
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
            <td>{accountNumber}</td>
          </tr>
          <tr>
            <th>계좌명</th>
            <td>{productName}</td>
          </tr>
          <tr>
            <th>잔액</th>
            <td>
              <div className="balance-section">
                {balance !== null ? `${balance.toLocaleString()}원` : '로딩 중...'}
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
