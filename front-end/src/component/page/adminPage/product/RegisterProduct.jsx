import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar'; // Sidebar 추가
import '../../../../resource/css/admin/EditSavingsProduct.css'; // CSS 파일 추가

const RegisterProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    depositName: '',
    depositCategory: '',  
    depositRate: '',
    depositPeriod: '',
    depositContent: '',
    depositIMG: '',
    repaymentType: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 취소 버튼 클릭 시 FinancialProduct 페이지로 이동
  const handleCancel = () => {
    navigate('/admin/financialProduct');
  };

  const handleRegister = async (e) => {
    e.preventDefault(); // 기본 폼 제출 방지
    try {
      await axios.post('http://localhost:8081/admin/register-product', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // JWT 토큰 사용
        }
      });
      navigate('/admin/financialProduct'); // 등록 후 FinancialProduct 페이지로 이동
    } catch (error) {
      console.error('상품 등록에 실패했습니다.', error);
    }
  };

  return (
    <div className="app-container">
      <Sidebar /> {/* Sidebar 추가 */}
      <div className="alog-main-content">
        <div className="register-product-container">
          <h2>상품 등록</h2>
          <table className="register-table">
            <tbody>
              <tr>
                <td>상품명:</td>
                <td>
                  <input
                    type="text"
                    name="depositName"
                    value={formData.depositName}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>상품 종류:</td>
                <td>
                  <input
                    type="text"
                    name="depositCategory"
                    value={formData.depositCategory}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>금리:</td>
                <td>
                  <input
                    type="text"
                    name="depositRate"
                    value={formData.depositRate}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>상품 설명:</td>
                <td>
                  <input
                    type="text"
                    name="depositContent"
                    value={formData.depositContent}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>상품 이미지:</td>
                <td>
                  <input
                    type="text"
                    name="depositIMG"
                    value={formData.depositIMG}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>상환 방식:</td>
                <td>
                  <input
                    type="text"
                    name="repaymentType"
                    value={formData.repaymentType}
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
            <button type="button" onClick={handleRegister}> {/* onClick으로 변경 */}
              등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterProduct;
