import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../../../resource/css/account/accountManagement/LimitInquiry.css'; // 스타일 적용

const LimitInquiry = () => {
  const [onceLimit, setOnceLimit] = useState(null);   // 1회 이체한도
  const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  const navigate = useNavigate();
  const location = useLocation();  // 이전 페이지에서 전달된 데이터를 받기 위한 useLocation 사용

  // 전달받은 계좌번호와 계좌명
  const accountNumber = location.state?.accountNumber;
  const productName = location.state?.productName;

  // 로컬 스토리지에서 JWT 토큰과 userNo를 가져오기
  const token = localStorage.getItem("token");
  const userNo = localStorage.getItem("userNo");

  useEffect(() => {
    const token = localStorage.getItem('token');
    // 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [navigate]);

  // 이체 한도 조회 API 호출 함수
  useEffect(() => {
    const fetchLimits = async () => {
      try {
        setIsLoading(true); // 로딩 상태 시작
        const response = await axios.get(`http://localhost:8081/uram/account/detail/${accountNumber}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Authorization 헤더에 JWT 추가
          },
          params: {
            userNo: userNo // userNo를 쿼리 파라미터로 추가
          }
        });

        // 백엔드에서 전달받은 데이터 확인
        setOnceLimit(response.data.accountLimit); // 1회 이체한도 (accountLimit)
        setIsLoading(false); // 로딩 완료
      } catch (error) {
        setIsLoading(false);
        setErrorMessage('이체 한도를 불러오는 중 오류가 발생했습니다.');
        console.error('Error fetching limits: ', error);
      }
    };

    if (accountNumber) {
      fetchLimits();  // 계좌번호가 있으면 이체한도 조회
    }
  }, [accountNumber, userNo, token]);

  const handleLimitChange = () => {
    navigate(`/account/${accountNumber}/limit-change`, { state: { accountNumber, productName } });
  };

  if (isLoading) {
    return <div>로딩 중...</div>; // 로딩 상태 표시
  }

  return (
    <div className="LimitInquiry-container">
      <h2>이체한도 조회</h2>

      {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}

      <table className="LimitInquiry-table">
        <tbody>
          <tr>
            <th>계좌번호</th>
            <td>{accountNumber}</td> {/* 전달된 계좌번호 표시 */}
          </tr>
          <tr>
            <th>계좌명</th>
            <td>{productName}</td> {/* 전달된 계좌명 표시 */}
          </tr>
          <tr>
            <th>1회 이체한도</th>
            <td>{onceLimit !== null ? `${onceLimit.toLocaleString()}원` : '이체 한도를 불러올 수 없습니다.'}</td> {/* 조회한 1회 이체한도 */}
          </tr>
        </tbody>
      </table>

      <div className="LimitInquiry-button-container">
        <button onClick={handleLimitChange} className="LimitInquiry-button">
          이체한도 변경
        </button>
      </div>
    </div>
  );
};

export default LimitInquiry;
