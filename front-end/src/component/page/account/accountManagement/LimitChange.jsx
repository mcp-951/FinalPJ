import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // 서버 요청을 위한 axios 추가
import '../../../../resource/css/account/accountManagement/LimitChange.css'; // CSS 파일

const LimitChange = () => {
  const [newDailyLimit, setNewDailyLimit] = useState(''); // 1일 이체한도
  const [newOnceLimit, setNewOnceLimit] = useState(''); // 1회 이체한도
  const [currentDailyLimit, setCurrentDailyLimit] = useState(null); // 현재 1일 이체한도
  const [currentOnceLimit, setCurrentOnceLimit] = useState(null); // 현재 1회 이체한도
  const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅
  const location = useLocation();  // LimitInquiry에서 전달된 계좌정보를 받기 위한 useLocation 사용

  // LimitInquiry에서 전달된 accountNumber와 productName (화면에 표시되지 않음)
  const { accountNumber, productName } = location.state || {};

  // 이체 한도 정보를 받아오는 함수
  const fetchLimits = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/uram/account/${accountNumber}`);
      setCurrentDailyLimit(response.data.accountMax);  // 1일 이체한도 설정
      setCurrentOnceLimit(response.data.accountLimit); // 1회 이체한도 설정
    } catch (error) {
      setErrorMessage('이체 한도 정보를 불러오는 중 오류가 발생했습니다.');
      console.error('Error fetching limits: ', error);
    }
  };

  useEffect(() => {
    // 컴포넌트가 마운트되면 현재 이체한도 데이터를 불러옴
    fetchLimits();
  }, [accountNumber]);

  const handleLimitChange = async () => {
    if (!newDailyLimit || !newOnceLimit) {
      setErrorMessage('모든 한도 값을 입력해주세요.');
      return;
    }
  
    if (parseInt(newOnceLimit, 10) > parseInt(newDailyLimit, 10)) {
      setErrorMessage('1회 이체한도가 1일 이체한도보다 클 수 없습니다.');
      return;
    }
  
    try {
      const response = await axios.post(`http://localhost:8081/uram/account/${accountNumber}/change-limits`, {
        dailyLimit: parseInt(newDailyLimit, 10),
        onceLimit: parseInt(newOnceLimit, 10),
      });
  
      if (response.status === 200) {
        alert('이체 한도가 성공적으로 변경되었습니다.');
        navigate('/'); // 성공 후 메인 페이지로 이동
      } else {
        setErrorMessage('이체 한도 변경에 실패했습니다.');
      }
    } catch (error) {
      setErrorMessage('이체 한도 변경 중 오류가 발생했습니다.');
      console.error(error);
    }
  };
  

  return (
    <div className="limit-change-container">
      <h2>이체한도 변경</h2>
      <p>1일 및 1회 이체한도를 확인하시고 변경할 1일 및 1회 이체한도를 입력해주세요</p>
      
      {/* 오류 메시지 출력 */}
      {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}

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
            <td>{currentDailyLimit !== null ? `${currentDailyLimit.toLocaleString()}원` : '로딩 중...'}</td>
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
            <td>{currentOnceLimit !== null ? `${currentOnceLimit.toLocaleString()}원` : '로딩 중...'}</td>
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
