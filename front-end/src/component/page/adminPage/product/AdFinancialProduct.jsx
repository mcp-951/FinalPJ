import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar'; // 사이드바
import { Chart } from 'react-google-charts'; // 구글 차트 사용
import '../../../../resource/css/admin/SavingsProduct.css'; // CSS 추가

const AdFinancialProduct = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]); // 상품 리스트 관리
    // const [filterState, setFilterState] = useState('all'); // 필터 상태: 'all', 'y', 'n'
    const [chartData, setChartData] = useState([
        ['상품 유형', '갯수'],
        ['예금', 0],
        ['적금', 0],
        ['대출', 0],
    ]); // 기본 차트 데이터 형식 설정
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const token = localStorage.getItem("token");

  // 전체 금융 상품 조회 API 호출
  const fetchProducts = () => {
    console.log("Fetching products...");
    axios.get('http://localhost:8081/admin/financial-products', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log("Products fetched:", response.data);
      setProducts(response.data); // 상품 리스트 설정
    })
    .catch((error) => {
      console.error('금융 상품 목록을 불러오는 중 오류 발생:', error);
    });
  };

  // 차트 데이터 API 호출
  // 차트 데이터 API 호출
const fetchChartData = () => {
  console.log("fetchChartData...");
  axios.get('http://localhost:8081/admin/product-counts', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
  .then((response) => {
    console.log("Chart data fetched from server:", response.data); // 응답 데이터 로그 확인

    // 실제 데이터를 차트 라이브러리 형식으로 변환
    const chartDataArray = [
      ['상품 유형', '갯수'],
      ['예금', response.data.Deposits || 0],
      ['적금', response.data.Savings || 0],
      ['대출', response.data.Loans || 0],
    ];

    console.log("Chart data after formatting:", chartDataArray); // 변환된 차트 데이터 로그 확인
    setChartData(chartDataArray); // 변환된 데이터 설정
    setLoading(false); // 로딩 완료 시 로딩 상태 false로 변경
  })
  .catch((error) => {
    console.error('차트 데이터를 불러오는 중 오류 발생:', error);
    setLoading(false); // 오류 발생 시에도 로딩 상태 false로 변경
  });
};


  useEffect(() => {
    fetchProducts(); // 페이지 로드시 상품 데이터 호출
    fetchChartData(); // 차트 데이터 호출
  }, [token]);

  // 예/적금 등록 버튼 클릭 시
  const handleSavingsRegister = () => {
    navigate('/admin/adRegisterProduct'); // 예/적금 등록 페이지로 이동
  };

  // 대출 등록 버튼 클릭 시
  const handleLoanRegister = () => {
    navigate('/admin/adRegisterLoanProduct'); // 대출 등록 페이지로 이동
  };

  // 수정 버튼 클릭 시 해당 상품의 타입에 맞는 수정 페이지로 이동
  const handleEdit = (product) => {
    console.log("Product 정보:", product); // product 정보 확인
  
    if (product && (product.loanName || product.depositName)) {
      
      if (product.loanName && product.loanName.includes("대출")) {
        console.log("product(loan) : "+ product.loanName)
        console.log("product(loan) : "+ product)
        navigate("/adEditLoanProduct", { state: { loan: product } }); // 대출 수정 페이지로 이동
      } else if (product.depositName) {
        console.log("product(loan) : "+ product.depositName)
        console.log("product(loan) : "+ product)
        navigate("/adEditSavingsProduct", { state: { deposit: product } }); // 예/적금 수정 페이지로 이동
      } else {
        console.error("상품 정보가 유효하지 않습니다.", product);
        alert("유효하지 않은 상품입니다.");
      }
    } else {
      console.error("상품 정보가 유효하지 않습니다.", product);
      alert("유효하지 않은 상품입니다.");
    }
  };
  
  // 삭제 버튼 클릭 시 상품 삭제
  const handleDelete = async (productNo, type) => {
    try {
      const response = await axios.put(`http://localhost:8081/admin/deleteProduct/${productNo}`, { type }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log("Delete response:", response);
      alert('해당 상품이 삭제되었습니다.');
      fetchProducts(); // 삭제 후 상품 목록 다시 불러오기
    } catch (error) {
      console.error('상품 삭제 중 오류 발생:', error);
      alert('상품 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // // 상태 필터링 기능
  // const toggleFilterState = () => {
  //   if (filterState === 'all') {
  //     setFilterState('n'); // n인 상품만 필터링
  //     setFilteredProducts(products.filter(product => product.depositState === 'N' || product.loanState === 'N'));
  //   } else if (filterState === 'n') {
  //     setFilterState('y'); // y인 상품만 필터링
  //     setFilteredProducts(products.filter(product => product.depositState === 'Y' || product.loanState === 'Y'));
  //   } else {
  //     setFilterState('all'); // 모든 상품 보이기
  //     setFilteredProducts(products); // 원래 리스트로 복원
  //   }
  // };

  return (
    <div className="app-container">
      <Sidebar /> {/* 사이드바 추가 */}
      <div className="alog-main-content">
        <div className="financial-main-content">
          <h2>금융 상품 관리</h2>
              <div className="chart-container">
                {console.log("차트 데이터 확인:", chartData)}
                {/* 구글 원형 차트 */}
                <Chart
                  chartType="PieChart"
                  data={chartData}
                  options={{ title: '금일 가입량' }}
                  width={'100%'}
                  height={'400px'}
                />
              </div>

              <div className="button-container">
                <button onClick={handleSavingsRegister}>예/적금 등록</button>
                <button onClick={handleLoanRegister}>대출 등록</button>
                {/* <button onClick={toggleFilterState}>
                  {filterState === 'all' ? '판매금지된 상품 보기' : filterState === 'n' ? '판매중인 상품 보기' : '전체 상품 보기'}
                </button> */}
              </div>

              <table className="product-table">
                <thead>
                  <tr>
                    <th>노출순서</th>
                    <th>상품명</th>
                    <th>상품 종류</th>
                    <th>최소/최대 금리</th>
                    <th>최소/최대 금액</th>
                    <th>최소/최대 기간</th>
                    <th>상품 특성</th>
                    <th>상품 설명</th>
                    <th>이미지</th>
                    <th>상태</th>
                    <th>수정</th>
                    <th>삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.productNo || index}>
                      <td>{index + 1}</td>

                      {/* 예금/적금 상품일 때 */}
                      {product.depositName ? (
                        <>
                          <td>{product.depositName}</td>
                          <td>{product.depositCategory === 1 ? "예금" : product.depositCategory === 3 ? "적금" : "외환"}</td>
                          <td>{product.depositMinimumRate}% / {product.depositMaximumRate}%</td>
                          <td>{product.depositMinimumAmount} / {product.depositMaximumAmount}원</td>
                          <td>{product.depositMinimumDate} / {product.depositMaximumDate}개월</td>
                          <td>{product.depositCharacteristic}</td>
                          <td>{product.depositContent}</td>
                          <td><img src={product.depositIMG} alt="상품 이미지" width="50" /></td>
                          <td>{product.depositState === 'Y' ? "판매중" : "판매 중지"}</td>
                        </>
                      ) : (
                        // 대출 상품일 때
                        <>
                          <td>{product.loanProductTitle}</td>
                          <td>대출</td>
                          <td>{product.minInterestRate}% / {product.maxInterestRate}%</td>
                          <td>{product.loanMinLimit} / {product.loanMaxLimit}원</td>
                          <td>{product.loanMinTern} / {product.loanMaxTern}개월</td>
                          <td>-</td> {/* 대출 상품에는 상품 특성이 없으므로 빈 칸 */}
                          <td>{product.loanContent}</td>
                          <td>-</td> {/* 대출 상품에 이미지는 없으므로 빈 칸 */}
                          <td>{product.viewPoint === 'Y' ? "판매중" : "판매 중지"}</td>
                        </>
                      )}
                      <td>
                        <button onClick={() => handleEdit(product)}>수정</button>
                      </td>
                      <td>
                        <button onClick={() => handleDelete(product.productNo, product.type)}>삭제</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

          </div>    
        </div>
      </div>
  );
};

export default AdFinancialProduct;
