import React, { useState } from 'react';
import '../../../../resource/css/admin/AccountClosure.css';

const AccountClosure = () => {
  const [searchField, setSearchField] = useState('전체'); // 검색 조건
  const [searchTerm, setSearchTerm] = useState(''); // 검색어
  const [displayCount, setDisplayCount] = useState(5); // 페이지 당 표시할 리스트 수

  // 계좌 해지 내역 데이터 (임시 데이터)
  const closureList = [
    { id: 1,  senderAccount: '123456-78-91011', receiverAccount: '123456-78-91021', content: '홍길동', closureDate: '2024-09-02' },
    { id: 2,  senderAccount: '123456-78-91012', receiverAccount: '123456-78-91022', content: '홍길동', closureDate: '2024-09-02' }
  ];

  // 검색 및 필터링 로직
  const filteredList = closureList.filter(closure => {
    if (searchField === '보낸 계좌') {
      return closure.accountOwner.includes(searchTerm);
    } else if (searchField === '받는 계좌') {
     return closure.receiverAccount.includes(searchTerm);
    }
    return true; // '전체' 선택 시 모든 리스트 반환
  }).slice(0, displayCount); // 페이지 당 표시할 항목 제한

  return (
    <div className="account-closure-container">
      <h2>계좌 해지 관리</h2>

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

      {/* 계좌 해지 리스트 테이블 */}
      <table className="closure-table">
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
          {filteredList.map((closure, index) => (
            <tr key={closure.id}>
              <td>{index + 1}</td>
              <td>{closure.senderAccount}</td>
              <td>{closure.receiverAccount}</td>
              <td>{closure.content}</td>
              <td>{closure.closureDate}</td>
              <td><button>수정</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountClosure;
