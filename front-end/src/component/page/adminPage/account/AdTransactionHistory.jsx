import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';  // 좌측에 사이드바 컴포넌트 추가
import '../../../../resource/css/admin/TransactionHistory.css'; // CSS 파일 추가

const AdTransactionHistory = () => {
  const [logs, setLogs] = useState([]);  // 거래 내역 상태 관리
  const [searchField, setSearchField] = useState('전체');  // 검색 필드 상태 관리
  const [searchTerm, setSearchTerm] = useState('');  // 검색어 상태 관리
  const [displayCount, setDisplayCount] = useState(10);  // 페이지당 표시할 거래 내역 수 상태 관리
  const token = localStorage.getItem("token");

  // 백엔드에서 거래 로그 가져오기
  useEffect(() => {
    axios.get('http://localhost:8081/admin/adTransactionHistory', {
      headers: {
        'Authorization': `Bearer ${token}`  // Authorization 헤더에 JWT 추가
      }
    })
    .then((response) => {
      setLogs(response.data);  // 데이터를 성공적으로 가져왔을 때, logs 상태에 설정
    })
    .catch((error) => {
      console.error('거래 내역을 불러오는 중 오류 발생:', error);  // 오류 처리
    });
  }, [token]);  // token을 의존성으로 추가

  // 검색 및 필터링 로직
  const filteredList = logs.filter(log => {
    if (searchTerm.length < 2) {
      return true; // 검색어가 두 글자 미만이면 필터링하지 않음
    }

    const lowerSearchTerm = searchTerm.toLowerCase();

    switch (searchField) {
      case '보낸 계좌':
        return log.sendAccountNumber?.toString().includes(lowerSearchTerm) || false; // 보낸 계좌에서 검색
      case '받는 계좌':
        return log.receiveAccountNumber?.toString().includes(lowerSearchTerm) || false; // 받는 계좌에서 검색
      case '거래 날짜':
        return log.sendDate.includes(lowerSearchTerm); // 거래 날짜에서 검색
      case '전체':
        return (
          log.sendAccountNumber?.toString().includes(lowerSearchTerm) ||
          log.receiveAccountNumber?.toString().includes(lowerSearchTerm) ||
          log.sendDate.includes(lowerSearchTerm)
        ) || false; // 전체 검색
      default:
        return true; // 전체를 선택한 경우 필터링 없이 전체 목록 반환
    }
  }).slice(0, displayCount);  // 표시 개수만큼 잘라내기

  return (
    <div className="transaction-history-container">
      <Sidebar />  {/* 좌측에 사이드바 컴포넌트 렌더링 */}
      <div className="alog-main-content"> 
        <div className="member-list-content">
          <h2>거래 현황</h2>

          <div className="search-controls">
            <div className="search-bar">
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
                onChange={(e) => setSearchTerm(e.target.value)}  // 검색어 상태 업데이트
              />
            </div>

            <div className="pagination-controls">
              <label>표시 개수: </label>
              <select value={displayCount} onChange={(e) => setDisplayCount(Number(e.target.value))}>
                <option value={10}>10 개</option>
                <option value={50}>50 개</option>
                <option value={100}>100 개</option>
              </select>
            </div>
          </div>

          {/* 거래 내역 리스트 테이블 */}
          <table className="transaction-table">
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
