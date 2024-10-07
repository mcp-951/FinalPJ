import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../../../resource/css/account/accountTransfer/AccountTransferConfirmation.css';

const AccountTransferConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // location.state로부터 전달된 상태값들
  const { 
    selectedAccount,  // 선택된 출금 계좌 번호
    selectedBank,     // 선택된 입금 기관
    targetAccountNumber, // 입금 계좌 번호
    transferAmount,    // 이체할 금액
    availableBalance,  // 출금 가능 잔액
    recipientName,     // 수신자 이름
    password           // 비밀번호
  } = location.state || {};

  // 이체 확인 처리 함수
  const handleConfirm = async () => {
    if (availableBalance == null) {
      console.error('잔액 정보가 없습니다.');
      return;
    }

    // 잔액 계산: 이체 후 남은 잔액 계산
    const remainingBalance = availableBalance - parseInt(transferAmount, 10);

    // 서버로 전송할 데이터 확인 (디버깅용 로그)
    console.log({
      fromAccountNumber: selectedAccount,
      toBankName: selectedBank,
      toAccountNumber: targetAccountNumber,
      transferAmount: parseInt(transferAmount, 10),
      password: password, // 이전 페이지에서 받은 비밀번호 사용
    });

    // 이체 처리 API 호출
    try {
      const response = await fetch('http://localhost:8081/uram/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromAccountNumber: selectedAccount,
          toBankName: selectedBank,
          toAccountNumber: targetAccountNumber,
          transferAmount: parseInt(transferAmount, 10),
          password: password, // 비밀번호 전송
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // 이체 완료 후 이체 완료 페이지로 이동
        navigate('/account/transfer-complete', {
          state: {
            selectedAccount,
            selectedBank,
            targetAccountNumber,
            transferAmount,
            remainingBalance,
            recipientName, // 수신자 이름 전달
          },
        });
      } else {
        const errorMessage = await response.text(); // 서버에서 오류 메시지 받아오기
        console.error('이체 요청 실패:', errorMessage);
      }
    } catch (error) {
      console.error('이체 처리 실패:', error);
    }
  };

  // 취소 버튼 클릭 시 메인 페이지로 이동
  const handleCancel = () => {
    navigate('/'); // 메인 페이지로 이동
  };

  return (
    <div className="confirmation-container">
      <h2>계좌이체</h2>
      <p className="confirmation-message">
        {`${recipientName || '수신자'}님께 ${transferAmount.toLocaleString()}원 이체하시겠습니까?`}
      </p>

      <table className="confirmation-table">
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
