import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar'; // 사이드바 추가
import '../../../../resource/css/admin/AdDepositProduct.css'; // CSS 파일 추가

const AdDepositProduct = () => {
  const navigate = useNavigate();
  const [deposits, setDeposits] = useState([]); // 예금 상품 목록 상태 관리
  const [searchField, setSearchField] = useState('전체'); // 검색 필드 상태 관리
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 관리
  const [displayCount, setDisplayCount] = useState(3); // 페이지당 표시할 상품 수 상태 관리
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
  const token = localStorage.getItem("token");

  const fetchDeposits = () => {
    axios.get('http://13.125.114.85:8081/admin/deposits', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        setDeposits(response.data);
      })
      .catch((error) => {
        console.error('예금 상품 목록을 불러오는 중 오류 발생:', error);
      });
  };

  useEffect(() => {
    fetchDeposits(); // 페이지 로드 시 예금 상품 목록 불러오기
  }, []);

  // 검색 및 필터링 로직
const filteredList = deposits.filter(deposit => {
  if (!searchTerm) {
    return true; // 검색어가 비어 있으면 필터링하지 않음
  }

  const lowerSearchTerm = searchTerm.toLowerCase();

  // 전체 검색일 경우 각 필드를 모두 확인
  if (searchField === '전체') {
    return (
      deposit.depositName.toLowerCase().includes(lowerSearchTerm) ||
      deposit.depositMinimumRate.toString().includes(lowerSearchTerm) ||
      deposit.depositMaximumRate.toString().includes(lowerSearchTerm) ||
      deposit.depositMinimumDate.toString().includes(lowerSearchTerm) ||
      deposit.depositMaximumDate.toString().includes(lowerSearchTerm)
    );
  }

  // 특정 필드 검색
  switch (searchField) {
    case '상품명':
      return deposit.depositName.toLowerCase().includes(lowerSearchTerm);
    case '최소 금리':
      return deposit.depositMinimumRate.toString().includes(lowerSearchTerm);
    case '최대 금리':
      return deposit.depositMaximumRate.toString().includes(lowerSearchTerm);
    case '최소 기간':
      return deposit.depositMinimumDate.toString().includes(lowerSearchTerm);
    case '최대 기간':
      return deposit.depositMaximumDate.toString().includes(lowerSearchTerm);
    default:
      return true;
  }
});


  // 현재 페이지에 따른 데이터 추출
  const startIndex = (currentPage - 1) * displayCount;
  const endIndex = startIndex + displayCount;
  const paginatedList = filteredList.slice(startIndex, endIndex);

  // 페이지 수 계산
  useEffect(() => {
    setTotalPages(Math.ceil(filteredList.length / displayCount));
  }, [displayCount, filteredList]);

  // 페이지 이동 처리
  const handlePageChange = (pageNum) => {
    if (pageNum > 0 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  // 페이지 번호 범위를 설정하는 함수
  const getPageNumbers = () => {
    const maxVisiblePages = 5; // 한 번에 표시할 페이지 버튼 수
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    start = Math.max(1, end - maxVisiblePages + 1);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  };

  // 수정 버튼 클릭 시 수정 페이지로 이동
  const handleEdit = (deposit) => {
    navigate('/admin/adEditSavingsProduct', { state: { deposit } }); // 상품 정보를 상태로 전달하여 수정 페이지로 이동
  };

  // 삭제 버튼 클릭 시 depositState를 'n'으로 변경
  const handleDelete = async (depositNo) => {
    try {
      await axios.put(`http://13.125.114.85:8081/admin/deleteSavings/${depositNo}`, null, {
        headers: {
          'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
        }
      });
      alert('해당 상품이 삭제되었습니다.');
      fetchDeposits(); // 삭제 후 예금 상품 목록 다시 불러오기
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
    <div className="AdDepositProduct-app-container">
      <Sidebar />
      <div className="AdDepositProduct-main-content">
        <div className="AdDepositProduct-product-container">
          <h2>예금 상품 관리</h2>
          <div className="AdDepositProduct-search-controls">
            <div className="AdDepositProduct-search-bar">
              <select value={searchField} onChange={(e) => setSearchField(e.target.value)}>
                <option value="전체">전체</option>
                <option value="상품이름">상품이름</option>
                <option value="최소 금리">최소 금리</option>
                <option value="최대 금리">최대 금리</option>
                <option value="최소 기간">최소 기간</option>
                <option value="최대 기간">최대 기간</option>
              </select>
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="AdDepositProduct-register-button" onClick={handleRegister}>등록</button>
          </div>
          <div className="AdDepositProduct-pagination-controls">
            <label>페이지당 항목 수: </label>
            <select value={displayCount} onChange={(e) => setDisplayCount(Number(e.target.value))}>
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={7}>7</option>
            </select>
          </div>

          <table className="AdDepositProduct-table">
            <thead>
              <tr>
                <th>노출순서</th>
                <th>상품이름</th>
                <th>상품 종류</th>
                <th>상품 설명</th>
                <th>상품 특성</th>
                <th>최소 예치 금액</th>
                <th>최대 예치 금액</th>
                <th>최소 금리</th>
                <th>최대 금리</th>
                <th>최소 기간</th>
                <th>최대 기간</th>
                <th>상태</th>
                <th>수정</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {paginatedList.map((deposit, index) => (
                <tr key={deposit.depositNo}>
                  <td>{startIndex + index + 1}</td>
                  <td>{deposit.depositName}</td>
                  <td>{deposit.depositCategory == 1 ? "예금" : "적금"}</td>
                  <td>{deposit.depositContent}</td>
                  <td>{deposit.depositCharacteristic}</td>
                  <td>{deposit.depositMinimumAmount}</td>
                  <td>{deposit.depositMaximumAmount}</td>
                  <td>{deposit.depositMinimumRate}</td>
                  <td>{deposit.depositMaximumRate}</td>
                  <td>{deposit.depositMinimumDate}</td>
                  <td>{deposit.depositMaximumDate}</td>
                  <td>{deposit.depositState}</td>
                  <td><button className="AdDepositProduct-edit-button" onClick={() => handleEdit(deposit)}>수정</button></td>
                  <td><button className="AdDepositProduct-delete-button" onClick={() => handleDelete(deposit.depositNo)}>삭제</button></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="AdDepositProduct-pagination">
            <button disabled={currentPage === 1} onClick={() => handlePageChange(1)}>{'<<'}</button>
            <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>{'<'}</button>

            {getPageNumbers().map(pageNum => (
              <button
                key={pageNum}
                className={pageNum === currentPage ? 'active' : ''}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            ))}

            <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>{'>'}</button>
            <button disabled={currentPage === totalPages} onClick={() => handlePageChange(totalPages)}>{'>>'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDepositProduct;
