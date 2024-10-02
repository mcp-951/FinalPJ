import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../../../resource/css/account/accountTransfer/AccountTransferComplete.css'; // CSS 파일

const AccountTransferComplete = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedAccount, selectedBank, targetAccountNumber, transferAmount, remainingBalance, recipientName } = location.state; // 은행명 추가

  const handleRetry = () => {
    // 이체 다시하기 버튼 클릭 시 이체 입력 페이지로 이동
    navigate('/account/transfer');
  };

  const handleGoToAccountList = () => {
    // 목록 버튼 클릭 시 전체 계좌 조회 페이지로 이동
    navigate('/account');
  };

  return (
    <div className="transfer-complete-container">
      <h2>계좌이체 완료</h2>
      <p>즉시 이체가 완료되었습니다.</p>
      <p>타행계좌로의 이체는 해당 은행의 사정에 따라 입금이 다소 지연될 수 있습니다.</p>

      {/* 이체 결과 테이블 */}
      <table className="transfer-result-table">
        <thead>
          <tr>
            <th>No</th>
            <th>출금계좌번호</th>
            <th>입금기관</th> {/* 은행명 추가 */}
            <th>입금계좌번호</th>
            <th>이체금액(원)</th>
            <th>받는 분 예금주명</th>
            <th>결과</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>{selectedAccount}</td>
            <td>{selectedBank}</td> {/* 은행명 */}
            <td>{targetAccountNumber}</td>
            <td>{transferAmount.toLocaleString()}원</td>
            <td>{recipientName}</td>
            <td>정상</td>
          </tr>
        </tbody>
      </table>

      {/* 이체 후 잔액 표시 */}
      <p className="remaining-balance">이체 후 잔액: {remainingBalance.toLocaleString()}원</p>

      {/* 버튼 섹션 */}
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
