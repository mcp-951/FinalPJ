import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import '../../../../resource/css/admin/AdAccountStop.css';
import localStorage from 'localStorage';

const AdAccountStop = () => {
  const [accounts, setAccounts] = useState([]);  // 계좌 목록 상태 관리
  const [searchField, setSearchField] = useState('전체');  // 검색 필드 상태 관리 (이름, 이메일, 핸드폰 등)
  const [searchTerm, setSearchTerm] = useState('');  // 검색어 상태 관리
  const [displayCount, setDisplayCount] = useState(10);  // 페이지당 표시할 회원 수 상태 관리
  const token = localStorage.getItem("token");

  // 백엔드에서 STOP 상태 계좌 목록 가져오기
  const fetchAccounts = () => {
    console.log("stop")
    axios.get('http://localhost:8081/admin/adAccountStop', {
      headers: {
        'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가   
      }
    })
    .then((response) => {
      setAccounts(response.data);  // 불러온 데이터를 accounts 상태로 설정
    })
    .catch((error) => {
      console.error('계좌 목록을 불러오는 중 오류 발생:', error);  // 오류 처리
    });
  };

  // 페이지가 처음 로드될 때 계좌 목록을 가져옴
  useEffect(() => {
    fetchAccounts();
  }, []);

  // 특정 계좌를 해제시키는 함수
  const normalAccount = (accountNo) => {
    axios.put(`http://localhost:8081/admin/normalAccount/${accountNo}`, {
      accountState: 'NORMAL' // 전달하려는 데이터
    }, {
      headers: {
        'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
      }
    })
    .then((response) => {
      console.log(`계좌 ${accountNo}가 해제되었습니다.`);
      fetchAccounts();  // 상태 변경 후 계좌 목록을 다시 가져옴
    })
    .catch((error) => {
      console.error(`계좌 ${accountNo} 해제 중 오류 발생:`, error);
    });
  };

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
    return true;
  }).slice(0, displayCount);  // 표시 개수만큼 잘라내기

  return (
    <div className="AdAccountStop-transaction-history-container">
      <Sidebar />
      <div className="AdAccountStop-alog-main-content">
        <div className="AdAccountStop-member-list-content">
          <h2>STOP 계좌 관리</h2>

          <div className="AdAccountStop-search-controls">
            <div className="AdAccountStop-search-bar">
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

            <div className="AdAccountStop-pagination-controls">
              <label>표시 개수: </label>
              <select value={displayCount} onChange={(e) => setDisplayCount(Number(e.target.value))}>
                <option value={10}>10 개</option>
                <option value={50}>50 개</option>
                <option value={100}>100 개</option>
              </select>
            </div>
          </div>

        <table className="transaction-table">
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
              <th>정지</th> {/* 정지 버튼 추가 */}
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
                  <button onClick={() => normalAccount(account.accountNo)}>해제</button> {/* 해제 버튼 */}
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

export default AdAccountStop;
