import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../resource/css/product/Calculatior.css';

const Loanchap1 = () => {
  const [loanAmount, setLoanAmount] = useState(''); 
  const [loanPeriod, setLoanPeriod] = useState(''); 
  const [interestRate, setInterestRate] = useState(''); 
  const [productName, setProductName] = useState(''); 
  const [repaymentTable, setRepaymentTable] = useState([]); 
  const [activeTab, setActiveTab] = useState('원리금균등상환'); 
  const [loanNo, setLoanNo] = useState(''); // loanNo 상태 추가
  const navigate = useNavigate(); 

  useEffect(() => {
    const storedLoan = sessionStorage.getItem('selectedLoan');
    if (storedLoan) {
      const loanData = JSON.parse(storedLoan);
      setProductName(loanData.loanName);
      setInterestRate(loanData.loanRate);
      setLoanNo(loanData.loanNo); // loanNo 가져오기
    }
  }, []);

  const handleLoanAmountChange = (e) => {
    setLoanAmount(e.target.value.replace(/\D/g, ''));
  };

  const handleLoanPeriodChange = (e) => {
    setLoanPeriod(e.target.value.replace(/\D/g, ''));
  };

  // 이자 계산 버튼 클릭 시 처리 함수
  const handleCalculate = () => {
    const amount = parseFloat(loanAmount) * 10000; // 만원 단위로 변환
    const rate = parseFloat(interestRate) / 100 / 12; // 월 이자율로 변환
    const months = parseInt(loanPeriod, 10);

    const table = [];
    let balance = amount;

    // 원리금균등상환 계산
    if (activeTab === '원리금균등상환') {
      const monthlyPayment = (amount * rate) / (1 - Math.pow(1 + rate, -months));
      for (let i = 1; i <= months; i++) {
        const interest = balance * rate;
        const principal = monthlyPayment - interest;
        balance -= principal;

        table.push({
          installment: `${i}회차`,
          principal: principal.toFixed(0),
          interest: interest.toFixed(0),
          totalPayment: monthlyPayment.toFixed(0),
          balance: balance.toFixed(0),
        });
      }
    }
    // 원금균등상환 계산
    else if (activeTab === '원금균등상환') {
      const principalPayment = amount / months;
      for (let i = 1; i <= months; i++) {
        const interest = balance * rate;
        const totalPayment = principalPayment + interest;
        balance -= principalPayment;

        table.push({
          installment: `${i}회차`,
          principal: principalPayment.toFixed(0),
          interest: interest.toFixed(0),
          totalPayment: totalPayment.toFixed(0),
          balance: balance.toFixed(0),
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
          principal: i === months ? amount.toFixed(0) : 0,
          interest: interestPayment.toFixed(0),
          totalPayment: totalPayment.toFixed(0),
          balance: i === months ? 0 : amount.toFixed(0),
        });
      }
    }

    setRepaymentTable(table); // 계산 결과 설정
  };

  const handleJoinClick = () => {
    const token = localStorage.getItem('token'); 

    if (!loanAmount || !loanPeriod) {
      alert('대출 금액과 대출 기간을 모두 입력해주세요.');
      return;
    }

    if (!token) {
      alert('로그인 후 이용해주세요.');
      navigate('/login');
      return;
    }

    sessionStorage.setItem('selectedProductName', productName);
    sessionStorage.setItem('selectedRepaymentMethod', activeTab); 
    sessionStorage.setItem('selectedLoanAmount', loanAmount);
    sessionStorage.setItem('selectedLoanPeriod', loanPeriod);
    sessionStorage.setItem('selectedInterestRate', interestRate);
    sessionStorage.setItem('selectedLoanNo', loanNo); // loanNo 추가

    navigate(`/Loanchap2`);
  };

  return (
    <div className="calculator-container">
      <h2>{productName} - 가입페이지</h2> 

      <div className="tab-buttons">
        <label>상환방법 선택</label>
        <button
          className={activeTab === '원리금균등상환' ? 'active' : ''}
          onClick={() => setActiveTab('원리금균등상환')}
        >
          원리금균등상환
        </button>
        <button
          className={activeTab === '원금균등상환' ? 'active' : ''}
          onClick={() => setActiveTab('원금균등상환')}
        >
          원금균등상환
        </button>
        <button
          className={activeTab === '원금만기일시상환' ? 'active' : ''}
          onClick={() => setActiveTab('원금만기일시상환')}
        >
          원금만기일시상환
        </button>
      </div>

      <div className="repayment-type">
        {activeTab === '원리금균등상환' && <p>매월 원금과 이자를 균등하게 나누어 상환합니다.</p>}
        {activeTab === '원금균등상환' && <p>매월 원금은 일정하게 상환하고, 이자는 잔액에 따라 변동합니다.</p>}
        {activeTab === '원금만기일시상환' && <p>매월 이자만 상환하고, 만기에 원금을 한꺼번에 상환합니다.</p>}
      </div>

      <div className="form-group">
        <label>대출금액</label>
        <input
          type="text"
          value={loanAmount}
          onChange={handleLoanAmountChange}
          placeholder="금액 입력"
        />
        <span>만원</span>
      </div>

      <div className="form-group">
        <label>대출기간</label>
        <input
          type="text"
          value={loanPeriod}
          onChange={handleLoanPeriodChange}
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
      <button onClick={handleCalculate}>대출 이자 계산</button>

      {repaymentTable.length > 0 && (
        <div className="repayment-table">
          <h3>상환 테이블</h3>
          <table>
            <thead>
              <tr>
                <th>회차</th>
                <th>상환원금</th>
                <th>이자액</th>
                <th>납부액</th>
                <th>잔액</th>
              </tr>
            </thead>
            <tbody>
              {repaymentTable.map((row, index) => (
                <tr key={index}>
                  <td>{row.installment}</td>
                  <td>{row.principal}</td>
                  <td>{row.interest}</td>
                  <td>{row.totalPayment}</td>
                  <td>{row.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Loanchap1;
