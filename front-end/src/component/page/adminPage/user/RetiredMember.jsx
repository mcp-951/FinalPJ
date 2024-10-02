import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import '../../../../resource/css/admin/RetiredMember.css';

const RetiredMember = () => {
  const [searchField, setSearchField] = useState('전체'); // 검색 조건 (이름, 이메일, 핸드폰 등)
  const [searchTerm, setSearchTerm] = useState(''); // 검색어
  const [displayCount, setDisplayCount] = useState(10); // 페이지 당 표시할 리스트 수

  const retiredMemberList = [
    { id: 1, username: 'retired_1', name: '이순신', email: 'lee1@email.com', phone: '010-1111-1111', idCheck: '확인 완료', birthDate: '1980-01-01' },
    { id: 2, username: 'retired_2', name: '강감찬', email: 'kang2@email.com', phone: '010-2222-2222', idCheck: '확인 완료', birthDate: '1981-02-02' },
    { id: 3, username: 'retired_3', name: '유관순', email: 'yoo3@email.com', phone: '010-3333-3333', idCheck: '확인 완료', birthDate: '1982-03-03' },
    { id: 4, username: 'retired_4', name: '안중근', email: 'ahn4@email.com', phone: '010-4444-4444', idCheck: '확인 완료', birthDate: '1983-04-04' },
    { id: 5, username: 'retired_5', name: '김유신', email: 'kim5@email.com', phone: '010-5555-5555', idCheck: '확인 완료', birthDate: '1984-05-05' },
    { id: 6, username: 'retired_6', name: '장보고', email: 'jang6@email.com', phone: '010-6666-6666', idCheck: '확인 완료', birthDate: '1985-06-06' },
    { id: 7, username: 'retired_7', name: '윤봉길', email: 'yoon7@email.com', phone: '010-7777-7777', idCheck: '확인 완료', birthDate: '1986-07-07' },
    { id: 8, username: 'retired_8', name: '세종대왕', email: 'sejong8@email.com', phone: '010-8888-8888', idCheck: '확인 완료', birthDate: '1987-08-08' },
    { id: 9, username: 'retired_9', name: '이성계', email: 'lee9@email.com', phone: '010-9999-9999', idCheck: '확인 완료', birthDate: '1988-09-09' },
    { id: 10, username: 'retired_10', name: '정약용', email: 'jung10@email.com', phone: '010-0000-0000', idCheck: '확인 완료', birthDate: '1989-10-10' }
  ];

  // 검색 조건에 맞는 필터링 로직
  const filteredList = retiredMemberList.filter(member => {
    if (searchField === '이름') {
      return member.name.includes(searchTerm);
    } else if (searchField === '이메일') {
      return member.email.includes(searchTerm);
    } else if (searchField === '핸드폰') {
      return member.phone.includes(searchTerm);
    }
    return true; // '전체' 선택 시 모든 리스트 반환
  }).slice(0, displayCount); // 페이지 당 표시할 항목 제한

  return (
    <div className="retired-member-container">
      <Sidebar />
      <div className="retired-member-content">
        <h2>탈퇴 회원</h2>

        {/* 검색 기능과 페이지 당 표시 항목 수 선택을 같은 줄에 배치 */}
        <div className="search-controls">
          <div className="search-bar">
            <select value={searchField} onChange={(e) => setSearchField(e.target.value)}>
              <option value="전체">전체</option>
              <option value="이름">이름</option>
              <option value="이메일">이메일</option>
              <option value="핸드폰">핸드폰</option>
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
              <option value={10}>10 개</option>
              <option value={50}>50 개</option>
              <option value={100}>100 개</option>
            </select>
          </div>
        </div>

        {/* 탈퇴 회원 리스트 테이블 */}
        <table className="retired-member-table">
          <thead>
            <tr>
              <th>No</th>
              <th>아이디</th>
              <th>이름</th>
              <th>이메일</th>
              <th>핸드폰</th>
              <th>신분증확인</th>
              <th>생년월일</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((member, index) => (
              <tr key={member.id}>
                <td>{index + 1}</td>
                <td>{member.username}</td>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.phone}</td>
                <td>{member.idCheck}</td>
                <td>{member.birthDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RetiredMember;
