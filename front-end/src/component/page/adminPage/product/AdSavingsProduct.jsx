import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar'; // 사이드바 추가
import '../../../../resource/css/admin/AdSavingsProduct.css'; // CSS 파일 추가

const AdSavingsProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [savings, setSavings] = useState([]);
  const [searchField, setSearchField] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(10);
  const token = localStorage.getItem("token");

  const fetchSavings = () => {
    axios.get('http://localhost:8081/admin/savings', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((response) => {
      setSavings(response.data);
    })
    .catch((error) => {
      console.error('적금 상품 목록을 불러오는 중 오류 발생:', error);
    });
  };

  useEffect(() => {
    fetchSavings();
  }, []);

  const handleEdit = (deposit) => {
    navigate('/adEditSavingsProduct', { state: { deposit } });
  };

  const handleDelete = async (depositNo) => {
    try {
      await axios.put(`http://localhost:8081/admin/deleteSavings/${depositNo}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('해당 상품이 삭제되었습니다.');
      fetchSavings();
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
      alert('삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleRegister = () => {
    navigate('/admin/adRegisterProduct');
  };
  
  return (
    <div className="AdSavingsProduct-container">
      <Sidebar />
      <div className="AdSavingsProduct-main-content">
        <div className="AdSavingsProduct-product-container">
          <h2>적금 상품 관리</h2>
          <div className="AdSavingsProduct-search-controls">
            <div className="AdSavingsProduct-search-bar">
              <select onChange={(e) => setSearchField(e.target.value)}>
                <option value="전체">전체</option>
                <option value="분류">분류</option>
                <option value="상품명">상품명</option>
                <option value="금리">금리</option>
                <option value="금액">금액</option>
              </select>
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="AdSavingsProduct-search-button">검색</button>
            </div>
            <button className="AdSavingsProduct-register-button" onClick={handleRegister}>등록</button>
          </div>

          <table className="AdSavingsProduct-table">
            <thead>
              <tr>
                <th>노출순서</th>
                <th>상품이름</th>
                <th>상품 종류</th>
                <th>최대 금리</th>
                <th>최소 금리</th>
                <th>최대 예치 금액</th>
                <th>최소 예치 금액</th>
                <th>최대 기간</th>
                <th>최소 기간</th>
                <th>상품 설명</th>
                <th>상품 특성</th>
                <th>상태</th>
                <th>수정</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {savings.map((deposit, index) => (
                <tr key={deposit.depositNo}>
                  <td>{index + 1}</td>
                  <td>{deposit.depositName}</td>
                  <td>{deposit.depositCategory}</td>
                  <td>{deposit.depositMaximumRate}</td>
                  <td>{deposit.depositMinimumRate}</td>
                  <td>{deposit.depositMaximumAmount}</td>
                  <td>{deposit.depositMinimumAmount}</td>
                  <td>{deposit.depositMaximumDate}</td>
                  <td>{deposit.depositMinimumDate}</td>
                  <td>{deposit.depositContent}</td>
                  <td>{deposit.depositCharacteristic}</td>
                  <td>{deposit.depositState}</td>
                  <td><button className="AdSavingsProduct-edit-button" onClick={() => handleEdit(deposit)}>수정</button></td>
                  <td><button className="AdSavingsProduct-delete-button" onClick={() => handleDelete(deposit.depositNo)}>삭제</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="AdSavingsProduct-pagination-controls">
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

export default AdSavingsProduct;
