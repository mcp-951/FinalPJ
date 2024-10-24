import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar'; // Sidebar 추가
import '../../../../resource/css/admin/AdRegisterProduct.css'; // CSS 파일 추가

const AdRegisterProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    depositName: '',
    depositCategory: '',
    depositContent: '',
    depositCharacteristic: '',
    depositMinimumAmount: '',
    depositMaximumAmount: '',
    depositMinimumRate: '',
    depositMaximumRate: '',
    depositMinimumDate: '',
    depositMaximumDate: '', // 추가된 상태 필드
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 취소 버튼 클릭 시 이전 페이지로 이동
  const handleCancel = () => {
    navigate(-1);
  };

  const handleRegister = async (e) => {
    e.preventDefault(); // 기본 폼 제출 방지
    try {
      await axios.post('http://13.125.114.85:8081/admin/register-product', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // JWT 토큰 사용
        }
      });
      navigate(-1); // 등록 후 이전 페이지로 이동
    } catch (error) {
      console.error('상품 등록에 실패했습니다.', error);
    }
  };

  return (
    <div className="AdRegisterProduct-container">
      <Sidebar /> {/* Sidebar 추가 */}
      <div className="AdRegisterProduct-main-content">
        <div className="AdRegisterProduct-form-container">
          <h2>예금/적금 상품 등록</h2>
          <table className="AdRegisterProduct-table">
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
                  <select
                    name="depositCategory"
                    value={formData.depositCategory}
                    onChange={handleChange}
                  >
                    <option value="1">예금</option>
                    <option value="2">적금</option>
                  </select>
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
                <td>상품 특성:</td>
                <td>
                  <input
                    type="text"
                    name="depositCharacteristic"
                    value={formData.depositCharacteristic}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>최소 예치 금액:</td>
                <td>
                  <input
                    type="number"
                    name="depositMinimumAmount"
                    value={formData.depositMinimumAmount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </td>
              </tr>
              <tr>
                <td>최대 예치 금액:</td>
                <td>
                  <input
                    type="number"
                    name="depositMaximumAmount"
                    value={formData.depositMaximumAmount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </td>
              </tr>
              <tr>
                <td>최소 금리:</td>
                <td>
                  <input
                    type="number"
                    name="depositMinimumRate"
                    value={formData.depositMinimumRate}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </td>
              </tr>
              <tr>
                <td>최대 금리:</td>
                <td>
                  <input
                    type="number"
                    name="depositMaximumRate"
                    value={formData.depositMaximumRate}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </td>
              </tr>
              <tr>
                <td>최소 기간:</td>
                <td>
                  <input
                    type="text"
                    name="depositMinimumDate"
                    value={formData.depositMinimumDate}
                    onChange={handleChange}
                    min="0"
                  />
                </td>
              </tr>
              <tr>
                <td>최대 기간:</td>
                <td>
                  <input
                    type="text"
                    name="depositMaximumDate"
                    value={formData.depositMaximumDate}
                    onChange={handleChange}
                    min="0"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="AdRegisterProduct-button-group">
            <button type="button" className="AdRegisterProduct-cancel-button" onClick={handleCancel}>
              취소
            </button>
            <button type="button" className="AdRegisterProduct-submit-button" onClick={handleRegister}>
              등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdRegisterProduct;
