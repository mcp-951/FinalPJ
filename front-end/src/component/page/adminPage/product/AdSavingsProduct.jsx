import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar'; // 사이드바 추가
import '../../../../resource/css/admin/SavingsProduct.css'; // CSS 파일 추가

// 적금 상품 가져오기
const AdSavingsProduct = () => {
  const navigate = useNavigate();
  const location = useLocation(); // location 훅 사용
  const [savings, setSavings] = useState([]);  // 적금 상품 목록 상태 관리
  const [searchField, setSearchField] = useState('전체');  // 검색 필드 상태 관리 (이름, 이메일, 핸드폰 등)
  const [searchTerm, setSearchTerm] = useState('');  // 검색어 상태 관리
  const [displayCount, setDisplayCount] = useState(10);  // 페이지당 표시할 상품 수 상태 관리
  const token = localStorage.getItem("token");

  // 적금 상품 목록 불러오기
  const fetchSavings = () => {
    axios.get('http://localhost:8081/admin/savings', {
      headers: {
        'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가   
      }
    })
    .then((response) => {
      setSavings(response.data);  // 불러온 데이터를 savings 상태로 설정
    })
    .catch((error) => {
      console.error('적금 상품 목록을 불러오는 중 오류 발생:', error);  // 오류 처리
    });
  };

  // 페이지가 처음 로드될 때 적금 상품 목록을 가져옴
  useEffect(() => {
    fetchSavings(); // 페이지 로드 시 적금 상품 목록 불러오기
  }, []);

  // 수정 버튼 클릭 시 수정 페이지로 이동
  const handleEdit = (deposit) => {
    navigate('/adEditSavingsProduct', { state: { deposit } }); // 상품 정보를 상태로 전달하여 수정 페이지로 이동
  };

  // 삭제 버튼 클릭 시 depositState를 'n'으로 변경
  const handleDelete = async (depositNo) => {
    try {
      await axios.put(`http://localhost:8081/admin/deleteSavings/${depositNo}`, null, {
        headers: {
          'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
        }
      });
      // 삭제 후 적금 상품 목록 다시 불러오기
      alert('해당 상품이 삭제되었습니다.');
      fetchSavings();
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
      alert('삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 등록 버튼 클릭 시 RegisterProduct 페이지로 이동
  const handleRegister = () => {
    navigate('/admin/adRegisterProduct'); // RegisterProduct 페이지로 이동
  };
  
  return (
    <div className="app-container">
      <Sidebar /> {/* 사이드바 추가 */}
      <div className="alog-main-content">
        <div className="savings-product-container">
          <h2>적금 상품 관리</h2>
          <div className="search-controls">
            <div className="search-bar">
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

          <table className="product-table">
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
                <th>이미지</th>
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
                  <td><img src={deposit.depositIMG} alt="상품 이미지" width="50" /></td>
                  <td>{deposit.depositState}</td>          
                  <td><button onClick={() => handleEdit(deposit)}>수정</button></td>
                  <td><button onClick={() => handleDelete(deposit.depositNo)}>삭제</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="pagination-controls">
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
