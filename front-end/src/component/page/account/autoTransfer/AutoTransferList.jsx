import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../resource/css/account/autoTransfer/AutoTransferList.css';

const AutoTransferList = () => {
  const [autoTransfers, setAutoTransfers] = useState([]); // 자동이체 내역 상태
  const [error, setError] = useState(null); // 에러 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이트

  // 로그인 확인: 토큰 없으면 로그인 페이지로 이동
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [navigate]);

  const token = localStorage.getItem('token'); // 토큰
  const userNo = localStorage.getItem('userNo'); // 사용자 번호

  useEffect(() => {
    fetchAutoTransfers(); // 컴포넌트가 마운트될 때 자동이체 내역 조회
  }, []);

  useEffect(() => {
    fetchAutoTransfers(); // 컴포넌트가 마운트될 때 자동이체 내역 조회
  }, []);
  
  const fetchAutoTransfers = async () => {
    try {
      const response = await fetch(`http://localhost:8081/uram/auto-transfer/list?userNo=${userNo}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("자동이체 목록:", data); // 데이터 콘솔에 출력
        setAutoTransfers(data); // 데이터 설정
      } else {
        setError('자동이체 내역을 불러오는 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setError('자동이체 내역을 불러오는 중 오류가 발생했습니다.');
      console.error('자동이체 목록 불러오기 실패:', error);
    }
  };
  

  // 수정 버튼 클릭 핸들러
  const handleModifyClick = (autoTransNo, fromAccountNumber) => {
    navigate(`/new-transfer-modify/${autoTransNo}`, {
      state: { autoTransNo, fromAccountNumber },
    });
  };

  // 해지 버튼 클릭 핸들러
  const handleCancelClick = (autoTransNo, fromAccountNumber) => {
    navigate(`/auto-transfer-password-check`, {
      state: {
        purpose: 'cancel-transfer', // 자동이체 해지 목적
        autoTransNo, // 자동이체 번호
        accountNumber: fromAccountNumber, // 출금 계좌 번호
      },
    });
  };

  return (
    <div className="auto-transfer-list-container">
      <h2>자동이체 내역</h2>
      {error && <p className="error-message">{error}</p>} {/* 에러 메시지 표시 */}
      {autoTransfers.length > 0 ? (
        <table className="auto-transfer-list-table">
          <thead>
            <tr>
              <th>자동이체 번호</th>
              <th>출금 계좌 번호</th>
              <th>입금 계좌 번호</th>
              <th>입금 계좌주명</th> {/* 계좌주명 컬럼 추가 */}
              <th>이체 금액</th>
              <th>예약 날짜</th>
              <th>자동이체 시작일</th>
              <th>자동이체 종료일</th>
              <th>상태</th>
              <th>변경</th>
              <th>해지</th>
            </tr>
          </thead>
          <tbody>
            {autoTransfers.map((transferData) => {
              const transfer = transferData.autoTransfer;
              const fromAccountNumber = transferData.fromAccountNumber;
              const receiveAccountNumber = transferData.receiveAccountNumber;
              const recipientName = transferData.recipientName; // 계좌주명 가져오기

              return (
                <tr key={transfer.autoTransNo}>
                  <td>{transfer.autoTransNo}</td>
                  <td>{fromAccountNumber !== -1 ? fromAccountNumber : 'N/A'}</td>
                  <td>{receiveAccountNumber !== -1 ? receiveAccountNumber : 'N/A'}</td>
                  <td>{recipientName ? recipientName : 'N/A'}</td> {/* 계좌주명 표시 */}
                  <td>{transfer.autoSendPrice ? transfer.autoSendPrice.toLocaleString() : 'N/A'}원</td>
                  <td>{transfer.reservationDate ? new Date(transfer.reservationDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{transfer.startDate ? new Date(transfer.startDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{transfer.endDate ? new Date(transfer.endDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{transfer.reservationState || 'N/A'}</td>
                  <td>
                    <button
                      onClick={() => handleModifyClick(transfer.autoTransNo, fromAccountNumber)}
                      className="modify-button"
                    >
                      변경
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleCancelClick(transfer.autoTransNo, fromAccountNumber)} className="cancel-button">
                      해지
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>등록된 자동이체 내역이 없습니다.</p>
      )}
    </div>
  );
};

export default AutoTransferList;
