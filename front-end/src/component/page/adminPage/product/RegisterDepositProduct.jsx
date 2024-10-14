import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar'; // Sidebar 추가
import '../../../../resource/css/admin/DepositProduct.css'; // CSS 파일 추가

const RegisterDepositProduct = () => {
  const navigate = useNavigate();

  const [productName, setProductName] = useState('');
  const [productCategory] = useState('적금'); // 적금으로 고정
  const [productRate, setProductRate] = useState('');
  const [productPeriod, setProductPeriod] = useState('');
  const [productContent, setProductContent] = useState('');
  const [productIMG, setProductIMG] = useState('');
  const [repaymentType, setRepaymentType] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:8080/product/add', {
        productName,
        productCategory, // 적금으로 고정된 필드
        productRate,
        productPeriod,
        productContent,
        productIMG,
        repaymentType,
      });
      navigate('/depositProduct'); // 적금 상품 목록으로 이동
    } catch (error) {
      console.error('상품 등록에 실패했습니다.', error);
    }
  };

  return (
    <div className="register-product-container">
      <Sidebar /> {/* 사이드바 추가 */}
      <div className="main-content">
        <div className="register-content">
          <h2>적금 상품 등록</h2>
          <label>상품명:</label>
          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
          <label>금리:</label>
          <input type="text" value={productRate} onChange={(e) => setProductRate(e.target.value)} />
          <label>기간:</label>
          <input type="text" value={productPeriod} onChange={(e) => setProductPeriod(e.target.value)} />
          <label>내용:</label>
          <input type="text" value={productContent} onChange={(e) => setProductContent(e.target.value)} />
          <label>이미지:</label>
          <input type="text" value={productIMG} onChange={(e) => setProductIMG(e.target.value)} />
          <label>상환 방식:</label>
          <input type="text" value={repaymentType} onChange={(e) => setRepaymentType(e.target.value)} />
          <button onClick={handleRegister}>등록 완료</button>
        </div>
      </div>
    </div>
  );
};

export default RegisterDepositProduct;
