import React, { useState } from 'react';
import './css/Repayment.css'; // 별도의 CSS 파일

const LoanRepaymentForm = () => {
  const [loanAccount, setLoanAccount] = useState('');
  const [repaymentAmount, setRepaymentAmount] = useState('');
  const [withdrawalAccount, setWithdrawalAccount] = useState('');
  const [accountPassword, setAccountPassword] = useState('');

  const handleLoanAccountChange = (e) => {
    setLoanAccount(e.target.value);
  };

  const handleRepaymentAmountChange = (e) => {
    setRepaymentAmount(e.target.value);
  };

  const handleWithdrawalAccountChange = (e) => {
    setWithdrawalAccount(e.target.value);
  };

  const handleAccountPasswordChange = (e) => {
    setAccountPassword(e.target.value);
  };

  const handleReset = () => {
    setLoanAccount('');
    setRepaymentAmount('');
    setWithdrawalAccount('');
    setAccountPassword('');
  };

  const handleSubmit = () => {
    // 완료 버튼 클릭 시 처리할 로직
    console.log('대출 계좌 선택:', loanAccount);
    console.log('상환 금액 입력:', repaymentAmount);
    console.log('출금 계좌번호:', withdrawalAccount);
    console.log('계좌 비밀번호:', accountPassword);
  };

  return (
    <div className="form-container">
      <div className="form-group">
        <label>대출 계좌선택</label>
        <select value={loanAccount} onChange={handleLoanAccountChange}>
          <option value="">대출 계좌선택</option>
          <option value="account1">계좌1</option>
          <option value="account2">계좌2</option>
        </select>
        <button className="small-button">남은금액 조회</button>
      </div>

      <div className="form-group">
        <label>상환금액 입력</label>
        <input
          type="text"
          value={repaymentAmount}
          onChange={handleRepaymentAmountChange}
          placeholder="금액 입력"
        />
      </div>

      <div className="form-group">
        <label>출금 계좌번호</label>
        <select value={withdrawalAccount} onChange={handleWithdrawalAccountChange}>
          <option value="">출금 계좌선택</option>
          <option value="withdrawal1">출금 계좌1</option>
          <option value="withdrawal2">출금 계좌2</option>
        </select>
      </div>

      <div className="form-group">
        <label>계좌 비밀번호</label>
        <input
          type="password"
          value={accountPassword}
          onChange={handleAccountPasswordChange}
          placeholder="비밀번호 입력"
        />
        <button className="small-button">확인</button>
      </div>

      <div className="button-group">
        <button className="reset-button" onClick={handleReset}>초기화</button>
        <a href = '/'><button className="submit-button" onClick={handleSubmit}>완료</button></a>
      </div>
    </div>
  );
};

export default LoanRepaymentForm;
