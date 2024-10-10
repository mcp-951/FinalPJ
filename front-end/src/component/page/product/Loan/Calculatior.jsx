import React, { useState } from 'react';
import '../../../../resource/css/product/Calculatior.css'; // 별도의 CSS 파일

const LoanInterestCalculator = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [loanPeriod, setLoanPeriod] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [repaymentTable, setRepaymentTable] = useState([]);
  const [activeTab, setActiveTab] = useState('원리금균등상환'); // 초기값: 원리금균등상환

  const handleLoanAmountChange = (e) => {
    setLoanAmount(e.target.value);
  };

  const handleLoanPeriodChange = (e) => {
    setLoanPeriod(e.target.value);
  };

  const handleInterestRateChange = (e) => {
    setInterestRate(e.target.value);
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleCalculate = () => {
    const amount = parseFloat(loanAmount) * 10000; // 만원 단위 환산
    const rate = parseFloat(interestRate) / 100 / 12; // 월 이자율
    const months = parseInt(loanPeriod, 10);

    const table = [];
    let balance = amount;

    if (activeTab === '원리금균등상환') {
      // 원리금균등상환 계산 로직
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
    } else if (activeTab === '원금균등상환') {
      // 원금균등상환 계산 로직
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
    } else if (activeTab === '원금만기일시상환') {
      // 원금만기일시상환 계산 로직
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

    setRepaymentTable(table);
  };

  return (
    <div className="calculator-container">
      <h2>대출 이자 계산</h2>

      {/* 대출 조건 입력 폼 */}
      <div className="tab-buttons">
        <button
          className={activeTab === '원리금균등상환' ? 'active' : ''}
          onClick={() => handleTabClick('원리금균등상환')}
        >
          원리금균등상환
        </button>
        <button
          className={activeTab === '원금균등상환' ? 'active' : ''}
          onClick={() => handleTabClick('원금균등상환')}
        >
          원금균등상환
        </button>
        <button
          className={activeTab === '원금만기일시상환' ? 'active' : ''}
          onClick={() => handleTabClick('원금만기일시상환')}
        >
          원금만기일시상환
        </button>
      </div>

      <div className="form-group">
        <label>대출금액</label>
        <input type="text" value={loanAmount} onChange={handleLoanAmountChange} placeholder="금액입력" />
        <span>만원</span>
      </div>

      <div className="form-group">
        <label>대출기간</label>
        <input type="text" value={loanPeriod} onChange={handleLoanPeriodChange} placeholder="총 개월수 입력" />
        <span>개월</span>
      </div>

      <div className="form-group">
        <label>연이자율</label>
        <input type="text" value={interestRate} onChange={handleInterestRateChange} placeholder="% 입력" />
        <span>%</span>
      </div>

      <button onClick={handleCalculate}>대출 이자 계산</button>

      {/* 상환 테이블 */}
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

export default LoanInterestCalculator;
