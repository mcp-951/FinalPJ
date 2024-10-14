import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const EditDepositProduct = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { product } = state; // 전달된 상품 데이터

  const [productName, setProductName] = useState(product.productName);
  const [interestRate, setInterestRate] = useState(product.interestRate);
  const [period, setPeriod] = useState(product.period);
  const [amount, setAmount] = useState(product.amount);

  const handleSave = () => {
    const updatedProduct = { ...product, productName, interestRate, period, amount };
    navigate('/depositProduct', { state: { updatedProduct } });
  };

  return (
    <div className="edit-product-container">
      <h2>적금 상품 수정</h2>
      <label>상품명:</label>
      <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
      <label>금리:</label>
      <input type="text" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
      <label>기간:</label>
      <input type="text" value={period} onChange={(e) => setPeriod(e.target.value)} />
      <label>금액:</label>
      <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={handleSave}>수정 완료</button>
    </div>
  );
};

export default EditDepositProduct;
