import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import localStorage from 'localStorage';

const AdAccount = () => {
  const [accounts, setAccounts] = useState([]);  // 계좌 목록 상태 관리
  const [searchField, setSearchField] = useState('전체');  // 검색 필드 상태 관리
  const [searchTerm, setSearchTerm] = useState('');  // 검색어 상태 관리
  const [displayCount, setDisplayCount] = useState(10);  // 페이지당 표시할 계좌 수 상태 관리
  const token = localStorage.getItem("token");

  // 백엔드에서 NORMAL 계좌 목록 가져오기
  const fetchAccounts = () => {
    axios.get('http://localhost:8081/admin/adAccounts', {
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

  // 특정 계좌를 정지시키는 함수
  const stopAccount = (accountNo) => {
    axios.put(`http://localhost:8081/admin/stopAccount/${accountNo}`, {
      accountState: 'STOP' // 전달하려는 데이터
    }, {
      headers: {
        'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
      }
    })
    .then(() => {
      fetchAccounts();  // 상태 변경 후 계좌 목록을 다시 가져옴
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
        return account.productCategory?.toLowerCase().includes(lowerSearchTerm) || false; // 안전하게 접근
      case '계좌 번호':
        return account.accountNumber?.toString().includes(lowerSearchTerm) || false; // 안전하게 접근
      case '유저 No':
        return account.userNo?.toString() === searchTerm; // 안전하게 접근
      case '만든날짜':
        return account.accountOpen ? new Date(account.accountOpen).toLocaleDateString().includes(searchTerm) : false; // 안전하게 접근
      case '전체':
        return (
          account.productCategory?.toLowerCase().includes(lowerSearchTerm) ||
          account.accountNumber?.toString().includes(lowerSearchTerm) ||
          account.userNo?.toString() === searchTerm ||
          (account.accountOpen && new Date(account.accountOpen).toLocaleDateString().includes(searchTerm))
        ) || false; // 안전하게 접근
      default:
        return true; // 필터링 없이 전체 목록 반환
    }
  }).slice(0, displayCount); // 표시 개수만큼 잘라내기

  return (
    <div className="transaction-history-container">  {/* CSS 스타일 적용된 컨테이너 */}
      <Sidebar />  {/* 좌측에 사이드바 컴포넌트 렌더링 */}
      <div className="alog-main-content">  {/* 메인 컨텐츠 영역 */}
        <div className="member-list-content">  {/* 계좌 목록 컨텐츠 영역 */}
          <h2>NORMAL 계좌 관리</h2>  {/* 타이틀 */}

          <div className="search-controls">  {/* 검색 및 필터링 컨트롤 */}
            <div className="search-bar">  {/* 검색 바 */}
              <select value={searchField} onChange={(e) => setSearchField(e.target.value)}>  {/* 검색 필드 선택 */}
                <option value="전체">전체</option>
                <option value="계좌 종류">계좌 종류</option>
                <option value="계좌 번호">계좌 번호</option>
                <option value="유저 No">유저 No</option>
                <option value="만든날짜">만든날짜</option>
              </select>
              <input
                type="text"
                placeholder="검색어를 입력하세요."
                value={searchTerm}  // 검색어 입력 필드
                onChange={(e) => setSearchTerm(e.target.value)}  // 검색어 상태 업데이트
              />
              <button>검색</button>  {/* 검색 버튼 */}
            </div>

            <div className="pagination-controls">  {/* 페이지당 표시 개수 선택 */}
              <label>표시 개수: </label>
              <select value={displayCount} onChange={(e) => setDisplayCount(Number(e.target.value))}>  {/* 표시 개수 선택 */}
                <option value={10}>10 개</option>
                <option value={50}>50 개</option>
                <option value={100}>100 개</option>
              </select>
            </div>
          </div>

          <table className="transaction-table">  {/* 계좌 목록 테이블 */}
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
                    <button onClick={() => stopAccount(account.accountNo)}>정지</button>
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

export default AdAccount; // AdAccount 컴포넌트 내보내기
