import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../resource/css/product/DepositMain.css'; // 스타일시트 경로 수정

const DepositchapO1 = () => {
  const [depositPassword, setDepositPassword] = useState(''); // 적금 계좌 비밀번호
  const [confirmPassword, setConfirmPassword] = useState(''); // 비밀번호 확인
  const [isPasswordValid, setIsPasswordValid] = useState(null); // 적금 계좌 비밀번호 확인 상태
  const [depositAccountNumber, setDepositAccountNumber] = useState(''); // 적금 계좌번호

  const navigate = useNavigate();
  const depositData = JSON.parse(sessionStorage.getItem('selectedDeposit')); // sessionStorage에서 적금 정보 가져오기

  // 적금 계좌번호 생성 함수
  const generateDepositAccountNumber = () => {
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10자리 무작위 숫자 생성
    return `${randomNumber.slice(0, 3)}-01-${randomNumber.slice(3, 8)}`; // 계좌번호 형식 ***-01-*****
  };

  // 페이지 로드 시 적금 계좌번호 생성
  useEffect(() => {
    const storedAccountNumber = sessionStorage.getItem('generatedDepositAccountNumber');
    if (!depositData) {
      // 적금 정보가 없으면 메인 페이지로 이동
      navigate('/DepositMain');
    } else if (storedAccountNumber) {
      // 세션에 이미 계좌번호가 저장되어 있으면 그 값을 사용
      setDepositAccountNumber(storedAccountNumber);
    } else {
      // 계좌번호가 없으면 새로 생성하여 세션에 저장
      const accountNumber = generateDepositAccountNumber();
      setDepositAccountNumber(accountNumber);
      sessionStorage.setItem('generatedDepositAccountNumber', accountNumber);
    }
  }, [depositData, navigate]);

  // 비밀번호 확인 함수
  const handleDepositPasswordCheck = () => {
    if (!depositPassword || depositPassword.length !== 4 || depositPassword !== confirmPassword) {
      setIsPasswordValid(false);
    } else {
      setIsPasswordValid(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      alert("비밀번호를 확인해주세요.");
      return;
    }

    // 세션에 필요한 데이터 저장
    sessionStorage.setItem('depositPassword', depositPassword);
    sessionStorage.setItem('productName', depositData.depositName); // 상품명 저장
    sessionStorage.setItem('depositNo', depositData.depositNo); // depositNo 저장

    // 다음 페이지로 이동
    navigate('/DepositChapO2');
  };

  if (!depositData) {
    return <div>적금 상품 정보가 없습니다. 다시 시도해주세요.</div>;
  }

  const { depositName, depositNo } = depositData; // 적금 상품명 및 depositNo 가져오기

  return (
    <div className="auto-transfer-step2-container">
      <h2>{depositName} - 가입페이지</h2> {/* 적금 상품명 표시 */}
      <form onSubmit={handleSubmit}>
        <table className="auto-transfer-step2-table">
          <tbody>
            {/* 적금 계좌번호 */}
            <tr>
              <th>적금계좌번호</th>
              <td>{depositAccountNumber}</td>
            </tr>
            {/* 적금 계좌 비밀번호 */}
            <tr>
              <th>적금계좌비밀번호</th>
              <td>
                <input
                  type="password"
                  value={depositPassword}
                  onChange={(e) => setDepositPassword(e.target.value)}
                  maxLength="4"
                  placeholder="적금 계좌 비밀번호 입력 (4자리)"
                />
              </td>
            </tr>
            {/* 적금 계좌 비밀번호 확인 */}
            <tr>
              <th>적금계좌비밀번호 확인</th>
              <td>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  maxLength="4"
                  placeholder="비밀번호 재입력"
                />
                <button
                  type="button"
                  onClick={handleDepositPasswordCheck}
                  className="auto-transfer-step2-balance-button"
                >
                  확인
                </button>
                {isPasswordValid === false && (
                  <span className="auto-transfer-step2-error-message">비밀번호가 일치하지 않습니다.</span>
                )}
                {isPasswordValid === true && (
                  <span className="auto-transfer-step2-valid-check">✔ 비밀번호 확인 완료</span>
                )}
              </td>
              <td>{depositNo}</td>
            </tr>
          </tbody>
        </table>
        <button type="submit" className="auto-transfer-step2-submit-button">다음</button>
      </form>
    </div>
  );
};

export default DepositchapO1;
