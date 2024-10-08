import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar'; // Sidebar 추가
import '../../../../resource/css/admin/SavingsProduct.css'; // CSS 파일 추가

const RegisterSavingsProduct = () => {
  const navigate = useNavigate();

  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState(''); // 상품 분류 필드 추가
  const [productRate, setProductRate] = useState('');
  const [productPeriod, setProductPeriod] = useState('');
  const [productContent, setProductContent] = useState(''); // 상품 내용 필드 추가
  const [productIMG, setProductIMG] = useState(''); // 상품 이미지 필드 추가
  const [repaymentType, setRepaymentType] = useState(''); // 상환 방식 필드 추가

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:8080/product/add', {
        productName,
        productCategory,
        productRate,
        productPeriod,
        productContent,
        productIMG,
        repaymentType,
      });
      navigate('/savingsProduct');
    } catch (error) {
      console.error('상품 등록에 실패했습니다.', error);
    }
  };
  

  return (
    <div className="register-product-container">
      <Sidebar /> {/* 사이드바 추가 */}
      <div className="main-content">
      <div className="register-content">
        <h2>예금 상품 등록</h2>
        <label>상품명:</label>
        <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
        <label>분류:</label>
        <input type="text" value={productCategory} onChange={(e) => setProductCategory(e.target.value)} />
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

export default RegisterSavingsProduct;
