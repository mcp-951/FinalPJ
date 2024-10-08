import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../../resource/css/admin/FinancialProduct.css';
import { Pie } from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js'
import 'chart.js/auto';
import localStorage from 'localStorage';

const FinancialProduct = () => {
    const token = localStorage.getItem("token");    // 저장한 jwt 토큰 호출
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [summaryData, setSummaryData] = useState({
    예금: 0,
    적금: 0,
    대출: 0
  });

  useEffect(() => {
    // 금융 상품 목록 조회
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8081/admin/productList',{
            headers: {              // 백엔드 통신 시 헤더에 토큰 담아서 통신
                'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
            }
        });
        setProductList(response.data);
      } catch (error) {
        console.error('상품 목록을 불러오는 데 실패했습니다.', error);
      }
    };

    // 금융 상품 요약 데이터 조회
    const fetchSummary = async () => {
      try {
        const response = await axios.get('http://localhost:8081/product/summary',{
            headers: {
                'Authorization':`Bearer ${token}` // Authorization 헤더에 JWT 추가
            }});
        setSummaryData(response.data);
      } catch (error) {
        console.error('요약 데이터를 불러오는 데 실패했습니다.', error);
      }
    };

    fetchProducts();
    fetchSummary();
  }, []);

  // 그래프 데이터
  const data = {
    labels: ['예금', '적금', '대출'],
    datasets: [
      {
        label: '금융상품 가입량',
        data: [summaryData.예금, summaryData.적금, summaryData.대출],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56']
      }
    ]
  };

  // 수정 버튼 클릭 시 해당 상품에 맞는 수정 페이지로 이동
  const handleEdit = (product) => {
    if (product.productCategory === '예금') {
      navigate('/editSavingsProduct', { state: { product } });
    } else if (product.productCategory === '적금') {
      navigate('/editDepositProduct', { state: { product } });
    } else if (product.productCategory === '대출') {
      navigate('/editLoanProduct', { state: { product } });
    }
  };

  return (
    <div className="financial-product-container">
      <h2>금융상품 관리</h2>

      {/* 상단 그래프 */}
      <div className="chart-container">
        <Pie data={data} />
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
            <th>수정</th>
          </tr>
        </thead>
        <tbody>
          {productList.map((product, index) => (
            <tr key={product.productNo}>
              <td>{index + 1}</td>
              <td>{product.productCategory}</td>
              <td>{product.productName}</td>
              <td>{product.productRate}</td>
              <td>{product.productPeriod}</td>
              <td>{product.productContent}</td>
              <td>
                <button onClick={() => handleEdit(product)}>수정</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FinancialProduct;
