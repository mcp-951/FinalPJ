import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../../util/Footer'; // Footer 컴포넌트 임포트
import '../../../../resource/css/product/DepositList.css'; // 예금 상품 관련 CSS 파일

// 예금 상품 항목 컴포넌트 (DepositItem)
const DepositItem = ({ title, description, rate }) => {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    // 세션에 예금 상품 정보 저장
    sessionStorage.setItem('selectedDepositProduct', JSON.stringify({ title, description, rate }));
    // 예금 상품 상세 페이지로 이동
    navigate('/DepositMain');
  };

  return (
    <div className="deposit-item">
      <h3>{title}</h3>
      <p>{description}</p>
      <strong>연 {rate}%</strong>
      <div className="buttons">
        <button onClick={handleDetailClick}>상세보기</button>
        <button onClick={handleDetailClick}>가입하기</button>
      </div>
    </div>
  );
};

// 예금 상품 리스트 컴포넌트 (DepositList)
const DepositList = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // 예시 상품 데이터
  const productsPerPage = 3;
  const depositProducts = [
    { title: '우람 정기예금', description: '우람은행의 고이율 정기예금', rate: 4.0 },
    { title: '우람 적금', description: '우람은행의 정기 적금 상품', rate: 3.5 },
    { title: '우람 청약저축', description: '내집 마련을 위한 청약저축', rate: 2.0 },
    { title: '단기 예금', description: '단기간 예금 상품', rate: 2.8 },
    { title: '장기 예금', description: '장기간 예금 상품', rate: 3.2 },
    { title: '기업 예금', description: '기업 고객을 위한 예금 상품', rate: 3.8 },
  ];

  // 페이지 계산
  const totalPages = Math.ceil(depositProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = depositProducts.slice(startIndex, startIndex + productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app">
      <h1>예금 상품 리스트</h1>
      <div className="product-list">
        {currentProducts.map((product, index) => (
          <DepositItem
            key={index}
            title={product.title}
            description={product.description}
            rate={product.rate}
          />
        ))}
      </div>
      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />

      {/* 예금 관련 수수료 테이블 추가 */}
      <div className="fee-table-container">
        <h2>예금 관련 수수료</h2>
        <table className="fee-table">
          <thead>
            <tr>
              <th>이용형태</th>
              <th>단위/기준</th>
              <th>일반고객</th>
              <th>할인고객</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>창구 송금수수료 (같은 은행으로 보낼 때)</td>
              <td>10만원 이하</td>
              <td>500원</td>
              <td>400원</td>
            </tr>
            <tr>
              <td>창구 송금수수료 (다른 은행으로 보낼 때)</td>
              <td>10만원 초과 ~ 100만원 이하</td>
              <td>2,000원</td>
              <td>1,600원</td>
            </tr>
            <tr>
              <td>추심 수수료</td>
              <td>10만원 이하</td>
              <td>2,000원</td>
              <td>1,600원</td>
            </tr>
            <tr>
              <td>추심 수수료</td>
              <td>100만원 초과</td>
              <td>3,500원</td>
              <td>3,000원</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer 추가 */}
      <Footer />
    </div>
  );
};

// 페이지네이션 컴포넌트 (Pagination)
const Pagination = ({ totalPages, currentPage, onPageChange }) => (
  <div className="pagination">
    {[...Array(totalPages)].map((_, index) => (
      <button
        key={index}
        className={currentPage === index + 1 ? 'active' : ''}
        onClick={() => onPageChange(index + 1)}
      >
        {index + 1}
      </button>
    ))}
  </div>
);

export default DepositList;
