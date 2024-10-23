import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import '../../../../resource/css/admin/AdAccount.css';

const AdAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchField, setSearchField] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(3);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
  const token = localStorage.getItem("token");

  const fetchAccounts = () => {
    axios.get('http://localhost:8081/admin/adAccounts', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((response) => {
      setAccounts(response.data);
    })
    .catch((error) => {
      console.error('계좌 목록을 불러오는 중 오류 발생:', error);
    });
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const stopAccount = (accountNo) => {
    axios.put(`http://localhost:8081/admin/stopAccount/${accountNo}`, {
      accountState: 'STOP'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(() => {
      fetchAccounts();
    })
    .catch((error) => {
      console.error(`계좌 ${accountNo} 정지 중 오류 발생:`, error);
    });
  };

  // 검색 및 필터링 로직
  const filteredList = accounts.filter(account => {
    if (searchTerm.length < 2) {
      return true; // 검색어가 두 글자 미만이면 필터링하지 않음
    }

    const lowerSearchTerm = searchTerm.toLowerCase();

    switch (searchField) {
      case '계좌 종류':
        return account.productCategory?.toLowerCase().includes(lowerSearchTerm) || false;
      case '계좌 번호':
        return account.accountNumber?.toString().includes(lowerSearchTerm) || false;
      case '유저 No':
        return account.userNo?.toString() === searchTerm;
      case '만든날짜':
        return account.accountOpen ? new Date(account.accountOpen).toLocaleDateString().includes(searchTerm) : false;
      case '전체':
        return (
          account.productCategory?.toLowerCase().includes(lowerSearchTerm) ||
          account.accountNumber?.toString().includes(lowerSearchTerm) ||
          account.userNo?.toString() === searchTerm ||
          (account.accountOpen && new Date(account.accountOpen).toLocaleDateString().includes(searchTerm))
        ) || false;
      default:
        return true;
    }
  });

  // 페이지네이션 적용: 현재 페이지에 따른 계좌 목록
  const startIndex = (currentPage - 1) * displayCount;
  const endIndex = startIndex + displayCount;
  const paginatedList = filteredList.slice(startIndex, endIndex); // 현재 페이지의 데이터 추출

  useEffect(() => {
    // 필터링된 데이터에 따라 총 페이지 수 계산
    setTotalPages(Math.ceil(filteredList.length / displayCount));
  }, [displayCount, filteredList]);

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
    <div className="AdAccount-container">
      <Sidebar />
      <div className="AdAccount-main-content">
        <div className="AdAccount-list-content">
          <h2>정상 계좌 관리</h2>

          <div className="AdAccount-search-controls">
            <div className="AdAccount-search-bar">
              <select value={searchField} onChange={(e) => setSearchField(e.target.value)}>
                <option value="전체">전체</option>
                <option value="계좌 종류">계좌 종류</option>
                <option value="계좌 번호">계좌 번호</option>
                <option value="유저 No">유저 No</option>
                <option value="만든날짜">만든날짜</option>
              </select>
              <input
                type="text"
                placeholder="검색어를 입력하세요."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
      
            </div>

            <div className="AdAccount-pagination-controls">
              <label>표시 개수: </label>
              <select value={displayCount} onChange={(e) => setDisplayCount(Number(e.target.value))}>
                <option value={3}>3 개</option>
                <option value={5}>5 개</option>
                <option value={7}>7 개</option>
              </select>
            </div>
          </div>

          <table className="AdAccount-table">
            <thead>
              <tr>
                <th>No</th>
                <th>유저 No</th>
                <th>계좌 번호</th>
                <th>은행 이름</th>
                <th>잔액</th>
                <th>상태</th>
                <th>계좌 개설일</th>
                <th>계좌 종료일</th>
                <th>이자율</th>
                <th>약정 여부</th>
                <th>출금 여부</th>
                <th>정지</th>
              </tr>
            </thead>
            <tbody>
              {paginatedList.map((account, index) => (
                <tr key={account.accountNo}>
                  <td>{startIndex + index + 1}</td>
                  <td>{account.userNo}</td>
                  <td>{account.accountNumber}</td>
                  <td>{account.bankName}</td>
                  <td>{account.accountBalance}</td>
                  <td>{account.accountState}</td>
                  <td>{account.accountOpen ? new Date(account.accountOpen).toLocaleDateString() : 'N/A'}</td>
                  <td>{account.accountClose ? new Date(account.accountClose).toLocaleDateString() : 'N/A'}</td>
                  <td>{account.accountRate}%</td>
                  <td>{account.agreement === 'Y' ? '약정 있음' : '약정 없음'}</td>
                  <td>{account.withdrawal === 'Y' ? '가능' : '불가능'}</td>
                  <td>
                    <button className="AdAccount-stop-button" onClick={() => stopAccount(account.accountNo)}>정지</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="AdAccount-pagination">
            <button 
              disabled={currentPage === 1} 
              onClick={() => handlePageChange(1)}>{'<<'}</button>
            <button 
              disabled={currentPage === 1} 
              onClick={() => handlePageChange(currentPage - 1)}>{'<'}</button>
            
            {getPageNumbers().map(pageNum => (
              <button
                key={pageNum}
                className={pageNum === currentPage ? 'active' : ''}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            ))}
            
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => handlePageChange(currentPage + 1)}>{'>'}</button>
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => handlePageChange(totalPages)}>{'>>'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdAccount;
