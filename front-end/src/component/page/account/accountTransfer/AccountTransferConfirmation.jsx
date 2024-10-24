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
        const response = await axios.get('http://13.125.114.85:8081/uram/recipient-name', {
          params: {
            accountNumber: targetAccountNumber,
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
  
    const remainingBalance = availableBalance - parseInt(transferAmount, 10);

    try {
      const response = await axios.post(
        'http://13.125.114.85:8081/uram/transfer',
        {
          fromAccountNumber: selectedAccount,
          toBankName: selectedBank,
          toAccountNumber: targetAccountNumber,
          transferAmount: transferAmount,
          password: password,
          userNo: userNo,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.status === 200) {
        navigate('/account/transfer-complete', {
          state: {
            selectedAccount,
            selectedBank,
            targetAccountNumber,
            transferAmount,
            remainingBalance,
            recipientName,
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

  const handleCancel = () => {
    navigate('/'); // 메인 페이지로 이동
  };

  return (
    <div className="AccountTransferConfirmation-container">
      <h2>계좌이체</h2>
      <p className="AccountTransferConfirmation-message">
        {`${recipientName || '수신자'}님께 ${transferAmount.toLocaleString()}원 이체하시겠습니까?`}
      </p>

      <table className="AccountTransferConfirmation-table">
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
            <td>{recipientName || '정보 없음'}</td>
          </tr>
        </tbody>
      </table>

      <div className="AccountTransferConfirmation-buttons">
        <button className="AccountTransferConfirmation-confirm-button" onClick={handleConfirm}>
          확인
        </button>
        <button className="AccountTransferConfirmation-cancel-button" onClick={handleCancel}>
          취소
        </button>
      </div>
    </div>
  );
};

export default AccountTransferConfirmation;
