import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import '../../../../resource/css/admin/AdTransactionHistory.css';

const AdTransactionHistory = () => {
  const [logs, setLogs] = useState([]);
  const [searchField, setSearchField] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(3); // 3/5/7로 설정
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
  const token = localStorage.getItem("token");

  // 백엔드에서 거래 로그 가져오기
  const useEffect = () => {
    axios.get('http://localhost:8081/admin/adTransactionHistory', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((response) => {
      setLogs(response.data);
    })
    .catch((error) => {
      console.error('거래 내역을 불러오는 중 오류 발생:', error);
    });
  };

  // 검색 및 필터링 로직
  const filteredList = logs.filter(log => {
    if (searchTerm.trim() === '') {
      return true; // 검색어가 비어있으면 필터링하지 않음
    }

    const lowerSearchTerm = searchTerm.toLowerCase();

    switch (searchField) {
      case '보낸 계좌 번호':
        return log.sendAccountNumber?.toString().includes(lowerSearchTerm);
      case '받는 계좌 번호':
        return log.receiveAccountNumber?.toString().includes(lowerSearchTerm);
      case '송금 날짜':
        return log.sendDate?.includes(lowerSearchTerm);
      case '전체':
        // 전체 검색 시 모든 필드에서 검색
        return (
          log.sendAccountNumber?.toString().includes(lowerSearchTerm) ||
          log.receiveAccountNumber?.toString().includes(lowerSearchTerm) ||
          log.sendDate?.includes(lowerSearchTerm)
        );
      default:
        return true;
    }
  });

  // 현재 페이지에 따른 거래 목록
  const startIndex = (currentPage - 1) * displayCount;
  const endIndex = startIndex + displayCount;
  const paginatedList = filteredList.slice(startIndex, endIndex);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredList.length / displayCount)); // 총 페이지 수 계산
  }, [displayCount, filteredList]);

  const handlePageChange = (pageNum) => {
    if (pageNum > 0 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  // 페이지 번호 범위를 설정하는 함수
  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    start = Math.max(1, end - maxVisiblePages + 1);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  };

  return (
    <div className="AdTransactionHistory-container">
      <Sidebar />
      <div className="AdTransactionHistory-main-content">
        <div className="AdTransactionHistory-list-content">
          <h2>거래 현황</h2>

          <div className="AdTransactionHistory-search-controls">
            <div className="AdTransactionHistory-search-bar">
              <select value={searchField} onChange={(e) => setSearchField(e.target.value)}>
                <option value="전체">전체</option>
                <option value="보낸 계좌 번호">보낸 계좌 번호</option>
                <option value="받는 계좌 번호">받는 계좌 번호</option>
                <option value="송금 날짜">송금 날짜</option>
              </select>
              <input
                type="text"
                placeholder="검색어를 입력하세요."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="AdTransactionHistory-pagination-controls">
              <label>표시 개수: </label>
              <select value={displayCount} onChange={(e) => setDisplayCount(Number(e.target.value))}>
                <option value={3}>3 개</option>
                <option value={5}>5 개</option>
                <option value={7}>7 개</option>
              </select>
            </div>
          </div>

          <table className="AdTransactionHistory-table">
            <thead>
              <tr>
                <th>거래 번호</th>
                <th>보낸 계좌 번호</th>
                <th>받는 계좌 번호</th>
                <th>송금 금액</th>
                <th>송금 날짜</th>
                <th>로그 상태</th>
              </tr>
            </thead>
            <tbody>
              {paginatedList.map((log, index) => (
                <tr key={log.logNo}>
                  <td>{startIndex + index + 1}</td>
                  <td>{log.sendAccountNumber}</td>
                  <td>{log.receiveAccountNumber}</td>
                  <td>{log.sendPrice}</td>
                  <td>{log.sendDate}</td>
                  <td>{log.logState}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="AdTransactionHistory-pagination">
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

export default AdTransactionHistory;
