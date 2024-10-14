import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // API 호출을 위해 axios 사용

// 사이드바 컴포넌트 추가
const Sidebar = () => {
  return (
    <div className="savings-product-sidebar">
      <h3>관리자 페이지</h3>
      <ul>
        <li>회원 관리</li>
        <li>금융 상품 관리</li>
        <li>계좌 관리</li>
        <li>환전 관리</li>
      </ul>
    </div>
  );
};

const SavingsProduct = () => {
  const navigate = useNavigate();
  const [savingsList, setSavingsList] = useState([]);

  // API 호출로 데이터를 가져오는 함수
  const fetchSavingsProducts = async () => {
    try {
      const response = await axios.get('/api/savings/list');  // 적절한 API 엔드포인트 설정
      setSavingsList(response.data);
    } catch (error) {
      console.error('데이터 가져오기에 실패했습니다.', error);
    }
  };

  useEffect(() => {
    fetchSavingsProducts();  // 컴포넌트가 마운트될 때 데이터를 가져옴
  }, []);

  const handleEdit = (product) => {
    navigate('/editSavingsProduct', { state: { product } });
  };

  const handleRegister = () => {
    navigate('/registerSavingsProduct');
  };

  return (
    <div className="app-container">
      {/* 사이드바를 추가하여 메인 콘텐츠와 분리 */}
      <Sidebar />

      <div className="savings-product-main-content">
        <div className="savings-product-container">
          <h2>대출 상품 관리</h2>
          <div className="savings-search-controls">
            <div className="savings-search-bar">
              {/* 검색 기능 구현 */}
              <select>
                <option value="전체">전체</option>
                <option value="분류">분류</option>
                <option value="상품명">상품명</option>
              </select>
              <input type="text" placeholder="검색어를 입력하세요" />
              <button>검색</button>
            </div>
            <button onClick={handleRegister}>등록</button>
          </div>

          <table className="savings-product-table">
            <thead>
              <tr>
                <th>노출순서</th>
                <th>분류</th>
                <th>상품명</th>
                <th>금리</th>
                <th>기간</th>
                <th>금액</th>
                <th>수정</th>
              </tr>
            </thead>
            <tbody>
              {savingsList.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td>{product.type}</td>
                  <td>{product.productName}</td>
                  <td>{product.interestRate}</td>
                  <td>{product.period}</td>
                  <td>{product.amount}</td>
                  <td><button onClick={() => handleEdit(product)}>수정</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SavingsProduct;
