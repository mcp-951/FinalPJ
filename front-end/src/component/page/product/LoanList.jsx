import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/LoanList.css';


// 상품 항목 컴포넌트 (ProductItem)
const ProductItem = ({ title, description, rate }) => {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    // 세션에 상품 정보 저장
    sessionStorage.setItem('selectedProduct', JSON.stringify({ title, description, rate }));
    // 상세 페이지로 이동
    navigate('/LoanMain');
  };

  return (
    <div className="product-item">
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

// 상품 리스트 컴포넌트 (ProductList)
const ProductList = ({ products }) => (
  <div className="product-list">
    {products.map((product, index) => (
      <ProductItem
        key={index}
        title={product.title}
        description={product.description}
        rate={product.rate}
      />
    ))}
  </div>
);

// 메인 컴포넌트 (ProductMain)
const ProductMain = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // 예시 상품 데이터
  const productsPerPage = 3;
  const products = [
    { title: '정기예금', description: '우람은행의 대표 정기예금', rate: 4.0 },
    { title: '주택청약종합저축', description: '내집 마련의 시작', rate: 2.0 },
    { title: '수퍼정기예금', description: '가입조건을 직접 설계하는', rate: 1.5 },
    { title: '장기적금', description: '장기간 적립 가능한 저축상품', rate: 3.0 },
    { title: '단기적금', description: '단기간 고이율 적금', rate: 2.5 },
    { title: '자동차대출', description: '자동차 구입을 위한 대출 상품', rate: 3.2 },
    { title: '신용대출', description: '개인 신용 기반 대출 상품', rate: 4.2 },
    { title: '사업자대출', description: '사업 자금을 위한 대출 상품', rate: 3.8 },
  ];

  // 페이지 계산
  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app">
      <h1>상품 리스트</h1>
      <ProductList products={currentProducts} />
      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
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

export default ProductMain;
