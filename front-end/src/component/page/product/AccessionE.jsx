import React from 'react';
import './css/AccessionE.css';

const ConfirmPage = () => {
  // 예시 데이터 (실제 데이터는 props로 전달 가능)
  const data = {
    subscriber: '홍길동',
    birthDate: '000101-1',
    loanAmount: '~원',
    loanPeriod: '~년',
    loanAccount: '111-1111-1111111',
    autoDebitAccount: '222-2222-2222222'
  };

  const handlePrevious = () => {
    // 이전 버튼 클릭 시 처리할 로직
    console.log('이전 버튼 클릭');
  };

  const handleComplete = () => {
    // 완료 버튼 클릭 시 처리할 로직
    console.log('완료 버튼 클릭');
  };

  return (
    <div className="confirm-container">
      <h2>가입 확인 페이지</h2>
      <table className="confirm-table">
        <tbody>
          <tr>
            <td className="label-cell"><div className="red-box">1</div> 가입자</td>
            <td>{data.subscriber}</td>
          </tr>
          <tr>
            <td className="label-cell"><div className="red-box">2</div> 생년월일</td>
            <td>{data.birthDate}</td>
          </tr>
          <tr>
            <td className="label-cell"><div className="red-box">3</div> 대출금액</td>
            <td>{data.loanAmount}</td>
          </tr>
          <tr>
            <td className="label-cell"><div className="red-box">4</div> 대출기간</td>
            <td>{data.loanPeriod}</td>
          </tr>
          <tr>
            <td className="label-cell"><div className="red-box">5</div> 대출 계좌번호</td>
            <td>{data.loanAccount}</td>
          </tr>
          <tr>
            <td className="label-cell"><div className="red-box">6</div> 자동이체 계좌번호</td>
            <td>{data.autoDebitAccount}</td>
          </tr>
        </tbody>
      </table>
      <div className="button-group">
        <a href = '/Accession'><button className="prev-button" onClick={handlePrevious}>이전</button></a>
        <a href = '/'><button className="complete-button" onClick={handleComplete}>완료</button></a>
      </div>
    </div>

    
  );
};

export default ConfirmPage;
