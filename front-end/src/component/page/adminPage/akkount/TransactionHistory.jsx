import React, { useState } from 'react';
import '../../../../resource/css/admin/TransactionHistory.css';

const TransactionHistory = () => {
  const [searchField, setSearchField] = useState('전체'); // 검색 조건 (전체, 이체번호, 보낸 계좌, 받는 계좌 등)
  const [searchTerm, setSearchTerm] = useState(''); // 검색어
  const [displayCount, setDisplayCount] = useState(5); // 페이지 당 표시할 리스트 수

  // 거래 내역 데이터 (임시 데이터)
  const transactionList = [
    { id: 1,  senderAccount: '123456-78-91010', receiverAccount: '123456-78-91020', content: '홍길동', transferDate: '2024-09-02' },
    { id: 2,  senderAccount: '123456-78-91011', receiverAccount: '123456-78-91020', content: '홍길동', transferDate: '2024-09-02' }
  ];

  // 검색 및 필터링 로직
  const filteredList = transactionList.filter(transaction => {
    if (searchField === '보낸 계좌') {
      return transaction.senderAccount.includes(searchTerm);
    } else if (searchField === '받는 계좌') {
      return transaction.receiverAccount.includes(searchTerm);
    }
    return true; // '전체' 선택 시 모든 리스트 반환
  }).slice(0, displayCount); // 페이지 당 표시할 항목 제한

  return (
    <div className="transaction-history-container">
      <h2>거래 현황</h2>

      {/* 검색 및 페이지 표시 수 */}
      <div className="search-controls">
        <div className="search-bar">
          <select value={searchField} onChange={(e) => setSearchField(e.target.value)}>
            <option value="전체">전체</option>
            <option value="보낸 계좌">보낸 계좌</option>
            <option value="받는 계좌">받는 계좌</option>
          </select>
          <input
            type="text"
            placeholder="검색어를 입력하세요."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>검색</button>
        </div>

        <div className="pagination-controls">
          <label>표시 개수: </label>
          <select value={displayCount} onChange={(e) => setDisplayCount(Number(e.target.value))}>
            <option value={5}>5 개</option>
            <option value={10}>10 개</option>
            <option value={50}>50 개</option>
          </select>
        </div>
      </div>

      {/* 거래 내역 리스트 테이블 */}
      <table className="transaction-table">
        <thead>
          <tr>
            <th>No</th>
            <th>보낸 계좌</th>
            <th>받는 계좌</th>
            <th>내용</th>
            <th>이체일</th>
            <th>수정</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.map((transaction, index) => (
            <tr key={transaction.id}>
              <td>{index + 1}</td>
              <td>{transaction.senderAccount}</td>
              <td>{transaction.receiverAccount}</td>
              <td>{transaction.content}</td>
              <td>{transaction.transferDate}</td>
              <td><button>수정</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
