import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../resource/css/account/autoTransfer/AutoTransferList.css';
import axios from 'axios';

const AutoTransferList = () => {
  const [autoTransfers, setAutoTransfers] = useState([]);
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
        setAutoTransfers(data); // 데이터 설정
      } else if (response.status === 204) {
        setAutoTransfers([]); // 자동이체 내역이 없을 때 빈 배열 설정
      }
    } catch (error) {
      console.error('자동이체 목록 불러오기 실패:', error);
    }
  };

  const handleModifyClick = async (autoTransNo, fromAccountNumber) => {
    try {
      // 24시간 이전인지 확인을 위한 요청
      const response = await axios.get(`http://localhost:8081/uram/auto-transfer/can-cancel/${autoTransNo}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // 24시간 이전이라면 변경 페이지로 이동
        navigate(`/new-transfer-modify/${autoTransNo}`, {
          state: { autoTransNo, fromAccountNumber },
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data); // 백엔드의 오류 메시지를 사용자에게 보여줌 (24시간 이내로 변경 불가 등)
      } else {
        alert('자동이체 변경 가능 여부 확인 중 오류가 발생했습니다.');
      }
    }
  };

  const handleCancelClick = async (autoTransNo, fromAccountNumber) => {
    try {
      // 24시간 이전인지 확인을 위한 요청
      const response = await axios.get(`http://localhost:8081/uram/auto-transfer/can-cancel/${autoTransNo}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // 24시간 이전이라면 비밀번호 확인 페이지로 이동
        navigate(`/auto-transfer-password-check`, {
          state: {
            purpose: 'cancel-transfer',  // 자동이체 해지 목적으로 전달
            autoTransNo,  // 자동이체 번호 전달
            accountNumber: fromAccountNumber,  // 계좌 번호 전달
          },
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data); // 백엔드의 오류 메시지를 사용자에게 보여줌 (24시간 이내로 해지 불가 등)
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
              {/* <th>자동이체 번호</th> 자동이체 번호 헤더 제거 */}
              <th>출금 계좌 번호</th>
              <th>입금 계좌 번호</th>
              <th>입금 계좌주명</th> {/* 예금주명 추가 */}
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
            {autoTransfers.map((transfer) => {
              const fromAccountNumber = transfer.fromAccountDTO?.accountNumber || 'N/A';
              const receiveAccountNumber = transfer.toAccountDTO?.accountNumber || transfer.outAccountDTO?.oAccountNumber || 'N/A';
              const recipientName = transfer.toAccountDTO ? transfer.toAccountDTO.userName : transfer.outAccountDTO?.oUserName || 'N/A';

              return (
                <tr key={transfer.autoTransNo}>
                  {/* 자동이체 번호 열 제거 */}
                  <td>{fromAccountNumber}</td>
                  <td>{receiveAccountNumber}</td>
                  <td>{recipientName}</td> {/* 예금주명 표시 */}
                  <td>{transfer.autoSendPrice.toLocaleString()}원</td>
                  <td>{new Date(transfer.reservationDate).toLocaleDateString()}</td>
                  <td>{new Date(transfer.startDate).toLocaleDateString()}</td>
                  <td>{new Date(transfer.endDate).toLocaleDateString()}</td>
                  <td>{transfer.reservationState}</td>
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
        <p>등록된 자동이체 내역이 없습니다.</p> // 자동이체 내역이 없을 때 표시
      )}
    </div>
  );
};

export default AutoTransferList;
