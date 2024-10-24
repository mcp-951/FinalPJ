import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiSer from '../../../ApiService';  // apiSer를 import
import axios from 'axios';
import '../../../../resource/css/account/accountManagement/AccountClose.css';

const AccountClose = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [balance, setBalance] = useState(null); 
  const [isVerified, setIsVerified] = useState(false); // 인증 여부
  const [hp, setHp] = useState(''); // 휴대폰 번호 입력 상태
  const [hpAuthKey, setHpAuthKey] = useState(''); // 서버로부터 받은 인증번호
  const [enteredAuthKey, setEnteredAuthKey] = useState(''); // 사용자가 입력한 인증번호
  const [authSuccess, setAuthSuccess] = useState(false); // 인증 성공 여부
  const [errorMessage, setErrorMessage] = useState('');

  // String 타입으로 처리된 accountNumber
  const accountNumber = location.state?.accountNumber || 'Unknown';
  const productName = location.state?.productName || 'Unknown';

  // 로컬 스토리지에서 JWT 토큰과 userNo를 가져오기
  const token = localStorage.getItem("token");
  const userNo = localStorage.getItem("userNo");
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    // 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [navigate]);

  // 잔액 조회 API 호출
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get(`http://13.125.114.85:8081/uram/account/detail/${accountNumber}`, {
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

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const phoneNumber = await apiSer.getUserPhoneNumber(token);
        console.log('Fetched phone number:', phoneNumber); // 핸드폰 번호 콘솔에 출력
        setHp(phoneNumber); // API로부터 받은 핸드폰 번호를 상태에 저장
      } catch (error) {
        console.error('핸드폰 번호 정보를 불러오는 중 오류 발생:', error);
        setErrorMessage('핸드폰 번호 정보를 불러오는 중 오류가 발생했습니다.');
      }
    };
  
    if (token) {
      fetchPhoneNumber(); // 핸드폰 번호 가져오기
    }
  }, [token]);

  // 휴대폰 인증번호 받기 로직
  const handleCheckHp = async () => {
    try {
      const response = await apiSer.checkHp(hp); // apiSer의 checkHp 메서드 호출
      setHpAuthKey(response.data); // 서버로부터 받은 인증번호 저장
      alert('인증번호가 발송되었습니다.');
    } catch (error) {
      console.error('휴대폰 인증번호 발송 중 오류 발생:', error);
      setErrorMessage('휴대폰 인증번호 발송 중 오류가 발생했습니다.');
    }
  };

  // 인증번호 확인 로직
  const handleAuthKeyCheck = () => {
    if (String(hpAuthKey).trim() === String(enteredAuthKey).trim()) {
      setIsVerified(true);
      setAuthSuccess(true);
      alert('휴대폰 인증이 완료되었습니다.');
    } else {
      setAuthSuccess(false);
      alert('인증번호가 일치하지 않습니다.');
    }
  };

  // 이체 페이지로 이동하는 함수
  const handleTransfer = () => {
    navigate('/account/transfer', { state: { accountNumber } });
  };

  // 계좌 해지 API 호출 함수
  const confirmClose = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8081/uram/account/${accountNumber}/terminate`, // accountNumber는 String으로 처리
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

  // 계좌 해지 버튼 클릭 시 처리
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
    <div className="AccountClose-container">
      <h2>계좌 해지</h2>
      <table className="AccountClose-info-table">
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
              <div className="AccountClose-balance-section">
                {balance !== null ? `${balance.toLocaleString()}원` : '로딩 중...'}
                {balance > 0 && (
                  <>
                    <span className="AccountClose-balance-warning">잔액이 0원이 아닙니다.</span>
                    <button onClick={handleTransfer} className="AccountClose-transfer-button">이체하기</button>
                  </>
                )}
              </div>
            </td>
          </tr>
          <tr>
            <th>휴대폰 번호</th>
            <td>
              <input
                type="tel"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                placeholder="01012345678"
                readOnly
              />
              <button onClick={handleCheckHp} className="AccountClose-verify-button">
                인증번호 받기
              </button>
            </td>
          </tr>
          <tr>
            <th>인증번호</th>
            <td>
              <input
                type="text"
                value={enteredAuthKey}
                onChange={(e) => setEnteredAuthKey(e.target.value)}
                placeholder="인증번호 입력"
              />
              <button onClick={handleAuthKeyCheck} className="AccountClose-verify-button">
                인증하기
              </button>
              {authSuccess && <span className="AccountClose-success-message">✔ 인증 완료</span>}
            </td>
          </tr>
        </tbody>
      </table>
  
      <div className="AccountClose-close-button-container">
        <button
          onClick={handleAccountClose}
          className="AccountClose-close-button"
          disabled={!isVerified}
        >
          해지
        </button>
      </div>
  
      {errorMessage && <div className="AccountClose-error-message">{errorMessage}</div>}
    </div>
  );
};

export default AccountClose;
