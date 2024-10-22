import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import '../../../../resource/css/admin/AdTransactionHistory.css';

const AdTransactionHistory = () => {
  const [logs, setLogs] = useState([]);
  const [searchField, setSearchField] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(10);
  const token = localStorage.getItem("token");

  useEffect(() => {
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
  }, [token]);

  const filteredList = logs.filter(log => {
    if (searchField === '보낸 계좌') {
      return log.sendAccountNo.toString().includes(searchTerm);
    } else if (searchField === '받는 계좌') {
      return log.receiveAccountNo.toString().includes(searchTerm);
    } else if (searchField === '거래 날짜') {
      return log.sendDate.includes(searchTerm);
    }
    return true;
  }).slice(0, displayCount);

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
                <option value="보낸 계좌">보낸 계좌</option>
                <option value="받는 계좌">받는 계좌</option>
                <option value="거래 날짜">거래 날짜</option>
              </select>
              <input
                type="text"
                placeholder="검색어를 입력하세요."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="AdTransactionHistory-search-button">검색</button>
            </div>

            <div className="AdTransactionHistory-pagination-controls">
              <label>표시 개수: </label>
              <select value={displayCount} onChange={(e) => setDisplayCount(Number(e.target.value))}>
                <option value={10}>10 개</option>
                <option value={50}>50 개</option>
                <option value={100}>100 개</option>
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
              {filteredList.map((log, index) => (
                <tr key={log.logNo}>
                  <td>{index + 1}</td>
                  <td>{log.sendAccountNumber}</td>
                  <td>{log.receiveAccountNumber}</td>
                  <td>{log.sendPrice}</td>
                  <td>{log.sendDate}</td>
                  <td>{log.logState}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdTransactionHistory;
