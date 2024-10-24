import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // 서버 요청을 위한 axios 추가
import '../../../../resource/css/account/accountManagement/LimitChange.css'; // CSS 파일

const LimitChange = () => {
  const [newOnceLimit, setNewOnceLimit] = useState(''); // 1회 이체한도
  const [currentOnceLimit, setCurrentOnceLimit] = useState(null); // 현재 1회 이체한도
  const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅
  const location = useLocation();  // LimitInquiry에서 전달된 계좌정보를 받기 위한 useLocation 사용

  // LimitInquiry에서 전달된 accountNumber와 productName (화면에 표시되지 않음)
  const { accountNumber, productName } = location.state || {};

  // 로컬 스토리지에서 JWT 토큰과 userNo를 가져오기
  const token = localStorage.getItem("token");
  const userNo = localStorage.getItem("userNo");

  // 이체 한도 정보를 받아오는 함수
  const fetchLimits = async () => {
    try {
      const response = await axios.get(`http://13.125.114.85:8081/uram/account/detail/${accountNumber}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Authorization 헤더에 JWT 추가
        },
        params: {
          userNo: userNo // userNo를 쿼리 파라미터로 추가
        }
      });
      setCurrentOnceLimit(response.data.accountLimit); // 1회 이체한도 설정
    } catch (error) {
      setErrorMessage('이체 한도 정보를 불러오는 중 오류가 발생했습니다.');
      console.error('Error fetching limits: ', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    // 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    // 컴포넌트가 마운트되면 현재 이체한도 데이터를 불러옴
    if (accountNumber) {
      fetchLimits();
    }
  }, [accountNumber, userNo, token]);

  const handleLimitChange = async () => {
    if (!newOnceLimit) {
      setErrorMessage('변경할 한도 값을 입력해주세요.');
      return;
    }
  
    try {
      const response = await axios.post(
        `http://13.125.114.85:8081/uram/account/${accountNumber}/change-limit`,
        {
          onceLimit: parseInt(newOnceLimit, 10), // 새로운 1회 이체한도
          userNo: userNo // userNo를 요청 본문에 포함
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Authorization 헤더에 JWT 추가
          },
        }
      );
  
      if (response.status === 200) {
        alert('이체 한도가 성공적으로 변경되었습니다.');
        navigate('/'); // 성공 후 메인 페이지로 이동
      } else {
        setErrorMessage('이체 한도 변경에 실패했습니다.');
      }
    } catch (error) {
      setErrorMessage('이체 한도 변경 중 오류가 발생했습니다.');
      console.error('Error during limit change:', error);
    }
  };

  return (
    <div className="LimitChange-container">
      <h2>이체한도 변경</h2>
      <p>1회 이체한도를 확인하시고 변경할 이체한도를 입력해주세요</p>
      
      {/* 오류 메시지 출력 */}
      {errorMessage && <p className="LimitChange-error-message">{errorMessage}</p>}

      <table className="LimitChange-table">
        <thead>
          <tr>
            <th></th>
            <th>변경 전</th>
            <th>변경 후</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>1회 이체한도</th>
            <td>{currentOnceLimit !== null ? `${currentOnceLimit.toLocaleString()}원` : '로딩 중...'}</td>
            <td>
              <input
                type="text"
                value={newOnceLimit}
                onChange={(e) => setNewOnceLimit(e.target.value)}
                placeholder="입력칸"/>원
            </td>
          </tr>
        </tbody>
      </table>

      <div className="LimitChange-button-container">
        <button onClick={handleLimitChange} className="LimitChange-button">
          변경
        </button>
      </div>
    </div>
  );
};

export default LimitChange;
