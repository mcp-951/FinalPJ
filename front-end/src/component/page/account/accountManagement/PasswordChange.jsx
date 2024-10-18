import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import apiSer from '../../../ApiService';  // apiSer를 import
import axios from 'axios';
import '../../../../resource/css/account/accountManagement/PasswordChange.css';

const PasswordChange = () => {
  const { accountNumber } = useParams();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false); // 인증 여부
  const [error, setError] = useState('');
  const [hp, setHp] = useState(''); // 휴대폰 번호 입력 상태
  const [hpAuthKey, setHpAuthKey] = useState(''); // 서버로부터 받은 인증번호
  const [enteredAuthKey, setEnteredAuthKey] = useState(''); // 사용자가 입력한 인증번호
  const [authSuccess, setAuthSuccess] = useState(false); // 인증 성공 여부
  const navigate = useNavigate();

  // 로컬 스토리지에서 JWT 토큰과 userNo를 가져오기
  const token = localStorage.getItem("token");
  const userNo = localStorage.getItem("userNo");

  // 전달된 계좌명 (productName)
  const productName = location.state?.productName || 'Unknown';

  // 인증번호 받기 로직
  const handleCheckHp = async () => {
    try {
      const response = await apiSer.checkHp(hp); // apiSer의 checkHp 메서드 호출
      setHpAuthKey(response.data); // 서버로부터 받은 인증번호 저장
      alert('인증번호가 발송되었습니다.');
    } catch (error) {
      console.error('휴대폰 인증번호 발송 중 오류 발생:', error);
      setError('휴대폰 인증번호 발송 중 오류가 발생했습니다.');
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

  // 비밀번호 변경 요청 핸들러
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError('변경할 비밀번호가 일치하지 않습니다.');
    } else if (!isVerified) {
      setError('휴대폰 인증을 먼저 완료해주세요.');
    } else {
      setError('');
      try {
        // 비밀번호 변경 요청
        const response = await axios.post(`http://localhost:8081/uram/account/${accountNumber}/change-password`, {
          userNo: parseInt(userNo, 10), // userNo를 전송
          newPassword: newPassword,  // 비밀번호를 그대로 String으로 전송
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          alert('비밀번호가 성공적으로 변경되었습니다.');
          navigate('/'); // 성공적으로 변경되면 메인 페이지로 이동
        }
      } catch (error) {
        alert('비밀번호 변경 중 오류가 발생했습니다.');
        console.error("Error during password change:", error);
      }
    }
  };

  return (
    <div className="password-change-container">
      <h2>계좌 비밀번호 변경</h2>
      <table className="password-change-table">
        <tbody>
          <tr>
            <th>계좌번호</th>
            <td>{accountNumber}</td>
          </tr>
          <tr>
            <th>계좌명</th>
            <td>{productName}</td>
          </tr>
          <tr>
            <th>변경후 비밀번호</th>
            <td>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="비밀번호 입력"
              />
            </td>
          </tr>
          <tr>
            <th>변경후 비밀번호 확인</th>
            <td>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호 확인"
              />
              {error && <span className="error-message">{error}</span>}
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
              />
              <button onClick={handleCheckHp} className="verify-button">
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
              <button onClick={handleAuthKeyCheck} className="verify-button">
                인증하기
              </button>
              {authSuccess && <span className="success-message">✔ 인증 완료</span>}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="submit-button-container">
        <button onClick={handlePasswordChange} className="submit-button" disabled={!isVerified}>
          확인
        </button>
      </div>
    </div>
  );
};

export default PasswordChange;
