import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar'; // 사이드바
import { Chart } from 'react-google-charts'; // 구글 차트 사용
import '../../../../resource/css/admin/FinancialProduct.css'; // 수정된 CSS 파일 추가

const FinancialProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); // 상품 리스트 관리
  const [filteredProducts, setFilteredProducts] = useState([]); // 필터링된 상품 리스트 관리
  const [filterState, setFilterState] = useState('Y'); // 필터 상태: 'Y', 'n'
  const [chartData, setChartData] = useState([
    ['상품 유형', '갯수'],
    ['예금', 0],
    ['적금', 0],
    ['대출', 0],
  ]); // 기본 차트 데이터 형식 설정
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 추가
  const itemsPerPage = 5; // 한 페이지당 보여줄 항목 수
  const token = localStorage.getItem("token");

  // 전체 금융 상품 조회 API 호출
  const fetchProducts = () => {
    axios.get('http://localhost:8081/admin/financial-products', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then((response) => {
      setProducts(response.data); // 상품 리스트 설정
      setFilteredProducts(response.data); // 필터링된 상품 리스트도 기본으로 설정
    })
    .catch((error) => {
      console.error('금융 상품 목록을 불러오는 중 오류 발생:', error);
    });
  };

  // 차트 데이터 API 호출
  const fetchChartData = () => {
    axios.get('http://localhost:8081/admin/product-counts', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then((response) => {
      const chartDataArray = [
        ['상품 유형', '갯수'],
        ['예금', response.data.Deposits || 0],
        ['적금', response.data.Savings || 0],
        ['대출', response.data.Loans || 0],
      ];

      setChartData(chartDataArray); // 변환된 데이터 설정
      setLoading(false); // 로딩 완료 시 로딩 상태 false로 변경
    })
    .catch((error) => {
      setLoading(false); // 오류 발생 시에도 로딩 상태 false로 변경
    });
  };

  useEffect(() => {
    fetchProducts(); // 페이지 로드시 상품 데이터 호출
    fetchChartData(); // 차트 데이터 호출
  }, [token]);

  // 현재 페이지에 보여줄 상품 데이터
  const currentItems = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 다음 페이지로 이동
  const handleNextPage = () => {
    if (currentPage * itemsPerPage < filteredProducts.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 이전 페이지로 이동
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 상태 필터링 기능
  const toggleFilterState = () => {
    if (filterState === 'Y') {
      setFilterState('n');
      setFilteredProducts(products.filter(product => product.depositState === 'n' || product.loanState === 'n'));
    } else {
      setFilterState('Y');
      setFilteredProducts(products.filter(product => product.depositState === 'Y' || product.loanState === 'Y'));
    }
    setCurrentPage(1); // 필터 변경 시 페이지를 첫 페이지로 초기화
  };

  // 예/적금 등록 버튼 클릭 시
  const handleSavingsRegister = () => {
    navigate('/admin/RegisterProduct'); // 예/적금 등록 페이지로 이동
  };

  // 대출 등록 버튼 클릭 시
  const handleLoanRegister = () => {
    navigate('/admin/RegisterLoanProduct'); // 대출 등록 페이지로 이동
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="alog-main-content">
        <div className="financial-main-content">
          <h2>금융 상품 관리</h2>
          <div className="chart-container">
            <Chart
              chartType="PieChart"
              data={chartData}
              options={{ title: '금일 가입량' }}
              width={'100%'}
              height={'400px'}
            />
          </div>

          {/* 등록 버튼들 유지 */}
          <div className="button-container">
            <button className="financial-register-button" onClick={handleSavingsRegister}>예/적금 등록</button>
            <button className="financial-register-button" onClick={handleLoanRegister}>대출 등록</button>
            <button className="financial-filter-button" onClick={toggleFilterState}>
              {filterState === 'Y' ? '판매금지된 상품 보기' : '판매중인 상품 보기'}
            </button>
          </div>

          <table className="product-table">
            <thead>
              <tr>
                <th>노출순서</th>
                <th>상품명</th>
                <th>상품 종류</th>
                <th>금리</th>
                <th>상품 설명</th>
                <th>상태</th>
                <th>수정</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((product, index) => (
                <tr key={product.productNo || index}>
                  <td>{index + 1}</td>
                  {product.depositName ? (
                    <>
                      <td>{product.depositName}</td>
                      <td>{product.depositCategory === 1 ? "예금" : "적금"}</td>
                      <td>{product.depositRate}%</td>
                      <td>{product.depositContent}</td>
                      <td>{product.depositState === 'Y' ? "판매중인 상품" : "판매금지된 상품"}</td>
                    </>
                  ) : (
                    <>
                      <td>{product.loanName}</td>
                      <td>대출</td>
                      <td>{product.loanRate}%</td>
                      <td>{product.loanContent}</td>
                      <td>{product.loanState === 'Y' ? "판매중인 상품" : "판매금지된 상품"}</td>
                    </>
                  )}
                  <td>
                    <button className="financial-edit-button">수정</button>
                  </td>
                  <td>
                    <button className="financial-delete-button">삭제</button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {/* 페이지 네이션 버튼 */}
          <div className="pagination">
            <button className="financial-pagination-button" onClick={handlePrevPage} disabled={currentPage === 1}>이전</button>
            <button className="financial-pagination-button" onClick={handleNextPage} disabled={currentPage * itemsPerPage >= filteredProducts.length}>다음</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialProduct;
