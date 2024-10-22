import React, { useState, useEffect } from 'react';
import ApiService from '../service/ApiService';  // ApiService 추가
import Sidebar from '../Sidebar';
import '../../../../resource/css/admin/AdRetiredMember.css'; // CSS 추가
import localStorage from 'localStorage';

const AdRetiredMember = () => {
  const [retiredMembers, setRetiredMembers] = useState([]);
  const [searchField, setSearchField] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(10);
  const token = localStorage.getItem("token");

  // 탈퇴 회원 목록 가져오기
  useEffect(() => {
    ApiService.get('/retired', {
      headers: {
        'Authorization': `Bearer ${token}`  // Authorization 헤더에 JWT 추가
      }
    })  // 탈퇴 회원 목록 조회
      .then((response) => {
        const filteredMembers = response.data.filter(member => member.state === 'e');
        setRetiredMembers(filteredMembers);  // 데이터 설정
      })
      .catch((error) => {
        console.error('탈퇴 회원 목록을 불러오는 중 오류 발생:', error);
      });
  }, [token]);

  // 검색 및 필터링 로직
  const filteredList = retiredMembers.filter(member => {
    if (searchField === '이름') {
      return member.name.includes(searchTerm);
    } else if (searchField === '이메일') {
      return member.email.includes(searchTerm);
    } else if (searchField === '핸드폰') {
      return member.hp.includes(searchTerm);
    }
    return true;
  }).slice(0, displayCount);

  return (
    <div className="AdRetiredMember-container">
      <Sidebar />
      <div className="AdRetiredMember-mainContent">
        <div className="AdRetiredMember-content">
          <h2 className="AdRetiredMember-title">탈퇴 회원</h2>

          <div className="AdRetiredMember-controls">
            <div className="AdRetiredMember-searchBar">
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

            <div className="AdRetiredMember-paginationControls">
              <label>표시 개수: </label>
              <select value={displayCount} onChange={(e) => setDisplayCount(Number(e.target.value))}>
                <option value={10}>10 개</option>
                <option value={50}>50 개</option>
                <option value={100}>100 개</option>
              </select>
            </div>
          </div>

          {retiredMembers.length === 0 ? (
            <h1 className="AdRetiredMember-emptyMessage">탈퇴한 회원이 없습니다.</h1>
          ) : (
            <table className="AdRetiredMember-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>아이디</th>
                  <th>이름</th>
                  <th>이메일</th>
                  <th>핸드폰</th>
                  <th>주소</th>
                  <th>생년월일</th>
                  <th>주민번호</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((member, index) => (
                  <tr key={member.userNo}>
                    <td>{index + 1}</td>
                    <td>{member.userID}</td>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{member.hp}</td>
                    <td>{member.address}</td>
                    <td>{member.birth}</td>
                    <td>{member.residentNumber}</td>
                    <td>{member.state}</td>     
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdRetiredMember;
