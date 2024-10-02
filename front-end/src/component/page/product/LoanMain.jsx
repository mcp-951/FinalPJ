import React, { useState, useEffect } from 'react';
import './css/LoanMain.css';

// 상품 상세 페이지 컴포넌트 (DepositMain)
const DepositMain = () => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // 세션에서 상품 데이터 불러오기
    const storedProduct = sessionStorage.getItem('selectedProduct');
    if (storedProduct) {
      setProduct(JSON.parse(storedProduct));
    }
  }, []);

  if (!product) {
    return <div>상품 정보가 없습니다.</div>;
  }

  return (
    <div className="loan-main">
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <strong>연 {product.rate}%</strong>
      <br></br>
      {/* 가입하기 버튼 */}
      <a href = '/Accession'><button className="join-button">가입하기</button></a>

      {/* 대출 계산기 사용 */}
      <LoanCalculator />
    </div>
  );
};

// 대출 계산기 컴포넌트 (LoanCalculator)
const LoanCalculator = () => {
  const [amount, setAmount] = useState('5000000'); // 금액 예시: 500만원
  const [months, setMonths] = useState('36'); // 기간 예시: 36개월 (3년)
  const [rate, setRate] = useState('3.0'); // 금리 예시: 3.0%
  const [calculation, setCalculation] = useState(null);

  const handleCalculation = () => {
    const loanAmount = parseFloat(amount);
    const loanRate = parseFloat(rate) / 100;
    const totalMonths = parseInt(months, 10);

    if (!isNaN(loanAmount) && !isNaN(loanRate) && !isNaN(totalMonths)) {
      const result = loanAmount * (1 + loanRate * totalMonths / 12);
      setCalculation(result.toFixed(2));
    }
  };

  return (
    <div className="loan-calculator">
      <h2>대출 계산기</h2>
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
        <span>개월 간</span>
        <input
          type="text"
          placeholder="금리"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
        <span>% 대출받으면?</span>
      </div>
      <button className="calculate-button" onClick={handleCalculation}>
        계산하기
      </button>
      {calculation && (
        <div className="calculation-result">
          예상 상환 금액: {calculation} 원
        </div>
      )}
    </div>
  );
};

export default DepositMain;
