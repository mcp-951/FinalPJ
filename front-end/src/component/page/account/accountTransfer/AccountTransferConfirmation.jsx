import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../../resource/css/account/accountTransfer/AccountTransferConfirmation.css';

const AccountTransferConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 로컬 스토리지에서 JWT 토큰과 userNo 가져오기
  const token = localStorage.getItem("token");
  const userNo = localStorage.getItem("userNo");

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

  const handleConfirm = async () => {
    if (availableBalance == null) {
      console.error('잔액 정보가 없습니다.');
      return;
    }
  
    // 잔액 계산: 이체 후 남은 잔액 계산
    const remainingBalance = availableBalance - parseInt(transferAmount, 10);
  
    // 서버로 전송할 데이터 확인 (디버깅용 로그)
    console.log('전송할 데이터:', {
      fromAccountNumber: parseInt(selectedAccount, 10),
      toBankName: selectedBank,
      toAccountNumber: parseInt(targetAccountNumber, 10),
      transferAmount: parseInt(transferAmount, 10),
      password: parseInt(password, 10),
      userNo: parseInt(userNo, 10),
    });
  
    // 이체 처리 API 호출
    try {
      const response = await axios.post(
        'http://localhost:8081/uram/transfer',
        {
          fromAccountNumber: parseInt(selectedAccount, 10),
          toBankName: selectedBank,
          toAccountNumber: parseInt(targetAccountNumber, 10),
          transferAmount: parseInt(transferAmount, 10),
          password: parseInt(password, 10), // 비밀번호 전송
          userNo: parseInt(userNo, 10), // userNo 전송
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.status === 200) {
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
        const errorMessage = response.data.message || '이체 요청 실패';
        console.error('이체 요청 실패:', errorMessage);
      }
    } catch (error) {
      console.error('이체 처리 실패:', error);
      if (error.response && error.response.data) {
        console.error('서버 오류 메시지:', error.response.data);
      }
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
