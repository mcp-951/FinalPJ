import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar'; // 사이드바 추가
import '../../../../resource/css/admin/AdLoanProduct.css'; // CSS 파일 추가

const AdLoanProduct = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const token = localStorage.getItem("token");

  const fetchLoans = () => {
    axios.get('http://localhost:8081/admin/loans', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((response) => {
      setLoans(response.data);
    })
    .catch((error) => {
      console.error('대출 상품 목록을 불러오는 중 오류 발생:', error);
    });
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleEdit = (loan) => {
    navigate('/adEditLoanProduct', { state: { loan } });
  };

  const handleDelete = async (loanNo) => {
    try {
      await axios.put(`http://localhost:8081/admin/deleteLoan/${loanNo}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('해당 대출 상품이 삭제되었습니다.');
      fetchLoans();
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
      alert('삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleRegister = () => {
    navigate('/admin/adRegisterLoanProduct');
  };

  return (
    <div className="AdLoanProduct-container">
      <Sidebar /> 
      <div className="AdLoanProduct-main-content">
        <div className="AdLoanProduct-product-container">
          <h2>대출 상품 관리</h2>
          <button className="AdLoanProduct-register-button" onClick={handleRegister}>등록</button>
          <table className="AdLoanProduct-table">
            <thead>
              <tr>
                <th>노출순서</th>
                <th>상품명</th>
                <th>최대 한도</th>
                <th>최소 한도</th>
                <th>최대 기간</th>
                <th>최소 기간</th>
                <th>최소 금리</th>
                <th>최대 금리</th>
                <th>중도 상환 수수료</th>
                <th>최소 신용등급</th>
                <th>상태</th>
                <th>수정</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan, index) => (
                <tr key={loan.loanProductNo}>
                  <td>{index + 1}</td>
                  <td>{loan.loanProductTitle}</td>
                  <td>{loan.loanMaxLimit}</td>
                  <td>{loan.loanMinLimit}</td>
                  <td>{loan.loanMaxTern}</td>
                  <td>{loan.loanMinTern}</td>
                  <td>{loan.minInterestRate}</td>
                  <td>{loan.maxInterestRate}</td>
                  <td>{loan.earlyRepaymentFee}</td>
                  <td>{loan.minCreditScore}</td>
                  <td>{loan.viewPoint === 'Y' ? '판매중' : '판매중지'}</td>
                  <td><button className="AdLoanProduct-edit-button" onClick={() => handleEdit(loan)}>수정</button></td>
                  <td><button className="AdLoanProduct-delete-button" onClick={() => handleDelete(loan.loanProductNo)}>삭제</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdLoanProduct;
