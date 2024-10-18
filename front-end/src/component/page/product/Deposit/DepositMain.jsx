import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../resource/css/product/DepositMain.css'; // 스타일시트 경로 수정

const DepositMain = () => {
    const [deposit, setDeposit] = useState(null);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // sessionStorage에서 선택된 적금 상품 정보 가져오기
        const storedDeposit = sessionStorage.getItem('selectedDeposit'); // selectedDeposit로 변경
        if (storedDeposit) {
            setDeposit(JSON.parse(storedDeposit));
        }

        // localStorage에서 JWT 토큰 가져오기
        const storedToken = localStorage.getItem('token');
        setToken(storedToken); // 토큰을 상태로 저장
    }, []);

    const handleJoinClick = () => {
        if (token) {
            // JWT 토큰이 있는 경우, sessionStorage에 필요한 정보 저장 후 다음 페이지로 이동
            sessionStorage.setItem(
                'selectedDeposit',
                JSON.stringify({ 
                    depositName: deposit.depositName, 
                    depositContent: deposit.depositContent, 
                    depositRate: deposit.depositRate, 
                    depositCategory: deposit.depositCategory, 
                    depositNo: deposit.depositNo
                })
            );

            // depositCategory에 따라 이동할 페이지 결정
            if (deposit.depositCategory === 1 || deposit.depositCategory === 2) {
                navigate('/DepositchapO1'); // 카테고리가 1 또는 2인 경우
            } else {
                navigate('/Depositchap1'); // 그 외의 경우
            }
        } else {
            // JWT 토큰이 없는 경우, 알림창 표시
            alert("로그인하세요.");
        }
    };

    if (!deposit) {
        return <div>적금 상품 정보가 없습니다.</div>;
    }

    return (
        <div className="deposit-main">
            <h1>{deposit.depositName}</h1>
            <p>{deposit.depositContent}</p>
            <strong>연 {deposit.depositRate}%</strong>
            <br />
            <button className="join-button" onClick={handleJoinClick}>가입하기</button>
        </div>
    );
};

export default DepositMain;
