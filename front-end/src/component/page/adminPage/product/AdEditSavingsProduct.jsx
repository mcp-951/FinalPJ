import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar'; // 사이드바 추가
import '../../../../resource/css/admin/EditSavingsProduct.css'; // 적절한 CSS 파일 경로 사용

const AdEditSavingsProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [formData, setFormData] = useState({
    depositNo: '', // 상품 번호 (수정 불가)
    depositCategory: '', // 상품종류
    depositName: '', // 상품이름
    depositMaximumAmount: '', // 최대 금액
    depositMaximumDate: '', // 최대 기간
    depositMaximumRate: '', // 최대 금리
    depositMinimumAmount: '', // 최소 금액
    depositMinimumDate: '', // 최소 기간
    depositMinimumRate: '', // 최소 금리
    depositContent: '', // 상품설명
    depositState: '' // 상품 상태
  });

  const token = localStorage.getItem("token");

  // 데이터가 state로 넘어온 경우 state를 우선 사용, 넘어오지 않았다면 API 호출
  useEffect(() => {
    if (location.state?.deposit) {
      const { depositNo, depositCategory, depositName, depositMaximumAmount, depositMaximumDate, depositMaximumRate, depositMinimumAmount, depositMinimumDate, depositMinimumRate, depositContent, depositState } = location.state.deposit;
      setFormData({
        depositNo,
        depositCategory,
        depositName,
        depositMaximumAmount,
        depositMaximumDate,
        depositMaximumRate,
        depositMinimumAmount,
        depositMinimumDate,
        depositMinimumRate,
        depositContent,
        depositState,
      });
      setLoading(false);
    } else {
      alert("상품 정보가 없습니다.");
      navigate('/admin/adDepositProduct'); // 상품 목록 페이지로 이동
    }
  }, [location.state, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    navigate(-1); // 취소하면 목록으로 이동
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8081/admin/editSavings/${formData.depositNo}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가   
        }
      });
      alert("수정이 완료되었습니다.");
      navigate(-1); // 수정 후 목록으로 이동
    } catch (error) {
      console.error("수정 중 오류 발생:", error);
      alert("수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  if (loading) {
    return <div>로딩 중...</div>; // 로딩 중일 때 로딩 메시지 표시
  }

  return (
    <div className="app-container">
      <Sidebar /> {/* 사이드바 추가 */}
      <div className="alog-main-content">
        <div className="edit-container">
          <h2>예금/적금 상품 수정</h2>
          <form onSubmit={handleSubmit}>
            <table className="edit-table">
              <tbody>
                <tr>
                  <td>상품 번호</td>
                  <td>
                    <input
                      type="text"
                      name="depositNo"
                      value={formData.depositNo}
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
                      name="depositName"
                      value={formData.depositName}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>상품 종류</td>
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
                  <td>최대 금액</td>
                  <td>
                    <input
                      type="number"
                      name="depositMaximumAmount"
                      value={formData.depositMaximumAmount}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>최대 기간</td>
                  <td>
                    <input
                      type="number"
                      name="depositMaximumDate"
                      value={formData.depositMaximumDate}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>최대 금리</td>
                  <td>
                    <input
                      type="number"
                      name="depositMaximumRate"
                      value={formData.depositMaximumRate}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>최소 금액</td>
                  <td>
                    <input
                      type="number"
                      name="depositMinimumAmount"
                      value={formData.depositMinimumAmount}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>최소 기간</td>
                  <td>
                    <input
                      type="number"
                      name="depositMinimumDate"
                      value={formData.depositMinimumDate}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>최소 금리</td>
                  <td>
                    <input
                      type="number"
                      name="depositMinimumRate"
                      value={formData.depositMinimumRate}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>상품 설명</td>
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
                  <td>상태</td>
                  <td>
                    <input
                      type="text"
                      name="depositState"
                      value={formData.depositState}
                      readOnly
                      disabled
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

export default AdEditSavingsProduct;
