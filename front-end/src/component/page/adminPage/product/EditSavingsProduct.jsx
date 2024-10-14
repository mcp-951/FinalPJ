import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar'; // Sidebar 추가
import '../../../../resource/css/admin/SavingsProduct.css'; // CSS 파일 추가

const EditSavingsProduct = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { product } = state;

  const [productName, setProductName] = useState(product.productName);
  const [productCategory, setProductCategory] = useState(product.productCategory);
  const [productRate, setProductRate] = useState(product.productRate);
  const [productPeriod, setProductPeriod] = useState(product.productPeriod);
  const [productContent, setProductContent] = useState(product.productContent);
  const [productIMG, setProductIMG] = useState(product.productIMG);
  const [viewState, setViewState] = useState(product.viewState);
  const [repaymentType, setRepaymentType] = useState(product.repaymentType);

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:8080/product/update/${product.productNo}`, {
        productName,
        productCategory,
        productRate,
        productPeriod,
        productContent,
        productIMG,
        viewState,
        repaymentType,
      });
      navigate('/savingsProduct');
    } catch (error) {
      console.error('상품 수정에 실패했습니다.', error);
    }
  };

  return (
    <div className="edit-product-container">
      <Sidebar /> {/* 사이드바 추가 */}
      <div className="edit-content">
        <h2>예금 상품 수정</h2>
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
        <label>상태:</label>
        <input type="text" value={viewState} onChange={(e) => setViewState(e.target.value)} />
        <label>상환 방식:</label>
        <input type="text" value={repaymentType} onChange={(e) => setRepaymentType(e.target.value)} />
        <button onClick={handleSave}>수정 완료</button>
      </div>
    </div>
  );
};

export default EditSavingsProduct;
