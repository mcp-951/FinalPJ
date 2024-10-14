import React, { useState } from 'react';
import '../../../../resource/css/admin/CurrencyExchangeHistory.css';

const CurrencyExchangeHistory = () => {
  const [searchField, setSearchField] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(5);

  const exchangeList = [
    { id: 1, exchangeId: 'ABCD_0001', sender: '홍길동', account: '123456-78-91010', country: '미국', pickup: '인천점', exchangeDate: '2024-09-02', status: '완료' },
    { id: 2, exchangeId: 'ABCD_0002', sender: '홍길동', account: '123456-78-91011', country: '일본', pickup: '김포점', exchangeDate: '2024-09-02', status: '처리중' }
    // 필요한 만큼 추가
  ];

  const filteredList = exchangeList.filter(exchange => {
    if (searchField === '환전번호') {
      return exchange.exchangeId.includes(searchTerm);
    } else if (searchField === '계좌번호') {
      return exchange.account.includes(searchTerm);
    }
    return true;
  }).slice(0, displayCount);

  return (
    <div className="currency-exchange-container">
      <h2>환전 현황</h2>

      <div className="search-controls">
        <div className="search-bar">
          <select value={searchField} onChange={(e) => setSearchField(e.target.value)}>
            <option value="전체">전체</option>
            <option value="환전번호">환전번호</option>
            <option value="계좌번호">계좌번호</option>
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

      <table className="exchange-table">
        <thead>
          <tr>
            <th>No</th>
            <th>환전번호</th>
            <th>송금자</th>
            <th>계좌번호</th>
            <th>국가</th>
            <th>수령 지점</th>
            <th>환전일</th>
            <th>상태</th>
            <th>수정</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.map((exchange, index) => (
            <tr key={exchange.id}>
              <td>{index + 1}</td>
              <td>{exchange.exchangeId}</td>
              <td>{exchange.sender}</td>
              <td>{exchange.account}</td>
              <td>{exchange.country}</td>
              <td>{exchange.pickup}</td>
              <td>{exchange.exchangeDate}</td>
              <td>{exchange.status}</td>
              <td><button>수정</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CurrencyExchangeHistory;
