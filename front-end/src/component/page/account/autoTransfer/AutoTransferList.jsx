import React, { useState, useEffect } from 'react';
import '../../../../resource/css/account/autoTransfer/AutoTransferList.css';

const AutoTransferList = () => {
  const [autoTransfers, setAutoTransfers] = useState([]); // 자동이체 목록 상태
  const [error, setError] = useState(null); // 에러 상태

  // 로컬 스토리지에서 토큰과 userNo 가져오기
  const token = localStorage.getItem('token');
  const userNo = localStorage.getItem('userNo');

  useEffect(() => {
    fetchAutoTransfers();
  }, []);

  // 자동이체 목록 가져오기
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
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {autoTransfers.map((transfer) => (
              <tr key={transfer.autoTransNo}>
                <td>{transfer.autoTransNo}</td>
                <td>{transfer.accountNo}</td>
                <td>{transfer.receiveAccountNo}</td>
                <td>{transfer.autoSendPrice.toLocaleString()}원</td>
                <td>{new Date(transfer.reservationDate).toLocaleDateString()}</td>
                <td>{transfer.reservationState}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>등록된 자동이체 내역이 없습니다.</p>
      )}
    </div>
  );
};

export default AutoTransferList;
