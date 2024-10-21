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
    depositRate: '', // 금리
    depositContent: '', // 상품설명
    depositIMG: '', // 상품 이미지
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (location.state?.deposit) {
      const { depositNo, depositCategory, depositName, depositRate, depositContent, depositIMG } = location.state.deposit;
      setFormData({
        depositNo,
        depositCategory,
        depositName,
        depositRate,
        depositContent,
        depositIMG,
      });
      setLoading(false);
    } else {
      const productId = formData.depositName;
      axios.get(`http://localhost:8081/admin/getSavingsProduct/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(response => {
        setFormData({
          depositNo: response.data.depositNo,
          depositCategory: response.data.depositCategory,
          depositName: response.data.depositName,
          depositRate: response.data.depositRate,
          depositContent: response.data.depositContent,
          depositIMG: response.data.depositIMG,
        });
        setLoading(false);
      }).catch(error => {
        console.error('데이터를 불러오는 중 오류 발생:', error);
        setLoading(false);
      });
    }
  }, [location.state, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    navigate('/admin/financialProduct');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8081/admin/editSavings/${formData.depositNo}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert("수정이 완료되었습니다.");
      navigate("/admin/financialProduct");
    } catch (error) {
      console.error("수정 중 오류 발생:", error);
      alert("수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="app-container">
      <Sidebar />
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
                  <td>금리</td>
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
                  <td>상품 이미지</td>
                  <td>
                    <input
                      type="text"
                      name="depositIMG"
                      value={formData.depositIMG}
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

export default AdEditSavingsProduct;
