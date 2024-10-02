import React, { useState } from 'react';
import './css/Accession.css';

const FormPage = () => {
  const [subscriptionPeriod, setSubscriptionPeriod] = useState(''); // 가입 기간
  const [subscriptionAmount, setSubscriptionAmount] = useState(''); // 가입 금액
  const [accountNumber, setAccountNumber] = useState(''); // 출금 계좌번호

  // 가입 기간 버튼 클릭 시 해당 값을 입력란에 더하기
  const handleSubscriptionPeriodClick = (value) => {
    const currentPeriod = subscriptionPeriod === '' ? 0 : parseInt(subscriptionPeriod, 10);
    setSubscriptionPeriod((currentPeriod + parseInt(value, 10)).toString());
  };

  // 가입 금액 버튼 클릭 시 해당 값을 입력란에 더하기
  const handleSubscriptionAmountClick = (value) => {
    const numericValue = value.replace('만', '0000'); // 만 단위를 0000으로 변환
    const currentAmount = subscriptionAmount === '' ? 0 : parseInt(subscriptionAmount, 10);
    setSubscriptionAmount((currentAmount + parseInt(numericValue, 10)).toString());
  };

  // 가입 기간 입력 시 숫자만 허용 (사용자 입력 가능)
  const handleSubscriptionPeriodChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setSubscriptionPeriod(value); // 숫자만 허용
    }
  };

  // 가입 금액 입력 필드에서 사용자 입력 처리 (사용자 입력 가능)
  const handleSubscriptionAmountChange = (e) => {
    setSubscriptionAmount(e.target.value); // 사용자 입력 허용
  };

  // 출금 계좌번호 입력
  const handleAccountNumberChange = (e) => {
    setAccountNumber(e.target.value);
  };

  // 가입 기간 및 금액 초기화 (정정 버튼 클릭 시)
  const handleReset = () => {
    setSubscriptionPeriod(''); // 가입 기간 초기화
    setSubscriptionAmount(''); // 가입 금액 초기화
  };

  const handleSubmit = () => {
    // 다음 버튼 클릭 시 처리할 로직
    console.log('가입 기간:', subscriptionPeriod);
    console.log('가입 금액:', subscriptionAmount);
    console.log('출금 계좌번호:', accountNumber);
  };

  return (
    <div className="form-container">
      <h2>정보입력</h2>

      {/* 가입 기간 입력 */}
      <div className="form-group">
        <label>가입기간</label>
        <div className="period-input">
          <input
            type="text"
            placeholder="~년"
            value={subscriptionPeriod}
            onChange={handleSubscriptionPeriodChange} // 숫자만 허용 및 수정 가능
          />
          <span>년</span>
          <button onClick={() => handleSubscriptionPeriodClick('1')}>1년</button>
          <button onClick={() => handleSubscriptionPeriodClick('2')}>2년</button>
          <button onClick={() => handleSubscriptionPeriodClick('3')}>3년</button>
          <button onClick={handleReset}>정정</button> {/* 가입 기간 및 금액 초기화 */}
        </div>
      </div>

      {/* 가입 금액 입력 */}
      <div className="form-group">
        <label>가입금액</label>
        <div className="amount-input">
          <input
            type="text"
            placeholder="~원"
            value={subscriptionAmount}
            onChange={handleSubscriptionAmountChange} // 사용자가 직접 수정 가능
          />
          <span>원</span>
          <button onClick={() => handleSubscriptionAmountClick('100만')}>100만</button>
          <button onClick={() => handleSubscriptionAmountClick('50만')}>50만</button>
          <button onClick={() => handleSubscriptionAmountClick('10만')}>10만</button>
          <button onClick={() => handleSubscriptionAmountClick('5만')}>5만</button>
          <button onClick={() => handleSubscriptionAmountClick('1만')}>1만</button>
          <button onClick={handleReset}>정정</button> {/* 가입 기간 및 금액 초기화 */}
        </div>
      </div>

      {/* 출금 계좌번호 입력 */}
      <div className="form-group">
        <label>출금계좌번호</label>
        <input
          type="text"
          value={accountNumber}
          onChange={handleAccountNumberChange}
          placeholder="계좌번호"
        />
      </div>

      {/* 이전/다음 버튼 */}
      <div className="button-group">
        <a href ='/DepositList'><button className="prev-button">이전</button></a>
        <a href ='/AccessionE'><button className="next-button" onClick={handleSubmit}>다음</button></a>
      </div>
    </div>
  );
};

export default FormPage;
