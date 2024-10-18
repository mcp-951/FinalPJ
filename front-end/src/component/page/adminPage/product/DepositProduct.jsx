import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar'; // 사이드바 추가
import '../../../../resource/css/admin/DepositProduct.css'; // CSS 파일 추가

// 예금 상품 가져오기
const DepositProduct = () => {
  const navigate = useNavigate();
  const location = useLocation(); // location 훅 사용
  const [deposits, setDeposits] = useState([]);  // 예금 상품 목록 상태 관리
  const [searchField, setSearchField] = useState('전체');  // 검색 필드 상태 관리
  const [searchTerm, setSearchTerm] = useState('');  // 검색어 상태 관리
  const [displayCount, setDisplayCount] = useState(10);  // 페이지당 표시할 상품 수 상태 관리
  const token = localStorage.getItem("token");

  // 예금 상품 목록 불러오기
  const fetchDeposits = () => {
    axios.get('http://localhost:8081/admin/deposits', { // 예금 관련 엔드포인트로 수정
      headers: {
        'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
      }
    })
    .then((response) => {
      setDeposits(response.data);  // 불러온 데이터를 deposits 상태로 설정
    })
    .catch((error) => {
      console.error('예금 상품 목록을 불러오는 중 오류 발생:', error);  // 오류 처리
    });
  };

  // 페이지가 처음 로드될 때 예금 상품 목록을 가져옴
  useEffect(() => {
    fetchDeposits(); // 페이지 로드 시 예금 상품 목록 불러오기
  }, []);

  // 수정 버튼 클릭 시 수정 페이지로 이동
  const handleEdit = (deposit) => {
    navigate('/EditSavingsProduct', { state: { deposit } }); // 상품 정보를 상태로 전달하여 수정 페이지로 이동
  };

  // 삭제 버튼 클릭 시 depositState를 'n'으로 변경
  const handleDelete = async (depositNo) => {
    try {
      await axios.put(`http://localhost:8081/admin/deleteDeposit/${depositNo}`, null, {
        headers: {
          'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
        }
      });
      // 삭제 후 예금 상품 목록 다시 불러오기
      alert('해당 상품이 삭제되었습니다.');
      fetchDeposits();
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
      alert('삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 등록 버튼 클릭 시 RegisterProduct 페이지로 이동
  const handleRegister = () => {
    navigate('/admin/RegisterProduct'); // RegisterProduct 페이지로 이동
  };

  return (
    <div className="DepositProduct-app-container">
      <Sidebar /> {/* 사이드바 추가 */}
      <div className="DepositProduct-alog-main-content">
        <div className="DepositProduct-deposit-product-container">
          <h2>예금 상품 관리</h2>
          <div className="DepositProduct-search-controls">
            <div className="DepositProduct-search-bar">
              <select>
                <option value="전체">전체</option>
                <option value="분류">분류</option>
                <option value="상품명">상품명</option>
                <option value="금리">금리</option>
                <option value="금액">금액</option>
              </select>
              <input type="text" placeholder="검색어를 입력하세요" />
              <button>검색</button>
            </div>
            <button onClick={handleRegister}>등록</button>
          </div>

          <table className="DepositProduct-product-table">
            <thead>
              <tr>
                <th>노출순서</th>
                <th>상품이름</th>
                <th>상품 종류</th>
                <th>금리</th>
                <th>상품 설명</th>
                <th>이미지</th>
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
                  <td>{deposit.depositRate}</td>
                  <td>{deposit.depositContent}</td>
                  <td><img src={deposit.depositIMG} alt="상품 이미지" width="50" /></td>
                  <td>{deposit.depositState}</td>          
                  <td><button onClick={() => handleEdit(deposit)}>수정</button></td>
                  <td><button onClick={() => handleDelete(deposit.depositNo)}>삭제</button></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="DepositProduct-pagination-controls">
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

export default DepositProduct;
