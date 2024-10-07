import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ExchangeResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { date, branch } = location.state || {}; // 선택한 날짜와 지점을 가져옴

    return (
        <div className="exchange-result-container">
            <h1>환전 신청 완료</h1>
            {date && branch ? (
                <p>{date}에 {branch}에서 수령 가능합니다.</p>
            ) : (
                <p>선택한 정보가 없습니다.</p>
            )}
            <button onClick={() => navigate('/exchange-rate')} className="main-button">
                메인으로
            </button>
        </div>
    );
};

export default ExchangeResult;