import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from 'component/ApiService'; // API 서비스 임포트
import '../../../../resource/css/product/LoanList.css';

// 상품 항목 컴포넌트 (LoanItem)
const LoanItem = ({ loanName, loanContent, loanRate, loanState, loanNo }) => {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    // 세션에 상품 정보 저장
    sessionStorage.setItem(
      'selectedLoan',
      JSON.stringify({ loanName, loanContent, loanRate, loanState , loanNo})
    );
    // 상세 페이지로 이동
    navigate('/LoanMain');
  };

  return (
    <div className="loan-item">
      <h3>{loanName}</h3>
      <p>{loanContent}</p>
      <strong>연 {loanRate}%</strong>
      <div className="buttons">
        <button onClick={handleDetailClick}>상세보기</button>
        <button onClick={handleDetailClick}>가입하기</button>
      </div>
    </div>
  );
};

// 상품 리스트 컴포넌트 (LoanList)
const LoanList = ({ loans }) => (
  <div className="loan-list">
    {loans.map((loan, index) => (
      <LoanItem
        key={index}
        loanName={loan.loanName}
        loanContent={loan.loanContent}
        loanRate={loan.loanRate}
        loanNo={loan.loanNo}
      />
    ))}
  </div>
);

// 메인 컴포넌트 (LoanMain)
const LoanList1 = () => {
  const [loans, setLoans] = useState([]);  // 상품 데이터를 저장하는 state
  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지
  const [totalPages, setTotalPages] = useState(0);  // 총 페이지 수
  const loansPerPage = 8;  // 페이지당 상품 개수

  useEffect(() => {
    // API를 호출하여 대출 상품 데이터 가져오기
    ApiService.fetchLoanProductsPaged(currentPage - 1, loansPerPage)
      .then(response => {
        console.log('API Response:', response.data);  // 콘솔에 응답 출력
        setLoans(response.data.content);  // 상품 데이터 설정
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
      <LoanList loans={loans} />
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

export default LoanList1;
