import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 사용
import '../../../../resource/css/account/accountManagement/LimitChange.css'; // CSS 파일

const LimitChange = () => {
  const [newDailyLimit, setNewDailyLimit] = useState(''); // 1일 이체한도
  const [newOnceLimit, setNewOnceLimit] = useState(''); // 1회 이체한도
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  const currentDailyLimit = 10000000; // 현재 1일 이체한도
  const currentOnceLimit = 5000000; // 현재 1회 이체한도

  const handleLimitChange = () => {
    if (window.confirm('이체 한도를 변경하시겠습니까?')) {
      alert('이체 한도가 성공적으로 변경되었습니다.');

      // 이체 한도 변경 처리 후 메인 페이지로 이동
      navigate('/');
    }
  };

  return (
    <div className="limit-change-container">
      <h2>이체한도 변경</h2>
      <p>1일 및 1회 이체한도를 확인하시고 변경할 1일 및 1회 이체한도를 입력해주세요</p>

      <table className="limit-change-table">
        <thead>
          <tr>
            <th></th>
            <th>변경 전</th>
            <th>변경 후</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>1일 이체한도</th>
            <td>{currentDailyLimit.toLocaleString()}원</td>
            <td>
              <input
                type="text"
                value={newDailyLimit}
                onChange={(e) => setNewDailyLimit(e.target.value)}
                placeholder="입력칸"
              />
              원
            </td>
          </tr>
          <tr>
            <th>1회 이체한도</th>
            <td>{currentOnceLimit.toLocaleString()}원</td>
            <td>
              <input
                type="text"
                value={newOnceLimit}
                onChange={(e) => setNewOnceLimit(e.target.value)}
                placeholder="입력칸"
              />
              원
            </td>
          </tr>
        </tbody>
      </table>

      <div className="limit-change-button-container">
        <button onClick={handleLimitChange} className="limit-change-button">
          변경
        </button>
      </div>
    </div>
  );
};

export default LimitChange;
