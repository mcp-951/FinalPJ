import React, { useState, useEffect } from 'react';
import Footer from '../../util/Footer'; // Footer 컴포넌트 임포트
import '../../../resource/css/product/DepositMain.css';

// 예금 상품 상세 페이지 컴포넌트 (DepositMain)
const DepositMain = () => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // 세션에서 예금 상품 데이터 불러오기
    const storedProduct = sessionStorage.getItem('selectedDepositProduct');
    if (storedProduct) {
      setProduct(JSON.parse(storedProduct));
    }
  }, []);

  if (!product) {
    return <div>상품 정보가 없습니다.</div>;
  }

  return (
    <div className="deposit-main">
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <strong>연 {product.rate}%</strong>
      <br />
      {/* 가입하기 버튼 */}
      <a href='/Accession'><button className="join-button">가입하기</button></a>

      {/* 예금 계산기 */}
      <DepositCalculator />

      {/* Footer 추가 */}
      <Footer />
    </div>
  );
};

// 예금 계산기 컴포넌트 (DepositCalculator)
const DepositCalculator = () => {
  const [amount, setAmount] = useState('5000000'); // 예: 500만원
  const [months, setMonths] = useState('12'); // 예: 12개월
  const [rate, setRate] = useState('3.0'); // 예: 3.0%
  const [calculation, setCalculation] = useState(null);

  const handleCalculation = () => {
    const depositAmount = parseFloat(amount);
    const depositRate = parseFloat(rate) / 100;
    const totalMonths = parseInt(months, 10);

    if (!isNaN(depositAmount) && !isNaN(depositRate) && !isNaN(totalMonths)) {
      const result = depositAmount * (1 + depositRate * totalMonths / 12);
      setCalculation(result.toFixed(2));
    }
  };

  return (
    <div className="deposit-calculator">
      <h2>예금 계산기</h2>
      <div className="input-group">
        <input
          type="text"
          placeholder="금액"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <span>원을</span>
        <input
          type="text"
          placeholder="개월"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
        />
        <span>개월 동안</span>
        <input
          type="text"
          placeholder="금리"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
        <span>% 이율이면?</span>
      </div>
      <button className="calculate-button" onClick={handleCalculation}>
        계산하기
      </button>
      {calculation && (
        <div className="calculation-result">
          예상 이자 금액: {calculation} 원
        </div>
      )}
    </div>
  );
};

export default DepositMain;
