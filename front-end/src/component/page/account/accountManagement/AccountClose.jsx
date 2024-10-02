import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 사용
import '../../../../resource/css/account/accountManagement/AccountClose.css';

const AccountClose = () => {
  const [balance, setBalance] = useState(0); // 잔액 예시
  const [isVerified, setIsVerified] = useState(false); // 휴대폰 인증 여부
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  // 잔액 이체 클릭 시 처리
  const handleTransfer = () => {
    navigate('/account/transfer'); // 이체 페이지로 이동
  };

  // 휴대폰 인증 처리
  const handlePhoneVerification = () => {
    setIsVerified(true);
    alert('휴대폰 인증이 완료되었습니다.');
  };

  // 계좌 해지 버튼 클릭 시 처리
  const handleAccountClose = () => {
    if (balance === 0) {
      // 계좌 해지 여부를 알림창으로 묻고 확인 시 처리
      if (window.confirm('계좌를 정말 해지하시겠습니까?')) {
        confirmClose();
      }
    } else {
      alert('잔액이 남아 있습니다. 먼저 잔액을 이체해주세요.');
    }
  };

  // 계좌 해지 확인 후 처리
  const confirmClose = () => {
    alert('계좌가 성공적으로 해지되었습니다.');
    
    // 계좌 해지 후 메인 페이지로 이동
    navigate('/');
  };

  return (
    <div className="account-close-container">
      <h2>계좌 해지</h2>
      <table className="account-info-table">
        <tbody>
          <tr>
            <th>해지 계좌번호</th>
            <td>xxx-xx-xxxxxx</td>
          </tr>
          <tr>
            <th>계좌명</th>
            <td>xxxxxxxx</td>
          </tr>
          <tr>
            <th>잔액</th>
            <td>
              <div className="balance-section">
                {balance.toLocaleString()}원
                {/* 잔액이 0원보다 클 때만 경고 메시지와 이체 버튼 표시 */}
                {balance > 0 && (
                  <>
                    <span className="balance-warning">잔액이 0원이 아닙니다.</span>
                    <button onClick={handleTransfer} className="transfer-button">
                      이체하기
                    </button>
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

      {/* 계좌 해지 버튼 */}
      <div className="close-button-container">
        <button
          onClick={handleAccountClose}
          className="close-button"
          disabled={!isVerified}
        >
          해지
        </button>
      </div>

      {/* 모달은 별도로 구성하지 않음 */}
    </div>
  );
};

export default AccountClose;
