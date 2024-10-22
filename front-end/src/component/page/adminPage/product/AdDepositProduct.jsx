import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar'; // 사이드바 추가
import '../../../../resource/css/admin/AdDepositProduct.css'; // CSS 파일 추가

const AdDepositProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [deposits, setDeposits] = useState([]);
  const [displayCount, setDisplayCount] = useState(10);
  const token = localStorage.getItem("token");

  const fetchDeposits = () => {
    axios.get('http://localhost:8081/admin/deposits', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((response) => {
      setDeposits(response.data);
    })
    .catch((error) => {
      console.error('예금 상품 목록을 불러오는 중 오류 발생:', error);
    });
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleEdit = (deposit) => {
    navigate('/adEditSavingsProduct', { state: { deposit } });
  };

  const handleDelete = async (depositNo) => {
    try {
      await axios.put(`http://localhost:8081/admin/deleteDeposit/${depositNo}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('해당 상품이 삭제되었습니다.');
      fetchDeposits();
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
      alert('삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleRegister = () => {
    navigate('/admin/RegisterProduct');
  };

  return (
    <div className="AdDepositProduct-app-container">
      <Sidebar />
      <div className="AdDepositProduct-main-content">
        <div className="AdDepositProduct-product-container">
          <h2>예금 상품 관리</h2>
          <div className="AdDepositProduct-search-controls">
            <div className="AdDepositProduct-search-bar">
              <select>
                <option value="전체">전체</option>
                <option value="분류">분류</option>
                <option value="상품명">상품명</option>
                <option value="금리">금리</option>
                <option value="금액">금액</option>
              </select>
              <input type="text" placeholder="검색어를 입력하세요" />
              <button className="AdDepositProduct-search-button">검색</button>
            </div>
            <button className="AdDepositProduct-register-button" onClick={handleRegister}>등록</button>
          </div>

          <table className="AdDepositProduct-table">
            <thead>
              <tr>
                <th>노출순서</th>
                <th>상품이름</th>
                <th>상품 종류</th>
                <th>최대 금액</th>
                <th>최대 기간</th>
                <th>최대 금리</th>
                <th>최소 금액</th>
                <th>최소 기간</th>
                <th>최소 금리</th>
                <th>상품 설명</th>
                <th>상태</th>
                <th>수정</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((deposit, index) => (
                <tr key={deposit.depositNo}>
                  <td>{index + 1}</td>
                  <td>{deposit.depositName}</td>
                  <td>{deposit.depositCategory}</td>
                  <td>{deposit.depositMaximumAmount}</td>
                  <td>{deposit.depositMaximumDate}</td>
                  <td>{deposit.depositMaximumRate}</td>
                  <td>{deposit.depositMinimumAmount}</td>
                  <td>{deposit.depositMinimumDate}</td>
                  <td>{deposit.depositMinimumRate}</td>
                  <td>{deposit.depositContent}</td>
                  <td>{deposit.depositState}</td>          
                  <td><button className="AdDepositProduct-edit-button" onClick={() => handleEdit(deposit)}>수정</button></td>
                  <td><button className="AdDepositProduct-delete-button" onClick={() => handleDelete(deposit.depositNo)}>삭제</button></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="AdDepositProduct-pagination-controls">
            <label>페이지당 항목 수: </label>
            <select onChange={(e) => setDisplayCount(e.target.value)}>
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDepositProduct;
