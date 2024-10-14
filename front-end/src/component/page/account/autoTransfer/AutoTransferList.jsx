import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../resource/css/account/autoTransfer/AutoTransferList.css';

const AutoTransferList = () => {
  const [autoTransfers, setAutoTransfers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 로그인 확인 추가 부분
  useEffect(() => {
    const token = localStorage.getItem('token'); // 토큰 확인
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login'); // 로그인 페이지로 리다이렉트
    }
  }, [navigate]);
  
  const token = localStorage.getItem('token');
  const userNo = localStorage.getItem('userNo');

  useEffect(() => {
    fetchAutoTransfers();
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
        setAutoTransfers(data);
      } else {
        setError('자동이체 내역을 불러오는 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setError('자동이체 내역을 불러오는 중 오류가 발생했습니다.');
      console.error('자동이체 목록 불러오기 실패:', error);
    }
  };

  const handleModifyClick = (autoTransNo, fromAccountNumber) => {
    navigate(`/new-transfer-modify/${autoTransNo}`, {
      state: { autoTransNo, fromAccountNumber },
    });
  };

  const handleCancelClick = (autoTransNo, fromAccountNumber) => {
    // 비밀번호 확인 페이지로 이동
    navigate(`/auto-transfer-password-check`, {
      state: {
        purpose: 'cancel-transfer',  // 자동이체 해지 목적으로 전달
        autoTransNo,  // 자동이체 번호 전달
        accountNumber: fromAccountNumber,  // 계좌 번호 전달
      },
    });
  };

  return (
    <div className="auto-transfer-list-container">
      <h2>자동이체 내역</h2>
      {error && <p className="error-message">{error}</p>}
      {autoTransfers.length > 0 ? (
        <table className="auto-transfer-list-table">
          <thead>
            <tr>
              <th>자동이체 번호</th>
              <th>출금 계좌 번호</th>
              <th>입금 계좌 번호</th>
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

              return (
                <tr key={transfer.autoTransNo}>
                  <td>{transfer.autoTransNo}</td>
                  <td>{fromAccountNumber !== -1 ? fromAccountNumber : 'N/A'}</td>
                  <td>{receiveAccountNumber !== -1 ? receiveAccountNumber : 'N/A'}</td>
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
