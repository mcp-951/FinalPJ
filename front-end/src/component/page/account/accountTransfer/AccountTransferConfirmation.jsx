import React, { useState, useEffect } from 'react';
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
    selectedAccount,
    selectedBank,
    targetAccountNumber,
    transferAmount,
    availableBalance,
    password,
  } = location.state || {};

  const [recipientName, setRecipientName] = useState(null); // 수신자 이름 상태

  useEffect(() => {
    const token = localStorage.getItem('token');
    // 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    // 수신자 이름을 가져오는 API 호출
    const fetchRecipientName = async () => {
      try {
        const response = await axios.get('http://localhost:8081/uram/recipient-name', {
          params: {
            accountNumber: targetAccountNumber, // String 타입
            bankName: selectedBank,
          },
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.status === 200) {
          setRecipientName(response.data.recipientName);
        } else {
          setRecipientName('정보 없음');
        }
      } catch (error) {
        console.error('수신자 이름 불러오기 실패:', error);
        setRecipientName('정보 없음');
      }
    };

    fetchRecipientName();
  }, [targetAccountNumber, selectedBank, token]);

  const handleConfirm = async () => {
    if (availableBalance == null) {
      console.error('잔액 정보가 없습니다.');
      return;
    }
  
    // 잔액 계산: 이체 후 남은 잔액 계산
    const remainingBalance = availableBalance - parseInt(transferAmount, 10);
  
    // 서버로 전송할 데이터 확인 (디버깅용 로그)
    console.log('전송할 데이터:', {
      fromAccountNumber: selectedAccount, // String 타입
      toBankName: selectedBank,
      toAccountNumber: targetAccountNumber, // String 타입
      transferAmount: transferAmount, // String 그대로 사용
      password: password, // String 타입
      userNo: userNo, // String 타입
    });
  
    // 이체 처리 API 호출
    try {
      const response = await axios.post(
        'http://localhost:8081/uram/transfer',
        {
          fromAccountNumber: selectedAccount, // String 타입 유지
          toBankName: selectedBank,
          toAccountNumber: targetAccountNumber, // String 타입 유지
          transferAmount: transferAmount, // String 타입
          password: password, // String 타입으로 전송
          userNo: userNo, // String 타입으로 전송
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
