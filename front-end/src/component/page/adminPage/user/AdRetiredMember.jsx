import React, { useState, useEffect } from 'react';
import ApiService from '../service/ApiService';  // ApiService 추가
import Sidebar from '../Sidebar';
import '../../../../resource/css/admin/AdRetiredMember.css'; // CSS 추가

const AdRetiredMember = () => {
  const [retiredMembers, setRetiredMembers] = useState([]);
  const [searchField, setSearchField] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(3); // 3/5/7 항목 표시 개수 설정
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 추가
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
  const token = localStorage.getItem("token");

  // 탈퇴 회원 목록 가져오기
  useEffect(() => {
    ApiService.get('/retired', {
      headers: {
        'Authorization': `Bearer ${token}`  // Authorization 헤더에 JWT 추가
      }
    })
      .then((response) => {
        const filteredMembers = response.data.filter(member => member.state === 'e');
        setRetiredMembers(filteredMembers);  // 데이터 설정
      })
      .catch((error) => {
        console.error('탈퇴 회원 목록을 불러오는 중 오류 발생:', error);
      });
  }, []);

  // 필터링 및 페이징 처리 로직
  const filteredList = retiredMembers.filter(member => {
    if (searchField === '이름') {
      return member.name.includes(searchTerm);
    } else if (searchField === '이메일') {
      return member.email.includes(searchTerm);
    } else if (searchField === '핸드폰') {
      return member.hp.includes(searchTerm);
    }
    return true;
  });

  // 현재 페이지에 따른 회원 목록
  const startIndex = (currentPage - 1) * displayCount;
  const endIndex = startIndex + displayCount;
  const paginatedList = filteredList.slice(startIndex, endIndex);

  // 총 페이지 수 계산
  useEffect(() => {
    setTotalPages(Math.ceil(filteredList.length / displayCount));
  }, [displayCount, filteredList]);

  const handlePageChange = (pageNum) => {
    if (pageNum > 0 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  // 페이지 번호 범위를 설정하는 함수
  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    start = Math.max(1, end - maxVisiblePages + 1);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  };

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
            </div>

            <div className="AdRetiredMember-paginationControls">
              <label>표시 개수: </label>
              <select value={displayCount} onChange={(e) => setDisplayCount(Number(e.target.value))}>
                <option value={3}>3 개</option>
                <option value={5}>5 개</option>
                <option value={7}>7 개</option>
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
                {paginatedList.map((member, index) => (
                  <tr key={member.userNo}>
                    <td>{startIndex + index + 1}</td>
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

          <div className="AdRetiredMember-pagination">
            <button 
              disabled={currentPage === 1} 
              onClick={() => handlePageChange(1)}>{'<<'}</button>
            <button 
              disabled={currentPage === 1} 
              onClick={() => handlePageChange(currentPage - 1)}>{'<'}</button>

            {getPageNumbers().map(pageNum => (
              <button
                key={pageNum}
                className={pageNum === currentPage ? 'active' : ''}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            ))}

            <button 
              disabled={currentPage === totalPages} 
              onClick={() => handlePageChange(currentPage + 1)}>{'>'}</button>
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => handlePageChange(totalPages)}>{'>>'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdRetiredMember;
