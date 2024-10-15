import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../../../resource/css/account/accountManagement/PasswordChange.css';

const PasswordChange = () => {
  const { accountNumber } = useParams();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 로컬 스토리지에서 JWT 토큰과 userNo를 가져오기
  const token = localStorage.getItem("token");
  const userNo = localStorage.getItem("userNo");

  // 전달된 계좌명 (productName)
  const productName = location.state?.productName || 'Unknown';

  // 전달된 데이터 확인
  console.log('Received accountNumber:', accountNumber);
  console.log('Received productName from state:', productName);

  const handlePhoneVerification = () => {
    setIsVerified(true);
    alert('휴대폰 인증이 완료되었습니다.');
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError('변경할 비밀번호가 일치하지 않습니다.');
    } else {
      setError('');
      try {
        const response = await axios.post(`http://localhost:8081/uram/account/${accountNumber}/change-password`, {
          userNo: parseInt(userNo, 10), // userNo를 전송
          newPassword: parseInt(newPassword, 10) // 비밀번호를 숫자로 변환하여 전송
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

      <div className="submit-button-container">
        <button onClick={handlePasswordChange} className="submit-button" disabled={!isVerified}>
          확인
        </button>
      </div>
    </div>
  );
};

export default PasswordChange;
