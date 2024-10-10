import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ExchangeResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { message } = location.state || {}; // 전달된 메세지에서 수령일과 지점정보를 받아옴

    useEffect(() => {
        const token = localStorage.getItem("token"); // 토큰 유지
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="exchange-result-container">
            <h1>환전 신청 완료</h1>
            {message ? (
                <p>{message}</p>
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
