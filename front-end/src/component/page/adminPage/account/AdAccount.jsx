import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import '../../../../resource/css/admin/AdAccount.css';
import localStorage from 'localStorage';

const AdAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchField, setSearchField] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(10);
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

  const filteredList = accounts.filter(account => {
    if (searchField === '계좌 종류') {
      return account.productCategory.includes(searchTerm);
    } else if (searchField === '계좌 번호') {
      return account.accountNumber.toString().includes(searchTerm);
    } else if (searchField === '유저No') {
      return account.userNo.toString() === searchTerm;
    } else if (searchField === '만든날짜') {
      return new Date(account.accountOpen).toISOString().includes(searchTerm);
    }
    return true;
  }).slice(0, displayCount);

  return (
    <div className="AdAccount-container">
      <Sidebar />
      <div className="AdAccount-main-content">
        <div className="AdAccount-list-content">
          <h2>NORMAL 계좌 관리</h2>

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
              <button className="AdAccount-search-button">검색</button>
            </div>

            <div className="AdAccount-pagination-controls">
              <label>표시 개수: </label>
              <select value={displayCount} onChange={(e) => setDisplayCount(Number(e.target.value))}>
                <option value={10}>10 개</option>
                <option value={50}>50 개</option>
                <option value={100}>100 개</option>
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
              {filteredList.map((account, index) => (
                <tr key={account.accountNo}>
                  <td>{index + 1}</td>
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
        </div>
      </div>
    </div>
  );
};

export default AdAccount;
