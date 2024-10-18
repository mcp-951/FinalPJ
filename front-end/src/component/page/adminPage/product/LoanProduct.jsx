import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar'; // 사이드바 추가
import '../../../../resource/css/admin/LoanProduct.css'; // CSS 파일 추가

const LoanProduct = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);  // 대출 상품 목록 상태 관리
  const token = localStorage.getItem("token");

  // 대출 상품 목록 불러오기
  const fetchLoans = () => {
    axios.get('http://localhost:8081/admin/loans', {
      headers: {
        'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
      }
    })
    .then((response) => {
      setLoans(response.data);  // 불러온 데이터를 loans 상태로 설정
    })
    .catch((error) => {
      console.error('대출 상품 목록을 불러오는 중 오류 발생:', error);
    });
  };

  // 페이지가 처음 로드될 때 대출 상품 목록을 가져옴
  useEffect(() => {
    fetchLoans();
  }, []);

  // 수정 버튼 클릭 시 수정 페이지로 이동
  const handleEdit = (loan) => {
    navigate('/EditLoanProduct', { state: { loan } }); // 상품 정보를 상태로 전달하여 수정 페이지로 이동
  };

  // 삭제 버튼 클릭 시 loanState를 'Closed'로 변경
  const handleDelete = async (loanNo) => {
    try {
      await axios.put(`http://localhost:8081/admin/deleteLoan/${loanNo}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('해당 대출 상품이 삭제되었습니다.');
      fetchLoans(); // 삭제 후 대출 상품 목록 다시 불러오기
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
      alert('삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 등록 버튼 클릭 시 RegisterLoanProduct 페이지로 이동
  const handleRegister = () => {
    navigate('/admin/RegisterLoanProduct');
  };

  return (
    <div className="app-container">
      <Sidebar /> {/* 사이드바 추가 */}
      <div className="LoanProduct-main-content">
        <div className="LoanProduct-container">
          <h2>대출 상품 관리</h2>
          <table className="LoanProduct-table">
            <thead>
              <tr>
                <th>노출순서</th>
                <th>상품이름</th>
                <th>금리</th>
                <th>상품 설명</th>
                <th>상태</th>
                <th>수정</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan, index) => (
                <tr key={loan.loanNo}>
                  <td>{index + 1}</td>
                  <td>{loan.loanName}</td>
                  <td>{loan.loanRate}</td>
                  <td>{loan.loanContent}</td>
                  <td>{loan.loanState}</td>
                  <td>
                    <button className="LoanProduct-edit-btn" onClick={() => handleEdit(loan)}>수정</button>
                  </td>
                  <td>
                    <button className="LoanProduct-delete-btn" onClick={() => handleDelete(loan.loanNo)}>삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="LoanProduct-register-btn" onClick={handleRegister}>등록</button>
        </div>
      </div>
    </div>
  );
};

export default LoanProduct;
