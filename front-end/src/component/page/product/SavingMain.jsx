import React, { useState, useEffect } from 'react';
import '../../../resource/css/product/SavingMain.css';

// 상품 상세 페이지 컴포넌트 (SavingMain)
const SavingMain = () => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // 세션에서 적금 상품 데이터 불러오기
    const storedProduct = sessionStorage.getItem('selectedSaving');
    if (storedProduct) {
      setProduct(JSON.parse(storedProduct));
    }
  }, []);

  if (!product) {
    return <div>상품 정보가 없습니다.</div>;
  }

  return (
    <div className="saving-main">
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <strong>연 {product.rate}%</strong>
      <br></br>
      {/* 가입하기 버튼 */}
      <a href='/Accession'><button className="join-button">가입하기</button></a>

      {/* 적금 이자 계산기 사용 */}
      <SavingCalculator />
    </div>
  );
};

// 적금 계산기 컴포넌트 (SavingCalculator)
const SavingCalculator = () => {
  const [amount, setAmount] = useState('100000'); // 월 납입금 예시: 10만원
  const [months, setMonths] = useState('12'); // 기간 예시: 12개월 (1년)
  const [rate, setRate] = useState('3.0'); // 금리 예시: 3.0%
  const [calculation, setCalculation] = useState(null);

  const handleCalculation = () => {
    const monthlyAmount = parseFloat(amount);
    const savingRate = parseFloat(rate) / 100;
    const totalMonths = parseInt(months, 10);

    if (!isNaN(monthlyAmount) && !isNaN(savingRate) && !isNaN(totalMonths)) {
      // 원금 합계 계산 (월 납입금 * 기간)
      const principal = monthlyAmount * totalMonths;

      // 적금 계산 공식: 원금합계 + 원금합계 * (금리/12) * n(n+1) / (2 * 12)
      const interest = principal * (savingRate / 12) * totalMonths * (totalMonths + 1) / (2 * 12);
      const result = principal + interest;

      setCalculation(result.toFixed(2));
    }
  };

  return (
    <div className="saving-calculator">
      <h2>적금 계산기</h2>
      <div className="input-group">
        <input
          type="text"
          placeholder="월 납입금"
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
        <span>% 적립하면?</span>
      </div>
      <button className="calculate-button" onClick={handleCalculation}>
        계산하기
      </button>
      {calculation && (
        <div className="calculation-result">
          예상 수령 금액: {calculation} 원
        </div>
      )}
    </div>
  );
};

export default SavingMain;
