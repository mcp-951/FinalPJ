import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar'; // 사이드바 추가
import '../../../../resource/css/admin/SavingsProduct.css'; // CSS 파일 추가

const SavingsProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [savingsList, setSavingsList] = useState([]);

  // 예금 상품 목록 불러오기
  const fetchSavingsProducts = async () => {
    try {
      // '예금' 카테고리 상품만 가져오는 API 호출
      const response = await axios.get('http://localhost:8080/product/list/예금'); // 예금 상품만 필터링
      setSavingsList(response.data); // 예금 상품 목록 업데이트
    } catch (error) {
      console.error('데이터 불러오기 실패:', error);
    }
  };

  useEffect(() => {
    fetchSavingsProducts(); // 페이지 로드 시 예금 상품 목록 불러오기
  }, []);

  // 수정 후 목록 업데이트
  useEffect(() => {
    if (location.state && location.state.updated) {
      fetchSavingsProducts();
    }
  }, [location.state]);

  const handleEdit = (product) => {
    navigate('/editSavingsProduct', { state: { product } });
  };

  const handleDelete = async (productId) => {
    try {
      await axios.put(`http://localhost:8080/product/delete/${productId}`, {
        viewState: 'n'  // 상품 상태를 'n'으로 변경
      });
      fetchSavingsProducts();  // 삭제 후 목록 새로고침
    } catch (error) {
      console.error('상품 상태 변경에 실패했습니다.', error);
    }
  };

  const handleRegister = () => {
    navigate('/registerSavingsProduct');
  };

  return (
    <div className="app-container">
      <Sidebar /> {/* 사이드바 추가 */}
      <div className="main-content">
        <div className="savings-product-container">
          <h2>예금 상품 관리</h2>
          <div className="search-controls">
            <div className="search-bar">
              <select>
                <option value="전체">전체</option>
                <option value="분류">분류</option>
                <option value="상품명">상품명</option>
                <option value="금리">금리</option>
                <option value="기간">기간</option>
                <option value="금액">금액</option>
              </select>
              <input type="text" placeholder="검색어를 입력하세요" />
              <button>검색</button>
            </div>
            <button onClick={handleRegister}>등록</button>
          </div>

          <table className="product-table">
            <thead>
              <tr>
                <th>노출순서</th>
                <th>분류</th>
                <th>상품명</th>
                <th>금리</th>
                <th>기간</th>
                <th>금액</th>
                <th>내용</th>
                <th>이미지</th>
                <th>상태</th>
                <th>상환 방식</th>
                <th>수정</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {savingsList.map((product, index) => (
                <tr key={product.productNo}>
                  <td>{index + 1}</td>
                  <td>{product.productCategory}</td>
                  <td>{product.productName}</td>
                  <td>{product.productRate}</td>
                  <td>{product.productPeriod}</td>
                  <td>{product.amount}</td>
                  <td>{product.productContent}</td>
                  <td><img src={product.productIMG} alt="상품 이미지" width="50" /></td>
                  <td>{product.viewState}</td>
                  <td>{product.repaymentType}</td>
                  <td><button onClick={() => handleEdit(product)}>수정</button></td>
                  <td><button onClick={() => handleDelete(product.productNo)}>삭제</button></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-controls">
            <label>페이지당 항목 수: </label>
            <select>
              <option>10</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsProduct;
