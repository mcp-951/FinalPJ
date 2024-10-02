import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../../../../resource/css/account/accountManagement/PasswordCheck.css'; // CSS 파일 적용

const PasswordCheck = ({ title, instructions }) => {
  const [selectedAccount, setSelectedAccount] = useState('');  // 선택된 계좌 번호
  const [password, setPassword] = useState('');  // 입력된 비밀번호
  const [isPasswordValid, setIsPasswordValid] = useState(null);  // 비밀번호 유효성 상태

  const navigate = useNavigate();  // 페이지 이동을 위한 navigate 함수
  const [searchParams] = useSearchParams();  // URL의 쿼리 파라미터 확인
  const purpose = searchParams.get('purpose');  // 쿼리 파라미터에서 'purpose' 값 가져오기
  const accountNumberFromQuery = searchParams.get('accountNumber'); // URL 쿼리에서 accountNumber 가져오기

  // 쿼리 파라미터 값을 로그로 출력
  console.log("Purpose: ", purpose);
  console.log("Account Number: ", accountNumberFromQuery);

  // URL 쿼리 파라미터에 계좌 번호가 있을 때 설정
  useEffect(() => {
    if (accountNumberFromQuery) {
      setSelectedAccount(accountNumberFromQuery);
    }
  }, [accountNumberFromQuery]);

  // 비밀번호 확인 로직
  const handlePasswordCheck = () => {
    if (password.trim() !== "") {
      setIsPasswordValid(true); // 비밀번호가 입력된 경우 유효성 통과
      console.log("Password is valid");
    } else {
      setIsPasswordValid(false); // 비밀번호가 입력되지 않았을 경우
      console.log("Password is invalid");
      alert('비밀번호를 입력하세요.');
    }
  };

  // 계좌 선택 및 비밀번호 유효성 검증 후 페이지 이동 처리
  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 폼 제출 방지

    console.log("Submit button clicked");
    console.log("Selected Account: ", selectedAccount);
    console.log("Is Password Valid: ", isPasswordValid);
    console.log("Purpose: ", purpose); // 목적 출력

    if (!selectedAccount) {
      alert('계좌를 선택하세요');
      return;
    }

    if (isPasswordValid) {
      let targetUrl = "";

      // 목적에 따라 경로 설정
      if (purpose === 'password-change') {
        targetUrl = `/account/${selectedAccount}/password-change`;
      } else if (purpose === 'close-account') {
        targetUrl = `/account/${selectedAccount}/close`;
      } else if (purpose === 'limit-inquiry') {
        targetUrl = `/account/${selectedAccount}/limit-change`;
      }

      // 경로가 정의되었는지 확인
      if (targetUrl) {
        console.log("Navigating to: ", targetUrl);  // 경로 로그 출력
        navigate(targetUrl);  // 선택된 계좌 번호와 함께 URL로 이동
      } else {
        console.error("Target URL is not defined. Purpose might be incorrect.");
        alert("올바른 목적이 설정되지 않았습니다.");
      }
    } else {
      alert('비밀번호가 유효하지 않습니다.');
    }
  };

  return (
    <div className="password-check-container">
      <h2>{title}</h2>
      <p>{instructions}</p>

      {/* 계좌 선택 */}
      <div className="account-select">
        <label>계좌 선택</label>
        {accountNumberFromQuery ? (
          <div>{accountNumberFromQuery}</div>
        ) : (
          <select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
            <option value="">계좌를 선택하세요</option>
            <option value="123-456-789">123-456-789</option>
            <option value="987-654-321">987-654-321</option>
          </select>
        )}
      </div>

      {/* 비밀번호 입력 */}
      <div className="password-input">
        <label>비밀번호 입력</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 입력"
        />
        <button onClick={handlePasswordCheck} className="password-check-button">확인</button>

        {/* 비밀번호 유효성 여부 표시 */}
        <span className={`password-check-status ${isPasswordValid === false ? 'error' : isPasswordValid === true ? 'check-mark' : ''}`}>
          {isPasswordValid === false && '비밀번호를 입력해주세요.'}
          {isPasswordValid === true && '비밀번호가 확인되었습니다.'}
        </span>
      </div>

      {/* 확인 버튼 */}
      <button onClick={handleSubmit} className="password-submit-button">확인</button>
    </div>
  );
};

export default PasswordCheck;
