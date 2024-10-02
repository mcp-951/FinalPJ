import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import '../../../../resource/css/account/accountManagement/AccountTermination.css'; // 스타일링을 위한 CSS 파일

const AccountTermination = () => {
  const [balance, setBalance] = useState(100000); // 계좌 잔액 (100,000원으로 설정)
  const [isVerified, setIsVerified] = useState(false); // 휴대폰 인증 여부
  const [showConfirmation, setShowConfirmation] = useState(false); // 해지 확인 모달 여부
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

  const handleTransferClick = () => {
    // 이체 처리 로직 (여기서는 간단한 알림만 표시)
    alert('이체 페이지로 이동합니다.');
  };

  const handleVerifyClick = () => {
    setIsVerified(true); // 휴대폰 인증 완료 처리
  };

  const handleTerminateClick = () => {
    // 해지 버튼을 눌렀을 때 해지 확인 모달을 보여줌
    setShowConfirmation(true);
  };

  const handleConfirmClick = () => {
    // 해지 확인 후 처리 로직
    alert('계좌가 해지되었습니다.');
    setShowConfirmation(false); // 모달 닫기
    
    // 계좌 해지 후 메인 페이지로 이동
    navigate('/');
  };

  return (
    <div className="termination-container">
      <h2>계좌 해지</h2>
      <table className="termination-table">
        <tbody>
          <tr>
            <td>해지 계좌번호</td>
            <td>xxx-xx-xxxxxx</td>
          </tr>
          <tr>
            <td>계좌명</td>
            <td>xxxxxxxx</td>
          </tr>
          <tr>
            <td>잔액</td>
            <td>
              {balance.toLocaleString()}원
              {balance > 0 && (
                <span className="balance-warning">
                  잔액이 0원이 아닙니다
                  <button onClick={handleTransferClick} className="transfer-button">
                    이체하기
                  </button>
                </span>
              )}
            </td>
          </tr>
          <tr>
            <td>휴대폰 인증</td>
            <td>
              <button onClick={handleVerifyClick} className="verify-button">
                인증하기
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {isVerified && (
        <button onClick={handleTerminateClick} className="terminate-button">
          해지
        </button>
      )}

      {showConfirmation && (
        <div className="confirmation-modal">
          <p>계좌를 정말 해지하시겠습니까?</p>
          <button onClick={handleConfirmClick} className="confirm-button">
            확인
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountTermination;
