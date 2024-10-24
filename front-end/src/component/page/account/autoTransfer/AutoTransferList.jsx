import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../resource/css/account/autoTransfer/AutoTransferList.css';
import axios from 'axios';

const AutoTransferList = () => {
  const [autoTransfers, setAutoTransfers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
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
      } else if (response.status === 204) {
        setAutoTransfers([]);
      }
    } catch (error) {
      console.error('자동이체 목록 불러오기 실패:', error);
    }
  };

  const handleModifyClick = async (autoTransNo, fromAccountNumber) => {
    try {
      const response = await axios.get(`http://localhost:8081/uram/auto-transfer/can-cancel/${autoTransNo}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        navigate(`/new-transfer-modify/${autoTransNo}`, {
          state: { autoTransNo, fromAccountNumber },
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data);
      } else {
        alert('자동이체 변경 가능 여부 확인 중 오류가 발생했습니다.');
      }
    }
  };

  const handleCancelClick = async (autoTransNo, fromAccountNumber) => {
    try {
      const response = await axios.get(`http://localhost:8081/uram/auto-transfer/can-cancel/${autoTransNo}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        navigate(`/auto-transfer-password-check`, {
          state: {
            purpose: 'cancel-transfer',
            autoTransNo,
            accountNumber: fromAccountNumber,
          },
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data);
      } else {
        alert('자동이체 해지 가능 여부 확인 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="AutoTransferList-container">
      <h2>자동이체 내역</h2>
      {autoTransfers.length > 0 ? (
        <table className="AutoTransferList-table">
          <thead>
            <tr>
              <th>자동이체 번호</th>
              <th>출금 계좌 번호</th>
              <th>입금 계좌 번호</th>
              <th>입금 계좌주명</th>
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
              const recipientName = transferData.recipientName;

              return (
                <tr key={transfer.autoTransNo}>
                  <td>{transfer.autoTransNo}</td>
                  <td>{fromAccountNumber || 'N/A'}</td>
                  <td>{receiveAccountNumber || 'N/A'}</td>
                  <td>{recipientName || 'N/A'}</td>
                  <td>{transfer.autoSendPrice ? transfer.autoSendPrice.toLocaleString() : 'N/A'}원</td>
                  <td>{transfer.reservationDate ? new Date(transfer.reservationDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{transfer.startDate ? new Date(transfer.startDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{transfer.endDate ? new Date(transfer.endDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{transfer.reservationState || 'N/A'}</td>
                  <td>
                    <button
                      onClick={() => handleModifyClick(transfer.autoTransNo, fromAccountNumber)}
                      className="AutoTransferList-modify-button"
                    >
                      변경
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleCancelClick(transfer.autoTransNo, fromAccountNumber)} className="AutoTransferList-cancel-button">
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
