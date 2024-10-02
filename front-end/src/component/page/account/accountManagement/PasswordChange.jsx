import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate 추가
import '../../../../resource/css/account/accountManagement/PasswordChange.css'; // CSS 파일

const PasswordChange = () => {
  const { accountNumber } = useParams(); // URL 파라미터에서 계좌번호 가져오기
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false); // 휴대폰 인증 여부
  const [error, setError] = useState('');
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

  const handlePhoneVerification = () => {
    setIsVerified(true);
    alert('휴대폰 인증이 완료되었습니다.');
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      setError('변경할 비밀번호가 일치하지 않습니다.');
    } else {
      setError('');
      alert('비밀번호가 성공적으로 변경되었습니다.');
      
      // 비밀번호 변경 성공 후 메인 페이지로 이동
      navigate('/');
    }
  };

  return (
    <div className="password-change-container">
      <h2>계좌 비밀번호 변경</h2>
      <table className="password-change-table">
        <tbody>
          <tr>
            <th>계좌번호</th>
            <td>{accountNumber}</td> {/* URL에서 가져온 계좌번호를 표시 */}
          </tr>
          <tr>
            <th>계좌명</th>
            <td>xxxxxxxx</td>
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

      {/* 비밀번호 변경 버튼 */}
      <div className="submit-button-container">
        <button onClick={handlePasswordChange} className="submit-button" disabled={!isVerified}>
          확인
        </button>
      </div>
    </div>
  );
};

export default PasswordChange;
