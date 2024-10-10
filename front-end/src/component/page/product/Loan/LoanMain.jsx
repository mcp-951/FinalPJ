import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../resource/css/product/LoanMain.css';

const LoanMain = () => {
    const [product, setProduct] = useState(null);
    const [token, setToken] = useState(null); // 토큰 상태 추가
    const navigate = useNavigate();

    useEffect(() => {
        // sessionStorage에서 선택된 상품 정보 가져오기
        const storedProduct = sessionStorage.getItem('selectedProduct');
        if (storedProduct) {
            setProduct(JSON.parse(storedProduct));
        }

        // localStorage에서 JWT 토큰 가져오기
        const storedToken = localStorage.getItem('token');
        setToken(storedToken); // 토큰을 상태로 저장
    }, []);

    const handleJoinClick = () => {
        if (token) {
            // JWT 토큰이 있는 경우, sessionStorage에 필요한 정보 저장 후 다음 페이지로 이동
            sessionStorage.setItem('productName', product.productName);
            sessionStorage.setItem('productRate', product.productRate);

            // 토큰과 함께 다음 페이지로 이동
            navigate(`/Accession_chap1`);
        } else {
            // JWT 토큰이 없는 경우, 알림창 표시
            alert("로그인하세요.");
        }
    };

    if (!product) {
        return <div>상품 정보가 없습니다.</div>;
    }

    return (
        <div className="loan-main">
            <h1>{product.productName}</h1>
            <p>{product.productContent}</p>
            <strong>연 {product.productRate}%</strong>
            <br />
            <button className="join-button" onClick={handleJoinClick}>가입하기</button>
        </div>
    );
};

export default LoanMain;
