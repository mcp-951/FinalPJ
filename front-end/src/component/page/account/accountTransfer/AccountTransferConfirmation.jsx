import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../../../resource/css/account/accountTransfer/AccountTransferConfirmation.css'; // CSS 파일

const AccountTransferConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedAccount, selectedBank, targetAccountNumber, transferAmount, availableBalance, recipientName } = location.state; // 예금주명 및 은행명 추가

  const handleConfirm = () => {
    // 이체 후 잔액 계산
    const remainingBalance = availableBalance - parseInt(transferAmount);

    // 이체 완료 페이지로 이동 및 데이터 전달
    navigate('/account/transfer-complete', {
      state: {
        selectedAccount,
        selectedBank,
        targetAccountNumber,
        transferAmount,
        remainingBalance,
        recipientName, // 예금주명도 전달
      },
    });
  };

  const handleCancel = () => {
    // 취소 시 메인 페이지로 이동
    navigate('/');
  };

  return (
    <div className="confirmation-container">
      <h2>계좌이체</h2>
      <p className="confirmation-message">{`${recipientName}님께 ${transferAmount.toLocaleString()}원 이체하시겠습니까?`}</p>

      {/* 설명 문구 */}
      <div className="confirmation-explanation">
        <ul>
          <li>고객님께서 입력하신 입금 은행, 입금계좌번호, 이체 금액 및 받는 분을 다시 한번 확인하세요.</li>
          <li>메신저 또는 문자로 송금을 요구받은 경우에는 반드시 사실관계 확인 후 이체하시기 바랍니다.</li>
        </ul>
      </div>

      {/* 이체 정보 테이블 */}
      <table className="confirmation-table">
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
            <td>{recipientName}</td> {/* 전달받은 예금주명 사용 */}
            <td>정상</td>
          </tr>
        </tbody>
      </table>

      {/* 버튼 섹션 */}
      <div className="confirmation-buttons">
        <button className="confirm-button" onClick={handleConfirm}>
          확인
        </button>
        <button className="cancel-button" onClick={handleCancel}>
          취소
        </button>
      </div>
    </div>
  );
};

export default AccountTransferConfirmation;
