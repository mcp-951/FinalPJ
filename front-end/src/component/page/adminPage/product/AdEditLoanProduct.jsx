import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar'; // 사이드바 추가
import '../../../../resource/css/admin/EditSavingsProduct.css'; // CSS 파일 추가

const AdEditLoanProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loan = location.state?.loan || {}; // loan 데이터를 location.state에서 가져오기

  const [formData, setFormData] = useState({
    loanProductNo: loan.loanProductNo || '', // 상품 번호 (수정 불가)
    loanProductTitle: loan.loanProductTitle || '',  // 상품명
    loanMaxLimit: loan.loanMaxLimit || '',  // 최대 한도
    loanMinLimit: loan.loanMinLimit || '',  // 최소 한도
    loanMaxTern: loan.loanMaxTern || '',  // 최대 기간
    loanMinTern: loan.loanMinTern || '',  // 최소 기간
    minInterestRate: loan.minInterestRate || '',  // 최소 금리
    maxInterestRate: loan.maxInterestRate || '',  // 최대 금리
    earlyRepaymentFee: loan.earlyRepaymentFee || '',  // 중도 상환 수수료
    minCreditScore: loan.minCreditScore || '',  // 최소 신용등급
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    navigate('/admin/financialProduct'); // 취소하면 목록으로 이동
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8081/admin/editLoan/${formData.loanProductNo}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert("수정이 완료되었습니다.");
      navigate('/admin/financialProduct');
    } catch (error) {
      console.error("수정 중 오류 발생:", error);
      alert("수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="alog-main-content">
        <div className="edit-container">
          <h2>대출 상품 수정</h2>
          <form onSubmit={handleSubmit}>
            <table className="edit-table">
              <tbody>
                <tr>
                  <td>상품 번호</td>
                  <td>
                    <input
                      type="text"
                      name="loanProductNo"
                      value={formData.loanProductNo}
                      readOnly
                      disabled
                    />
                  </td>
                </tr>
                <tr>
                  <td>상품 이름</td>
                  <td>
                    <input
                      type="text"
                      name="loanProductTitle"
                      value={formData.loanProductTitle}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>최대 한도</td>
                  <td>
                    <input
                      type="number"
                      name="loanMaxLimit"
                      value={formData.loanMaxLimit}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>최소 한도</td>
                  <td>
                    <input
                      type="number"
                      name="loanMinLimit"
                      value={formData.loanMinLimit}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>최대 기간</td>
                  <td>
                    <input
                      type="number"
                      name="loanMaxTern"
                      value={formData.loanMaxTern}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>최소 기간</td>
                  <td>
                    <input
                      type="number"
                      name="loanMinTern"
                      value={formData.loanMinTern}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>최소 금리</td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      name="minInterestRate"
                      value={formData.minInterestRate}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>최대 금리</td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      name="maxInterestRate"
                      value={formData.maxInterestRate}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>중도 상환 수수료</td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      name="earlyRepaymentFee"
                      value={formData.earlyRepaymentFee}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>최소 신용등급</td>
                  <td>
                    <input
                      type="number"
                      name="minCreditScore"
                      value={formData.minCreditScore}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="button-group">
              <button type="button" onClick={handleCancel}>
                취소
              </button>
              <button type="submit">수정</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdEditLoanProduct;
