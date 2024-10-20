import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../../../resource/css/account/accountManagement/PasswordCheck.css';
import axios from 'axios';

const AutoTransferCancelPasswordCheck = () => {
  const [password, setPassword] = useState('');  // 입력된 비밀번호
  const [isPasswordValid, setIsPasswordValid] = useState(false);  // 비밀번호 유효성 상태
  const [errorMessage, setErrorMessage] = useState('');  // 오류 메시지 상태
  const navigate = useNavigate();
  const location = useLocation();
  
  // 전달된 계좌 번호와 자동이체 번호
  const { accountNumber, autoTransNo } = location.state || {};

  // JWT 토큰과 userNo를 로컬 스토리지에서 가져오기
  const token = localStorage.getItem("token");
  const userNo = localStorage.getItem("userNo");

  // 비밀번호 확인 로직
  const handlePasswordCheck = async () => {
    if (password.trim() !== "") {
      try {
        // 비밀번호 확인 요청
        const response = await axios.post(`http://localhost:8081/uram/account/${accountNumber}/check-password`, {
          userNo: userNo,
          password: password,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          // 비밀번호가 올바르면 확인 상태를 true로 설정
          setIsPasswordValid(true);
          setErrorMessage('비밀번호가 확인되었습니다.');
        }
      } catch (error) {
        // 비밀번호 확인 실패 시
        setIsPasswordValid(false);
        setErrorMessage('비밀번호가 올바르지 않습니다.');
      }
    } else {
      setErrorMessage('비밀번호를 입력하세요.');
    }
  };

  // 자동이체 해지 요청 로직 (비밀번호 확인 후 호출)
  const handleCancelTransfer = async () => {
    if (isPasswordValid) {
      try {
        // 자동이체 상태 업데이트 (해지)
        const cancelResponse = await axios.put(`http://localhost:8081/uram/auto-transfer/cancel/${autoTransNo}`, null, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (cancelResponse.status === 200) {
          alert('자동이체가 성공적으로 해지되었습니다.');
          navigate('/auto-transfer/list'); // 해지 후 목록 페이지로 이동
        } else {
          alert('자동이체 해지 중 오류가 발생했습니다.');
        }
      } catch (error) {
        alert('자동이체 해지 중 오류가 발생했습니다.');
      }
    } else {
      alert('먼저 비밀번호를 확인해주세요.');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    // 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="password-check-container">
      <h2>비밀번호 확인</h2>
      <p>자동이체 해지를 위해 비밀번호를 입력해주세요.</p>

      {/* 전달받은 계좌 번호 표시 */}
      <div className="account-number-display">
        <p><strong>계좌 번호:</strong> {accountNumber}</p>
      </div>

      {/* 비밀번호 입력 필드 */}
      <div className="password-input">
        <label>비밀번호 입력</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 입력"
        />
        <button onClick={handlePasswordCheck} className="password-check-button">확인</button>

        {/* 오류 메시지 또는 성공 메시지 */}
        <span className={`password-check-status ${isPasswordValid === false ? 'error' : isPasswordValid === true ? 'check-mark' : ''}`}>
          {errorMessage}
        </span>
      </div>

      {/* 계좌 해지 버튼 */}
      {isPasswordValid && (
        <button onClick={handleCancelTransfer} className="cancel-transfer-button">
          자동이체 해지
        </button>
      )}
    </div>
  );
};

export default AutoTransferCancelPasswordCheck;
