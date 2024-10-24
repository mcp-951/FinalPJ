import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar'; // Sidebar 추가
import '../../../../resource/css/admin/AdRegisterLoanProduct.css'; // CSS 파일 추가

const AdRegisterLoanProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loanProductTitle: '',  // 상품명
    loanMaxLimit: '',  // 최대 한도
    loanMinLimit: '',  // 최소 한도
    loanMaxTern: '',  // 최대 기간
    loanMinTern: '',  // 최소 기간
    minInterestRate: '',  // 최소 금리
    maxInterestRate: '',  // 최대 금리
    earlyRepaymentFee: '',  // 중도 상환 수수료
    minCreditScore: '',  // 최소 신용등급
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    navigate(-1); // 취소 시 목록으로 이동
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://13.125.114.85:8081/admin/register-loan', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate(-1); // 등록 후 목록 페이지로 이동
    } catch (error) {
      console.error('상품 등록에 실패했습니다.', error);
    }
  };

  return (
    <div className="AdRegisterLoanProduct-container">
      <Sidebar />
      <div className="AdRegisterLoanProduct-main-content">
        <div className="AdRegisterLoanProduct-form-container">
          <h2>대출 상품 등록</h2>
          <form onSubmit={handleRegister}>
            <table className="AdRegisterLoanProduct-table">
              <tbody>
                <tr>
                  <td>상품명:</td>
                  <td><input type="text" name="loanProductTitle" value={formData.loanProductTitle} onChange={handleChange} /></td>
                </tr>
                <tr>
                  <td>최대 한도:</td>
                  <td><input type="number" name="loanMaxLimit" value={formData.loanMaxLimit} onChange={handleChange} min="0" /></td>
                </tr>
                <tr>
                  <td>최소 한도:</td>
                  <td><input type="number" name="loanMinLimit" value={formData.loanMinLimit} onChange={handleChange} min="0"/></td>
                </tr>
                <tr>
                  <td>최대 기간:</td>
                  <td><input type="number" name="loanMaxTern" value={formData.loanMaxTern} onChange={handleChange} min="0"/></td>
                </tr>
                <tr>
                  <td>최소 기간:</td>
                  <td><input type="number" name="loanMinTern" value={formData.loanMinTern} onChange={handleChange} min="0"/></td>
                </tr>
                <tr>
                  <td>최소 금리:</td>
                  <td><input type="number" step="0.01" name="minInterestRate" value={formData.minInterestRate} onChange={handleChange} min="0" /></td>
                </tr>
                <tr>
                  <td>최대 금리:</td>
                  <td><input type="number" step="0.01" name="maxInterestRate" value={formData.maxInterestRate} onChange={handleChange} min="0"/></td>
                </tr>
                <tr>
                  <td>중도 상환 수수료:</td>
                  <td><input type="number" step="0.01" name="earlyRepaymentFee" value={formData.earlyRepaymentFee} onChange={handleChange} min="0"/></td>
                </tr>
                <tr>
                  <td>최소 신용등급:</td>
                  <td><input type="number" name="minCreditScore" value={formData.minCreditScore} onChange={handleChange} min="0" max="9"/></td>
                </tr>
              </tbody>
            </table>
            <div className="AdRegisterLoanProduct-button-group">
              <button type="button" className="AdRegisterLoanProduct-cancel-button" onClick={handleCancel}>취소</button>
              <button type="submit" className="AdRegisterLoanProduct-submit-button">등록</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdRegisterLoanProduct;
