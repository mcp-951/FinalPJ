import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar'; // 사이드바 추가
import '../../../../resource/css/admin/EditSavingsProduct.css'; // CSS 파일 추가

const EditLoanProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loan = location.state?.loan || {}; // loan 데이터를 location.state에서 가져오기

  const [formData, setFormData] = useState({
    loanNo: loan.loanNo || '', // 상품 번호 (수정 불가)
    loanName: loan.loanName || '',
    loanRate: loan.loanRate || '',
    loanContent: loan.loanContent || '',
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
      await axios.put(`http://localhost:8081/admin/editLoan/${formData.loanNo}`, formData, {
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
                      name="loanNo"
                      value={formData.loanNo}
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
                      name="loanName"
                      value={formData.loanName}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>금리</td>
                  <td>
                    <input
                      type="text"
                      name="loanRate"
                      value={formData.loanRate}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>상품 설명</td>
                  <td>
                    <input
                      type="text"
                      name="loanContent"
                      value={formData.loanContent}
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

export default EditLoanProduct;
