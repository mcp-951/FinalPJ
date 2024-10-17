import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../../ApiService';
import '../../../../resource/css/product/AccessionE.css';

const Loanchap3 = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    loanName: '', // productName을 loanName으로 변경
    repaymentMethod: '',
    loanAmount: '',
    loanPeriod: '',
    transferAccount: '',
    transferDay: '',
    interestRate: '',
    loanNo: '',
    accountNo: ''
  });

  useEffect(() => {
    // sessionStorage에서 모든 값들을 가져와서 상태에 저장
    const storedLoanName = sessionStorage.getItem('selectedProductName'); // productName을 loanName으로 변경
    const storedRepaymentMethod = sessionStorage.getItem('selectedRepaymentMethod');
    const storedLoanAmount = sessionStorage.getItem('selectedLoanAmount');
    const storedLoanPeriod = sessionStorage.getItem('selectedLoanPeriod');
    const storedTransferAccount = sessionStorage.getItem('selectedTransferAccount');
    const storedTransferDay = sessionStorage.getItem('selectedTransferDay');
    const storedInterestRate = sessionStorage.getItem('selectedInterestRate');
    const storedLoanNo = sessionStorage.getItem('selectedLoanNo');
    const storedAccountNo = sessionStorage.getItem('selectedAccountNo');

    setData({
      loanName: storedLoanName || '', // productName을 loanName으로 변경
      repaymentMethod: storedRepaymentMethod || '',
      loanAmount: storedLoanAmount || '',
      loanPeriod: storedLoanPeriod || '',
      transferAccount: storedTransferAccount || '',
      transferDay: storedTransferDay || '1',  // 기본값 1일로 설정
      interestRate: storedInterestRate || '',
      loanNo: storedLoanNo || '',
      accountNo: storedAccountNo || ''
    });
  }, []);

  const handleCompleteClick = async () => {
    const token = localStorage.getItem('token');
    const userNo = localStorage.getItem('userNo');

    // 추가된 로그를 통해 값 확인
    console.log('Repayment Method:', data.repaymentMethod);
    console.log('Token: ', token);
    console.log('UserNo: ', userNo);

    if (token && userNo) {
      const loanData = {
        loanAmount: parseInt(data.loanAmount, 10) * 10000, // 원 단위로 변환
        loanPeriod: parseInt(data.loanPeriod, 10),
        transferAccount: data.transferAccount,
        loanTransferDay: parseInt(data.transferDay, 10),  // loanTransferDay 숫자 변환
        interestRate: parseFloat(data.interestRate),
        loanNo: parseInt(data.loanNo, 10),
        accountNo: parseInt(data.accountNo, 10),
        repaymentMethod: data.repaymentMethod,
        userNo: parseInt(userNo, 10),
        loanName: data.loanName // loanName으로 추가
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
            <td>{data.loanName}</td> {/* loanName으로 변경 */}
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
            <td className="label-cell">출금계좌번호</td>
            <td>{data.transferAccount}</td>
          </tr>
          <tr>
            <td className="label-cell">자동이체일</td>
            <td>{data.transferDay}일</td>
          </tr>
          <tr>
            <td className="label-cell">계좌 번호</td>
            <td>{data.accountNo}</td>
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

export default Loanchap3;
