import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar'; // Sidebar 추가
import '../../../../resource/css/admin/RegisterLoanProduct.css'; // CSS 파일 추가

const RegisterLoanProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loanName: '',
    loanRate: '',
    loanContent: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    navigate('/admin/loanProduct'); // 취소 시 목록으로 이동
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8081/admin/register-loanProduct', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate('/admin/financialProduct'); // 등록 후 목록 페이지로 이동
    } catch (error) {
      console.error('상품 등록에 실패했습니다.', error);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="alog-main-content">
        <div className="register-product-container">
          <h2>대출 상품 등록</h2>
          <form onSubmit={handleRegister}>
            <table className="register-table">
              <tbody>
                <tr>
                  <td>상품명:</td>
                  <td><input type="text" name="loanName" value={formData.loanName} onChange={handleChange} /></td>
                </tr>
                <tr>
                  <td>금리:</td>
                  <td><input type="text" name="loanRate" value={formData.loanRate} onChange={handleChange} /></td>
                </tr>
                <tr>
                  <td>상품 설명:</td>
                  <td><input type="text" name="loanContent" value={formData.loanContent} onChange={handleChange} /></td>
                </tr>
              </tbody>
            </table>
            <div className="button-group">
              <button type="button" onClick={handleCancel}>취소</button>
              <button type="submit">등록</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterLoanProduct;
