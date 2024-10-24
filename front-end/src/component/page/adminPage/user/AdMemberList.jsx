import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar';
import '../../../../resource/css/admin/AdMemberList.css';
import localStorage from 'localStorage';

const AdMemberList = () => {
  const navigate = useNavigate();  
  const [members, setMembers] = useState([]);  
  const [searchField, setSearchField] = useState('전체');  
  const [searchTerm, setSearchTerm] = useState('');  
  const [displayCount, setDisplayCount] = useState(3);  // 3/5/7로 설정
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get('http://13.125.114.85:8081/admin/getUserList', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }) 
    .then((response) => {
      const filteredMembers = response.data.filter(member => 
        member.state === 'y' || member.state === 'n'
      );
      setMembers(filteredMembers);  
    })
    .catch((error) => {
      console.error('회원 목록을 불러오는 중 오류 발생:', error);  
    });
  }, []); 

  const handleEdit = (member) => {
    navigate('/adEditMember', { state: { memberData: member } });
  };

  const handleStatusChange = (member) => {
    const updatedMember = { ...member, state: member.state === 'y' ? 'n' : 'y' };  
    axios.put(`http://13.125.114.85:8081/admin/setState/${member.userNo}`, updatedMember, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(() => {
      setMembers(prevMembers => 
        prevMembers.map(m => (m.userNo === member.userNo ? updatedMember : m))
      );
    })
    .catch((error) => {
      console.error('회원 상태 업데이트 중 오류 발생:', error);
    });
  };

  // 필터링 로직: 선택한 검색 필드와 검색어에 맞게 회원 목록 필터링
  const filteredList = members.filter(member => {
    if (searchTerm.length < 2) {
      return true;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();

    switch (searchField) {
      case '이름':
        return member.name.toLowerCase().includes(lowerSearchTerm);  
      case '이메일':
        return member.email.toLowerCase().includes(lowerSearchTerm);  
      case '핸드폰':
        return member.hp.includes(lowerSearchTerm);  
      case '아이디':
        return member.userId.toLowerCase().includes(lowerSearchTerm);  
      case '전체':
        return (
          member.name.toLowerCase().includes(lowerSearchTerm) ||
          member.email.toLowerCase().includes(lowerSearchTerm) ||
          member.hp.includes(lowerSearchTerm) ||
          member.userId.toLowerCase().includes(lowerSearchTerm)
        );
      default:
        return true;
    }
  });

  // 현재 페이지에 따른 회원 목록
  const startIndex = (currentPage - 1) * displayCount;
  const endIndex = startIndex + displayCount;
  const paginatedList = filteredList.slice(startIndex, endIndex); 

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
    <div className="AdMemberList-container">
      <Sidebar />
      <div className="AdMemberList-content">
        <h2 className="AdMemberList-title">회원 관리</h2>

        <div className="AdMemberList-controls">
          <div className="AdMemberList-searchBar">
            <select value={searchField} onChange={(e) => setSearchField(e.target.value)}>
              <option value="전체">전체</option>
              <option value="아이디">아이디</option>
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

          <div className="AdMemberList-paginationControls">
            <label>표시 개수: </label>
            <select value={displayCount} onChange={(e) => setDisplayCount(Number(e.target.value))}>
              <option value={3}>3 개</option>
              <option value={5}>5 개</option>
              <option value={7}>7 개</option>
            </select>
          </div>
        </div>

        <table className="AdMemberList-table">
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
              <th>등급</th>
              <th>상태</th>
              <th>수정</th>
              <th>정지/정지 해제</th>
            </tr>
          </thead>
          <tbody>
            {paginatedList.map((member, index) => (
              <tr key={member.userNo}>  
                <td>{startIndex + index + 1}</td>  
                <td>{member.userId}</td>  
                <td>{member.name}</td>  
                <td>{member.email}</td>  
                <td>{member.hp}</td>  
                <td>{member.address}</td>  
                <td>{member.birth}</td>  
                <td>{member.residentNumber}</td>  
                <td>{member.grade}</td>
                <td>{member.state}</td>  
                <td><button className="AdMemberList-btn" onClick={() => handleEdit(member)}>수정</button></td>
                <td>
                  <button className="AdMemberList-btn" onClick={() => handleStatusChange(member)}>
                    {member.state === 'y' ? '정지' : '정지 해제'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="AdMemberList-pagination">
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
  );
};

export default AdMemberList;
