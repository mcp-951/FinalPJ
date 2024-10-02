import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import '../../../../resource/css/admin/MemberList.css';

const MemberList = () => {
  const navigate = useNavigate();
  const [searchField, setSearchField] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(10);

  const memberList = [
    { id: 1, username: 'user_1', name: '홍길동', email: 'hong1@email.com', phone: '010-1234-5678', address: '서울시 강남구', birthDate: '1980-01-01' },
    { id: 2, username: 'user_2', name: '김철수', email: 'kim2@email.com', phone: '010-2345-6789', address: '서울시 강북구', birthDate: '1985-02-15' },
    // 나머지 데이터
  ];

  // 수정 버튼 클릭 시 해당 회원 데이터와 함께 회원 수정 페이지로 이동
  const handleEdit = (member) => {
    navigate('/editMember', { state: { memberData: member } }); // memberEdit로 이동하도록 수정
  };

  // 필터링 로직
  const filteredList = memberList.filter(member => {
    if (searchField === '이름') {
      return member.name.includes(searchTerm);
    } else if (searchField === '이메일') {
      return member.email.includes(searchTerm);
    } else if (searchField === '핸드폰') {
      return member.phone.includes(searchTerm);
    }
    return true;
  }).slice(0, displayCount);

  return (
    <div className="member-container">
      <Sidebar />
      <div className="member-list-content">
        <h2>회원 관리</h2>

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

        <table className="member-table">
          <thead>
            <tr>
              <th>No</th>
              <th>아이디</th>
              <th>이름</th>
              <th>이메일</th>
              <th>핸드폰</th>
              <th>주소</th>
              <th>생년월일</th>
              <th>수정</th>
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
                <td>{member.address}</td>
                <td>{member.birthDate}</td>
                <td><button onClick={() => handleEdit(member)}>수정</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberList;
