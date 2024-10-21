import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import '../../../../resource/css/admin/AdAccountClosure.css';
import localStorage from 'localStorage';

const AdAccountClosure = () => {
  const [accounts, setAccounts] = useState([]);  // 계좌 목록 상태 관리
  const [searchField, setSearchField] = useState('전체');  // 검색 필드 상태 관리 (이름, 이메일, 핸드폰 등)
  const [searchTerm, setSearchTerm] = useState('');  // 검색어 상태 관리
  const [displayCount, setDisplayCount] = useState(10);  // 페이지당 표시할 회원 수 상태 관리
  const token = localStorage.getItem("token");

  // 백엔드에서 TERMINATION 상태 계좌 목록 가져오기
  useEffect(() => {
    axios.get('http://localhost:8081/admin/adAccountClosure', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((response) => {
      console.log(response.data);  // 서버에서 받은 데이터 출력
      setAccounts(response.data);  // 상태 업데이트
    })
    .catch((error) => {
      console.error('계좌 목록을 불러오는 중 오류 발생:', error);
    });
  }, []);

  // 검색 및 필터링 로직
  const filteredList = accounts.filter(account => {
    if (searchField === '계좌 종류') {
      return account.productCategory.includes(searchTerm);  // 계좌종류 필드에서 검색어 포함 여부 확인
    } else if (searchField === '계좌 번호') {
      return account.accountNumber.toString().includes(searchTerm);  
    } else if (searchField === '유저No') {
      return account.userNo.toString() === searchTerm;  
    } else if (searchField === '만든날짜') {
      return new Date(account.accountOpen).toISOString().includes(searchTerm);  
    }
    return true;  // 전체를 선택한 경우 필터링 없이 전체 목록 반환
  }).slice(0, displayCount);  // 표시 개수만큼 잘라내기

  return (
    <div className="AdAccountClosure-transaction-history-container">
      <Sidebar />  
      <div className="AdAccountClosure-alog-main-content">
        <div className="AdAccountClosure-member-list-content">
          <h2>해지 계좌 관리</h2>

          <div className="AdAccountClosure-search-controls">
            <div className="AdAccountClosure-search-bar">
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
              <button>검색</button>
            </div>

            <div className="AdAccountClosure-pagination-controls">
              <label>표시 개수: </label>
              <select value={displayCount} onChange={(e) => setDisplayCount(Number(e.target.value))}>
                <option value={10}>10 개</option>
                <option value={50}>50 개</option>
                <option value={100}>100 개</option>
              </select>
            </div>
          </div>

          <table className="AdAccountClosure-transaction-table">
            <thead>
              <tr>
                <th>No</th>
                <th>유저 No</th>
                <th>계좌 종류</th>
                <th>계좌 번호</th>
                <th>만든 날짜</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((account, index) => (
                <tr key={account.accountNo}>
                  <td>{index + 1}</td>
                  <td>{account.userNo}</td>
                  <td>{account.productCategory}</td>
                  <td>{account.accountNumber}</td>
                  <td>{account.accountOpen}</td>
                  <td>{account.accountState}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div> 
  );
};

export default AdAccountClosure;
