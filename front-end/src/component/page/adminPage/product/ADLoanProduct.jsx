import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar'; // 사이드바 추가
import '../../../../resource/css/admin/AdLoanProduct.css'; // CSS 파일 추가

const AdLoanProduct = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);  // 대출 상품 목록 상태 관리
  const [searchField, setSearchField] = useState('전체');  // 검색 필드 상태 관리
  const [searchTerm, setSearchTerm] = useState('');  // 검색어 상태 관리
  const [displayCount, setDisplayCount] = useState(3);  // 페이지당 표시할 상품 수 상태 관리
  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지 상태 관리
  const [totalPages, setTotalPages] = useState(1);  // 총 페이지 수 상태 관리
  const token = localStorage.getItem("token");

  // 대출 상품 목록 불러오기
  const fetchLoans = () => {
    axios.get('http://13.125.114.85:8081/admin/loans', {
      headers: {
        'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
      }
    })
    .then((response) => {
      setLoans(response.data);  // 불러온 데이터를 loans 상태로 설정
    })
    .catch((error) => {
      console.error('대출 상품 목록을 불러오는 중 오류 발생:', error);
    });
  };

  // 페이지가 처음 로드될 때 대출 상품 목록을 가져옴
  useEffect(() => {
    fetchLoans();
  }, []);

  // 수정 버튼 클릭 시 수정 페이지로 이동
  const handleEdit = (loan) => {
    navigate('/admin/adEditLoanProduct', { state: { loan } }); // 상품 정보를 상태로 전달하여 수정 페이지로 이동
  };

  // 삭제 버튼 클릭 시 loanState를 'Closed'로 변경
  const handleDelete = async (loanNo) => {
    try {
      await axios.put(`http://13.125.114.85:8081/admin/deleteLoan/${loanNo}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('해당 대출 상품이 삭제되었습니다.');
      fetchLoans(); // 삭제 후 대출 상품 목록 다시 불러오기
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
      alert('삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 등록 버튼 클릭 시 RegisterLoanProduct 페이지로 이동
  const handleRegister = () => {
    navigate('/admin/adRegisterLoanProduct');
  };

  // 검색 및 필터링 로직
const filteredList = loans.filter(loan => {
  const lowerSearchTerm = searchTerm.toLowerCase(); // 검색어를 소문자로 변환

  // 전체 검색일 경우 각 필드를 모두 확인
  if (searchField === '전체' || searchTerm.trim() === '') {
    return (
      loan.loanProductTitle.toLowerCase().includes(lowerSearchTerm) ||
      loan.loanMaxLimit.toString().includes(lowerSearchTerm) ||
      loan.loanMinLimit.toString().includes(lowerSearchTerm) ||
      loan.minInterestRate.toString().includes(lowerSearchTerm)
    );
  }

  // 특정 필드 검색
  switch (searchField) {
    case '상품명':
      return loan.loanProductTitle.toLowerCase().includes(lowerSearchTerm);
    case '최대 한도':
      return loan.loanMaxLimit.toString().includes(lowerSearchTerm);
    case '최소 한도':
      return loan.loanMinLimit.toString().includes(lowerSearchTerm);
    case '최소 금리':
      return loan.minInterestRate.toString().includes(lowerSearchTerm);
    default:
      return true; // 필터링하지 않음
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

  return (
    <div className="AdLoanProduct-container">
      <Sidebar /> 
      <div className="AdLoanProduct-main-content">
        <div className="AdLoanProduct-product-container">
          <h2>대출 상품 관리</h2>
          <div className="AdLoanProduct-search-controls">
            <div className="AdLoanProduct-search-bar">
              <select value={searchField} onChange={(e) => setSearchField(e.target.value)}>
                <option value="전체">전체</option>
                <option value="상품명">상품명</option>
                <option value="최대 한도">최대 한도</option>
                <option value="최소 한도">최소 한도</option>
                <option value="최소 금리">최소 금리</option>
              </select>
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div> 
          <button className="AdLoanProduct-register-button" onClick={handleRegister}>등록</button>
          </div>
          <div className="AdLoanProduct-pagination-controls">
            <label>페이지당 항목 수: </label>
            <select value={displayCount} onChange={(e) => setDisplayCount(Number(e.target.value))}>
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={7}>7</option>
            </select>
          </div>

          <table className="AdLoanProduct-table">
            <thead>
              <tr>
                <th>노출순서</th>
                <th>상품명</th>
                <th>최대 한도</th>
                <th>최소 한도</th>
                <th>최대 기간</th>
                <th>최소 기간</th>
                <th>최소 금리</th>
                <th>최대 금리</th>
                <th>중도 상환 수수료</th>
                <th>최소 신용등급</th>
                <th>상태</th>
                <th>수정</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {paginatedList.map((loan, index) => (
                <tr key={loan.loanProductNo}>
                  <td>{startIndex + index + 1}</td>
                  <td>{loan.loanProductTitle}</td>
                  <td>{loan.loanMaxLimit}</td>
                  <td>{loan.loanMinLimit}</td>
                  <td>{loan.loanMaxTern}</td>
                  <td>{loan.loanMinTern}</td>
                  <td>{loan.minInterestRate}</td>
                  <td>{loan.maxInterestRate}</td>
                  <td>{loan.earlyRepaymentFee}</td>
                  <td>{loan.minCreditScore}</td>
                  <td>{loan.viewPoint}</td>
                  <td><button onClick={() => handleEdit(loan)}>수정</button></td>
                  <td><button onClick={() => handleDelete(loan.loanProductNo)}>삭제</button></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="AdLoanProduct-pagination">
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

export default AdLoanProduct;
