import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../../resource/css/account/accountTransfer/AccountTransferComplete.css';

const AccountTransferComplete = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 로컬 스토리지에서 JWT 토큰과 userNo 가져오기
  const token = localStorage.getItem("token");
  const userNo = localStorage.getItem("userNo");

  // location.state로부터 전달된 상태값들
  const { 
    selectedAccount, 
    selectedBank, 
    targetAccountNumber, 
    transferAmount, 
    remainingBalance, 
    recipientName 
  } = location.state || {};

  const handleRetry = () => {
    navigate('/account/transfer');
  };

  const handleGoToAccountList = () => {
    navigate('/account');
  };

  return (
    <div className="transfer-complete-container">
      <h2>계좌이체 완료</h2>
      <p>즉시 이체가 완료되었습니다.</p>
      <p>타행계좌로의 이체는 해당 은행의 사정에 따라 입금이 다소 지연될 수 있습니다.</p>

      <table className="transfer-result-table">
        <thead>
          <tr>
            <th>No</th>
            <th>출금계좌번호</th>
            <th>입금기관</th>
            <th>입금계좌번호</th>
            <th>이체금액(원)</th>
            <th>받는 분 예금주명</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>{selectedAccount}</td>
            <td>{selectedBank}</td>
            <td>{targetAccountNumber}</td>
            <td>{transferAmount.toLocaleString()}원</td>
            <td>{recipientName || '정보 없음'}</td> {/* 수신자 이름 출력 */}
          </tr>
        </tbody>
      </table>

      <p className="remaining-balance">이체 후 잔액: {remainingBalance.toLocaleString()}원</p>

      <div className="transfer-complete-buttons">
        <button className="retry-button" onClick={handleRetry}>
          이체 다시하기
        </button>
        <button className="list-button" onClick={handleGoToAccountList}>
          목록
        </button>
      </div>
    </div>
  );
};

export default AccountTransferComplete;
