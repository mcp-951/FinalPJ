import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import '../../../../resource/css/product/DepositJoinFinish.css';

const CompletePage = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const token = localStorage.getItem('token');
    // 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [navigate]);

  const goToDepositSearch = () => {
    navigate('/DepositSearch'); // DepositSearch 페이지로 이동
  };

  return (
    <div className="complete-page">
      <div className="complete-container">
        <h1>가입 완료</h1>
        <p>가입이 성공적으로 완료되었습니다.</p>
        <p className="info-text">
          *가입 내역 확인은 <span className="highlight">예적금</span> &gt; <span className="highlight">예적금목록</span>에서 가능합니다.
        </p>
        <button className="login-button" onClick={goToDepositSearch}>
          예적금 목록으로 바로가기
        </button>
      </div>
    </div>
  );
};

export default CompletePage;
