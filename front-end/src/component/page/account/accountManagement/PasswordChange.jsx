import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import apiSer from '../../../ApiService'; // apiSer를 import
import axios from 'axios';
import '../../../../resource/css/account/accountManagement/PasswordChange.css';

const PasswordChange = () => {
  const { accountNumber } = useParams();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false); // 인증 여부
  const [error, setError] = useState('');
  const [hp, setHp] = useState(''); // 핸드폰 번호 상태
  const [hpAuthKey, setHpAuthKey] = useState(''); // 서버로부터 받은 인증번호
  const [enteredAuthKey, setEnteredAuthKey] = useState(''); // 사용자가 입력한 인증번호
  const [authSuccess, setAuthSuccess] = useState(false); // 인증 성공 여부
  const [validationError, setValidationError] = useState({}); // 유효성 검사 오류 메시지 상태
  const navigate = useNavigate();

  // 로컬 스토리지에서 JWT 토큰과 userNo를 가져오기
  const token = localStorage.getItem("token");
  const userNo = localStorage.getItem("userNo");

  // 전달된 계좌명 (productName)과 목적 (purpose)
  const productName = location.state?.productName || 'Unknown';
  const purpose = location.state?.purpose || 'Unknown'; // 목적 추가

  useEffect(() => {
    const token = localStorage.getItem('token');
    // 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [navigate]);

  // 핸드폰 번호 가져오기
  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const phoneNumber = await apiSer.getUserPhoneNumber(token);
        console.log('Fetched phone number:', phoneNumber); // 응답값 로그 출력
        setHp(phoneNumber); // 핸드폰 번호를 설정
      } catch (error) {
        console.error('Error fetching phone number:', error);
        setError('핸드폰 번호 정보를 불러오는 중 오류가 발생했습니다.');
      }
    };

    if (token) {
      fetchPhoneNumber();
    }
  }, [token]);

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
      setValidationError((prev) => ({ ...prev, auth: '' })); // 인증 성공 시 오류 메시지 지움
      alert('휴대폰 인증이 완료되었습니다.');
    } else {
      setAuthSuccess(false);
      setValidationError((prev) => ({ ...prev, auth: '인증번호가 일치하지 않습니다.' }));
    }
  };

  // 비밀번호 변경 요청 핸들러
  const handlePasswordChange = async () => {
    let errorMessage = {};
    
    // 4자리 숫자 비밀번호 정규식
    const passwordPattern = /^\d{4}$/;

    // 비밀번호 입력 확인 및 4자리 숫자인지 검사
    if (!newPassword) {
      errorMessage.newPassword = '변경할 비밀번호를 입력해주세요.';
    } else if (!passwordPattern.test(newPassword)) {
      errorMessage.newPassword = '비밀번호는 4자리 숫자로 입력해주세요.';
    }

    // 비밀번호 일치 여부 확인
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      errorMessage.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    // 휴대폰 인증 여부 확인
    if (!isVerified) {
      errorMessage.auth = '휴대폰 인증을 먼저 완료해주세요.';
    }

    setValidationError(errorMessage);

    // 오류가 있으면 비밀번호 변경 중단
    if (Object.keys(errorMessage).length > 0) {
      return;
    }

    // 오류 없을 시 비밀번호 변경 요청
    try {
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
  };

  return (
    <div className="PasswordChange-container">
      <h2>계좌 비밀번호 변경</h2>
      <table className="PasswordChange-table">
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
                className="PasswordChange-input"
              />
              {validationError.newPassword && <span className="PasswordChange-error-message">{validationError.newPassword}</span>}
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
                className="PasswordChange-input"
              />
              {validationError.confirmPassword && <span className="PasswordChange-error-message">{validationError.confirmPassword}</span>}
            </td>
          </tr>
          <tr>
            <th>휴대폰 번호</th>
            <td>
              <input
                type="tel"
                value={hp}
                placeholder="01012345678"
                readOnly
                className="PasswordChange-input"
              />
              <button onClick={handleCheckHp} className="PasswordChange-verify-button">
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
                className="PasswordChange-input"
              />
              <button onClick={handleAuthKeyCheck} className="PasswordChange-verify-button">
                인증하기
              </button>
              {authSuccess && <span className="PasswordChange-success-message">✔ 인증 완료</span>}
              {validationError.auth && <span className="PasswordChange-error-message">{validationError.auth}</span>}
            </td>
          </tr>
        </tbody>
      </table>
  
      <div className="PasswordChange-submit-button-container">
        <button onClick={handlePasswordChange} className="PasswordChange-submit-button">
          확인
        </button>
      </div>
    </div>
  );
};

export default PasswordChange;
