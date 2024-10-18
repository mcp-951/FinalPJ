import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../resource/css/product/Calculatior.css'; // 스타일 시트 경로 수정

const DepositChap1 = () => {
  const [depositAmount, setDepositAmount] = useState(''); 
  const [depositPeriod, setDepositPeriod] = useState(''); 
  const [interestRate, setInterestRate] = useState(''); 
  const [productName, setProductName] = useState(''); 
  const [repaymentTable, setRepaymentTable] = useState([]); 
  const [activeTab, setActiveTab] = useState('원리금균등상환'); 
  const [depositNo, setDepositNo] = useState(''); // depositNo 상태 추가
  const [totalPayment, setTotalPayment] = useState(0); // 총 납입액
  const [totalInterest, setTotalInterest] = useState(0); // 총 이자금액
  const [totalAmount, setTotalAmount] = useState(0); // 총 금액
  const navigate = useNavigate(); 

  useEffect(() => {
    const storedDeposit = sessionStorage.getItem('selectedDeposit');
    if (storedDeposit) {
      const depositData = JSON.parse(storedDeposit);
      setProductName(depositData.depositName);
      setInterestRate(depositData.depositRate);
      setDepositNo(depositData.depositNo); // depositNo 가져오기
    }
  }, []);

  const handleDepositAmountChange = (e) => {
    setDepositAmount(e.target.value.replace(/\D/g, ''));
  };

  const handleDepositPeriodChange = (e) => {
    setDepositPeriod(e.target.value.replace(/\D/g, ''));
  };

  // 이자 계산 버튼 클릭 시 처리 함수
  const handleCalculate = () => {
    const amount = parseInt(depositAmount) * 10000; // 만원 단위로 변환
    const rate = parseFloat(interestRate) / 100 / 12; // 월 이자율로 변환
    const months = parseInt(depositPeriod, 10);
    
    let totalPayment = amount * months; // 총 납입액
    let totalInterest = 0; // 총 이자액

    const table = [];
    let balance = amount;

    // 원리금균등상환 계산
    if (activeTab === '원리금균등상환') {
      const monthlyPayment = (amount * rate) / (1 - Math.pow(1 + rate, -months));
      for (let i = 1; i <= months; i++) {
        const interest = Math.round(balance * rate);
        const principal = Math.round(monthlyPayment - interest);
        balance -= principal;
        totalInterest += interest; // 총 이자액 계산

        table.push({
          installment: `${i}회차`,
          principal: principal.toString(),
          interest: interest.toString(),
          totalPayment: Math.round(monthlyPayment).toString(),
          balance: balance.toString(),
        });
      }
    }
    // 원금균등상환 계산
    else if (activeTab === '원금균등상환') {
      const principalPayment = amount / months;
      for (let i = 1; i <= months; i++) {
        const interest = Math.round(balance * rate);
        const totalPayment = Math.round(principalPayment + interest);
        balance -= principalPayment;
        totalInterest += interest; // 총 이자액 계산

        table.push({
          installment: `${i}회차`,
          principal: principalPayment.toString(),
          interest: interest.toString(),
          totalPayment: totalPayment.toString(),
          balance: balance.toString(),
        });
      }
    }
    // 원금만기일시상환 계산
    else if (activeTab === '원금만기일시상환') {
      const interestPayment = amount * rate;
      for (let i = 1; i <= months; i++) {
        const totalPayment = i === months ? amount + interestPayment : interestPayment;

        table.push({
          installment: `${i}회차`,
          principal: i === months ? amount.toString() : '0',
          interest: interestPayment.toString(),
          totalPayment: totalPayment.toString(),
          balance: i === months ? '0' : amount.toString(),
        });
      }
      totalInterest += Math.round(interestPayment * (months - 1)); // 마지막 회차 전까지의 이자 계산
    }

    setRepaymentTable(table); // 계산 결과 설정
    setTotalPayment(Math.round(totalPayment)); // 총 납입액 설정
    setTotalInterest(Math.round(totalInterest)); // 총 이자액 설정
    setTotalAmount(Math.round(totalPayment + totalInterest)); // 총 금액 설정
  };

  const handleJoinClick = () => {
    const token = localStorage.getItem('token'); 

    if (!depositAmount || !depositPeriod) {
      alert('적금 금액과 적금 기간을 모두 입력해주세요.');
      return;
    }

    if (!token) {
      alert('로그인 후 이용해주세요.');
      navigate('/login');
      return;
    }

    sessionStorage.setItem('selectedProductName', productName);
    sessionStorage.setItem('selectedRepaymentMethod', activeTab); 
    sessionStorage.setItem('selectedDepositAmount', depositAmount);
    sessionStorage.setItem('selectedDepositPeriod', depositPeriod);
    sessionStorage.setItem('selectedInterestRate', interestRate);
    sessionStorage.setItem('selectedDepositNo', depositNo); // depositNo 추가

    navigate(`/Depositchap2`); // 다음 페이지로 이동
  };

  return (
    <div className="calculator-container">
      <h2>{productName} - 가입페이지</h2> 
      <div className="form-group">
        <label>적금 금액</label>
        <input
          type="text"
          value={depositAmount}
          onChange={handleDepositAmountChange}
          placeholder="금액 입력"
        />
        <span>만원</span>
      </div>

      <div className="form-group">
        <label>적금 기간</label>
        <input
          type="text"
          value={depositPeriod}
          onChange={handleDepositPeriodChange}
          placeholder="총 개월 수 입력"
        />
        <span>개월</span>
      </div>

      <div className="form-group">
        <label>금리</label>
        <input
          type="text"
          value={interestRate}
          readOnly 
        />
        <span>%</span>
      </div>

      <button onClick={handleJoinClick}>다음</button> 
      <button onClick={handleCalculate}>적금 이자 계산</button>

      {repaymentTable.length > 0 && (
        <div className="repayment-table">
          <h3>적금 최종 예상금액</h3>
          <p>총 납입액: {totalPayment.toLocaleString()} 원</p>
          <p>총 이자액: {totalInterest.toLocaleString()} 원</p>
          <p>총 금액: {totalAmount.toLocaleString()} 원</p>
        </div>
      )}
    </div>
  );
};

export default DepositChap1;
