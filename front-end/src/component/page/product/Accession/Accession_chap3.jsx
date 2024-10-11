import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../../ApiService';
import '../../../../resource/css/product/AccessionE.css';

const ConfirmPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    productName: '',
    repaymentMethod: '',
    loanAmount: '',
    loanPeriod: '',
    loanAccount: '',
    transferAccount: '',
    transferDay: '',
    interestRate: '', // 금리 추가
  });

  useEffect(() => {
    const storedProductName = sessionStorage.getItem('selectedProductName');
    const storedRepaymentMethod = sessionStorage.getItem('selectedRepaymentMethod');
    const storedLoanAmount = sessionStorage.getItem('selectedLoanAmount');
    const storedLoanPeriod = sessionStorage.getItem('selectedLoanPeriod');
    const storedLoanAccount = sessionStorage.getItem('generatedLoanAccountNumber');
    const storedTransferAccount = sessionStorage.getItem('selectedTransferAccount');
    const storedTransferDay = sessionStorage.getItem('selectedTransferDay');
    const storedInterestRate = sessionStorage.getItem('selectedInterestRate'); // 금리 가져오기

    setData({
      productName: storedProductName || '',
      repaymentMethod: storedRepaymentMethod || '',
      loanAmount: storedLoanAmount || '',
      loanPeriod: storedLoanPeriod || '',
      loanAccount: storedLoanAccount || '',
      transferAccount: storedTransferAccount || '',
      transferDay: storedTransferDay || '',
      interestRate: storedInterestRate || '',  // 금리 설정
    });
  }, []);

  const handleCompleteClick = () => {
    const token = localStorage.getItem('token');
    const userNo = localStorage.getItem('userNo'); // localStorage에서 userNo 값 가져오기
    
    // 추가된 로그를 통해 token과 userNo를 확인
    console.log("Token: ", token);  // 토큰 값 확인
    console.log("UserNo: ", userNo);  // userNo 값 확인

    if (token && userNo) {
      const loanData = {
        productName: data.productName,
        repaymentMethod: data.repaymentMethod,
        loanAmount: data.loanAmount,
        loanPeriod: data.loanPeriod,
        loanAccount: data.loanAccount,
        transferAccount: data.transferAccount,
        transferDay: data.transferDay,
        interestRate: data.interestRate,
        userNo: userNo, // userNo 추가
      };

      ApiService.saveLoanJoin(loanData, token)
        .then((response) => {
          alert('가입이 완료되었습니다!');
          navigate('/');
        })
        .catch((error) => {
          console.error('LoanJoin 저장 실패:', error.response?.data || error.message);
          alert('가입에 실패하였습니다. 다시 시도해주세요.');
        });
    } else {
      alert('가입에 실패하였습니다. 로그인이 필요합니다.');
    }
  };

  return (
    <div className="confirm-container">
      <h2>가입 확인 페이지</h2>
      <table className="confirm-table">
        <tbody>
          <tr>
            <td className="label-cell">상품명</td>
            <td>{data.productName}</td>
          </tr>
          <tr>
            <td className="label-cell">상환방식</td>
            <td>{data.repaymentMethod}</td>
          </tr>
          <tr>
            <td className="label-cell">대출금액</td>
            <td>{data.loanAmount} 만원</td>
          </tr>
          <tr>
            <td className="label-cell">대출기간</td>
            <td>{data.loanPeriod} 개월</td>
          </tr>
          <tr>
            <td className="label-cell">금리</td>
            <td>{data.interestRate} %</td>
          </tr>
          <tr>
            <td className="label-cell">대출 계좌번호</td>
            <td>{data.loanAccount}</td>
          </tr>
          <tr>
            <td className="label-cell">출금계좌번호</td>
            <td>{data.transferAccount}</td>
          </tr>
          <tr>
            <td className="label-cell">자동이체일</td>
            <td>{data.transferDay}일</td>
          </tr>
        </tbody>
      </table>
      <div className="button-group">
        <a href="/Accession_chap2">
          <button className="prev-button">이전</button>
        </a>
        <button className="complete-button" onClick={handleCompleteClick}>완료</button>
      </div>
    </div>
  );
};

export default ConfirmPage;
