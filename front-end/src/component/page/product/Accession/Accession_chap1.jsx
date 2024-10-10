import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../resource/css/product/Calculatior.css'; // 별도의 CSS 파일

const LoanInterestCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(''); // 대출금액
  const [loanPeriod, setLoanPeriod] = useState(''); // 대출기간
  const [interestRate, setInterestRate] = useState(''); // 금리
  const [productName, setProductName] = useState(''); // 상품명
  const [repaymentTable, setRepaymentTable] = useState([]); // 상환 테이블
  const [activeTab, setActiveTab] = useState('원리금균등상환'); // 초기 상환방식
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이트 함수

  // useEffect로 세션에서 상품명과 금리 가져오기
  useEffect(() => {
    const storedProductName = sessionStorage.getItem('productName');
    const storedProductRate = sessionStorage.getItem('productRate');
    
    if (storedProductName) {
      setProductName(storedProductName);
    }
    
    if (storedProductRate) {
      setInterestRate(storedProductRate);
    }
  }, []);

  // 숫자만 입력 가능하게 처리하는 함수 (대출 금액)
  const handleLoanAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // 숫자 이외의 문자 제거
    setLoanAmount(value);
  };

  // 숫자만 입력 가능하게 처리하는 함수 (대출 기간)
  const handleLoanPeriodChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // 숫자 이외의 문자 제거
    setLoanPeriod(value);
  };

  // 상환방식 선택
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // 이자 계산 버튼 클릭 시 처리
  const handleCalculate = () => {
    const amount = parseFloat(loanAmount) * 10000; // 금액을 만원 단위로 변환
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

    setRepaymentTable(table); // 계산 결과를 상환 테이블에 설정
  };

  // 가입하기 버튼 클릭 시 처리
  const handleJoinClick = () => {
    const token = localStorage.getItem('token'); // JWT 토큰 가져오기

    if (!token) {
      alert('로그인 후 이용해주세요.');
      navigate('/login'); // 로그인 페이지로 리다이렉트
      return;
    }

    // 입력한 정보 세션에 저장
    sessionStorage.setItem('selectedProductName', productName);
    sessionStorage.setItem('selectedRepaymentMethod', activeTab); // 선택한 상환 방식 저장
    sessionStorage.setItem('selectedLoanAmount', loanAmount);
    sessionStorage.setItem('selectedLoanPeriod', loanPeriod);
    sessionStorage.setItem('selectedInterestRate', interestRate);
    
    // 가입 페이지로 이동 (토큰을 URL 파라미터로 전달할 수도 있음)
    navigate(`/Accession_chap2`);
  };

  return (
    <div className="calculator-container">
      <h2>{productName} - 가입페이지</h2> {/* 세션에서 가져온 상품명 표시 */}

      {/* 상환방식 선택 탭 */}
      <div className="tab-buttons">
        <label>상환방법 선택</label>
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

      {/* 상환방식 설명 */}
      <div className="repayment-type">
        {activeTab === '원리금균등상환' && <p>매월 원금과 이자를 균등하게 나누어 상환합니다.</p>}
        {activeTab === '원금균등상환' && <p>매월 원금은 일정하게 상환하고, 이자는 잔액에 따라 변동합니다.</p>}
        {activeTab === '원금만기일시상환' && <p>매월 이자만 상환하고, 만기에 원금을 한꺼번에 상환합니다.</p>}
      </div>

      {/* 대출 금액 입력 */}
      <div className="form-group">
        <label>대출금액</label>
        <input
          type="text"
          value={loanAmount}
          onChange={handleLoanAmountChange}
          placeholder="금액입력"
        />
        <span>만원</span>
      </div>

      {/* 대출 기간 입력 */}
      <div className="form-group">
        <label>대출기간</label>
        <input
          type="text"
          value={loanPeriod}
          onChange={handleLoanPeriodChange}
          placeholder="총 개월수 입력"
        />
        <span>개월</span>
      </div>

      {/* 금리 표시 (읽기 전용) */}
      <div className="form-group">
        <label>금리</label>
        <input
          type="text"
          value={interestRate}
          readOnly // 읽기 전용 필드
        />
        <span>%</span>
      </div>

      {/* 가입하기 및 계산 버튼 */}
      <button onClick={handleJoinClick}>다음</button> {/* 가입 버튼 */}
      <button onClick={handleCalculate}>대출 이자 계산</button>

      {/* 상환 테이블 표시 */}
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
