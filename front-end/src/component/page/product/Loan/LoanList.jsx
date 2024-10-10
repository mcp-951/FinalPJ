import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from 'component/ApiService'; // API 서비스 임포트
import '../../../../resource/css/product/LoanList.css';

// 상품 항목 컴포넌트 (ProductItem)
const ProductItem = ({ productName, productContent, productRate, productPeriod }) => {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    // 세션에 상품 정보 저장
    sessionStorage.setItem(
      'selectedProduct',
      JSON.stringify({ productName, productContent, productRate, productPeriod }) // productPeriod 포함
    );
    // 상세 페이지로 이동
    navigate('/LoanMain');
  };

  return (
    <div className="product-item">
      <h3>{productName}</h3>
      <p>{productContent}</p>
      <strong>연 {productRate}%</strong>
      <p>기간: {productPeriod}개월</p> {/* productPeriod가 int로 변경되었으므로 단위 추가 */} 
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
        productName={product.productName}
        productContent={product.productContent}
        productRate={product.productRate}
        productPeriod={product.productPeriod} // productPeriod 전달
      />
    ))}
  </div>
);

// 메인 컴포넌트 (ProductMain)
const ProductMain = () => {
  const [products, setProducts] = useState([]);  // 상품 데이터를 저장하는 state
  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지
  const [totalPages, setTotalPages] = useState(0);  // 총 페이지 수
  const productsPerPage = 8;  // 페이지당 상품 개수

  useEffect(() => {
    // API를 호출하여 대출 상품 데이터 가져오기
    ApiService.fetchLoanProductsPaged(currentPage - 1, productsPerPage)
      .then(response => {
        console.log('API Response:', response.data);  // 콘솔에 응답 출력
        setProducts(response.data.content);  // 상품 데이터 설정
        setTotalPages(response.data.totalPages);  // 총 페이지 수 설정
      })
      .catch(error => {
        console.error('Error fetching loan products:', error);
      });
  }, [currentPage]);  // currentPage가 변경될 때마다 API 호출

  const handlePageChange = (page) => {
    setCurrentPage(page);  // 페이지 변경
  };

  return (
    <div className="app">
      <h1>대출 상품 리스트</h1>
      <ProductList products={products} />
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
        disabled={currentPage === index + 1}  // 현재 페이지는 비활성화
      >
        {index + 1}
      </button>
    ))}
  </div>
);

export default ProductMain;
