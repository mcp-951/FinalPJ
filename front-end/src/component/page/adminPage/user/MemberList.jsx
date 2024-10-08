// MemberList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar';  // 좌측에 사이드바 컴포넌트 추가
import '../../../../resource/css/admin/MemberList.css';  // CSS 파일 추가
import localStorage from 'localStorage';

const MemberList = () => {
    const navigate = useNavigate();  // 페이지 이동을 위한 useNavigate hook 사용
    const [members, setMembers] = useState([]);  // 회원 목록 상태 관리
    const [searchField, setSearchField] = useState('전체');  // 검색 필드 상태 관리 (이름, 이메일, 핸드폰 등)
    const [searchTerm, setSearchTerm] = useState('');  // 검색어 상태 관리
    const [displayCount, setDisplayCount] = useState(10);  // 페이지당 표시할 회원 수 상태 관리
    const token = localStorage.getItem("token");
  // 백엔드에서 NORMAL 및 STOP 상태 회원 목록 가져오기
  useEffect(() => {
    const response = axios.get('http://localhost:8081/admin/getUserList',{
            headers: {
                'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
            }
        }) // API 호출하여 전체 회원 목록 가져오기
      .then((response) => {
        const filteredMembers = response.data.filter(member => 
          member.state === 'y' || member.state === 'n'  // 상태가 NORMAL 또는 STOP인 회원만 필터링
        );
        console.log('서버에서 받은 유저 데이터:', filteredMembers);  // 받은 데이터 확인 (디버깅용)
        setMembers(filteredMembers);  // 필터링된 목록으로 상태 업데이트
      })
      .catch((error) => {
        console.error('회원 목록을 불러오는 중 오류 발생:', error);  // 오류 처리
      });
  }, []);  // 컴포넌트가 마운트될 때만 실행 (의존성 배열이 비어 있음)

  // 수정 버튼 클릭 시 해당 회원의 데이터를 수정 페이지로 이동
  const handleEdit = (member) => {
    navigate('/editMember', { state: { memberData: member } });  // 수정 페이지로 이동하며 회원 데이터를 전달
  };

  // 회원 정지 및 정지 해제 처리
  const handleStatusChange = (member) => {
    const updatedMember = { ...member, state: member.state === 'y' ? 'n' : 'y' };  // 상태가 NORMAL이면 STOP으로, 반대의 경우 NORMAL로 변경

    axios.put(`/user/update/${member.userNo}`, updatedMember)  // API 호출로 회원 상태 업데이트
      .then(() => {
        setMembers(prevMembers => 
          prevMembers.map(m => (m.userNo === member.userNo ? updatedMember : m))  // 업데이트된 회원 목록 상태 갱신
        );
      })
      .catch((error) => {
        console.error('회원 상태 업데이트 중 오류 발생:', error);  // 오류 처리
      });
  };

  // 필터링 로직: 선택한 검색 필드와 검색어에 맞게 회원 목록 필터링
  const filteredList = members.filter(member => {
    if (searchField === '이름') {
      return member.name.includes(searchTerm);  // 이름 필드에서 검색어 포함 여부 확인
    } else if (searchField === '이메일') {
      return member.email.includes(searchTerm);  // 이메일 필드에서 검색어 포함 여부 확인
    } else if (searchField === '핸드폰') {
      return member.hp.includes(searchTerm);  // 핸드폰 필드에서 검색어 포함 여부 확인
    }
    return true;  // 전체를 선택한 경우 필터링 없이 전체 목록 반환
  }).slice(0, displayCount);  // 표시 개수만큼 잘라내기

  return (
    <div className="member-container">  {/* CSS 스타일 적용된 컨테이너 */}
      <Sidebar />  {/* 좌측에 사이드바 컴포넌트 렌더링 */}
      <div className="main-content"/>  {/* 메인 컨텐츠 영역 */}
      <div className="member-list-content">  {/* 회원 목록 컨텐츠 영역 */}
        <h2>회원 관리</h2>  {/* 타이틀 */}

        <div className="search-controls">  {/* 검색 및 필터링 컨트롤 */}
          <div className="search-bar">  {/* 검색 바 */}
            <select value={searchField} onChange={(e) => setSearchField(e.target.value)}>  {/* 검색 필드 선택 */}
              <option value="전체">전체</option>
              <option value="이름">이름</option>
              <option value="이메일">이메일</option>
              <option value="핸드폰">핸드폰</option>
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

        <table className="member-table">  {/* 회원 목록 테이블 */}
          <thead>
            <tr>
              <th>No</th>
              <th>아이디</th>
              <th>이름</th>
              <th>이메일</th>
              <th>핸드폰</th>
              <th>주소</th>
              <th>생년월일</th>
              <th>주민번호</th> {/* 주민번호 추가 */}
              <th>상태</th> {/* 상태 필드 추가 */}
              <th>수정</th>
              <th>정지/정지 해제</th> {/* 정지 버튼 추가 */}
            </tr>
          </thead>
          <tbody>
            {filteredList.map((member, index) => (
              <tr key={member.userNo}>  {/* 회원별 데이터를 행으로 표시 */}
                <td>{index + 1}</td>  {/* 회원 번호 */}
                <td>{member.userID}</td>  {/* 회원 아이디 */}
                <td>{member.name}</td>  {/* 회원 이름 */}
                <td>{member.email}</td>  {/* 회원 이메일 */}
                <td>{member.hp}</td>  {/* 회원 핸드폰 번호 */}
                <td>{member.address}</td>  {/* 회원 주소 */}
                <td>{member.birth}</td>  {/* 회원 생년월일 */}
                <td>{member.residentNumber}</td>  {/* 주민번호 추가 */}
                <td>{member.state}</td>  {/* 회원 상태 (NORMAL/STOP) */}
                <td><button onClick={() => handleEdit(member)}>수정</button></td>  {/* 수정 버튼 */}
                <td>
                  <button onClick={() => handleStatusChange(member)}>  {/* 정지/정지 해제 버튼 */}
                    {member.state === 'NORMAL' ? '정지' : '정지 해제'}  {/* 상태에 따라 버튼 텍스트 변경 */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberList;  // MemberList 컴포넌트 내보내기
