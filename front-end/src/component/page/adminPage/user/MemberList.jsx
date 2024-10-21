import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar';  // 좌측에 사이드바 컴포넌트 추가
import '../../../../resource/css/admin/MemberList.css';  // CSS 파일 추가
import localStorage from 'localStorage';

const MemberList = () => {
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [searchField, setSearchField] = useState('전체');
    const [searchTerm, setSearchTerm] = useState('');
    const [displayCount, setDisplayCount] = useState(10);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const response = axios.get('http://localhost:8081/admin/getUserList', {
            headers: { 'Authorization': `Bearer ${token}` }
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
        navigate('/editMember', { state: { memberData: member } });
    };

    const handleStatusChange = (member) => {
        const updatedMember = { ...member, state: member.state === 'y' ? 'n' : 'y' };
        axios.put(`http://localhost:8081/admin/setState/${member.userNo}`, updatedMember, {
            headers: { 'Authorization': `Bearer ${token}` }
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

    const filteredList = members.filter(member => {
        if (searchField === '이름') return member.name.includes(searchTerm);
        if (searchField === '이메일') return member.email.includes(searchTerm);
        if (searchField === '핸드폰') return member.hp.includes(searchTerm);
        return true;
    }).slice(0, displayCount);

    return (
        <div className="member-container">
            <Sidebar />
            <div className="member-list-content">
                <h2 className="member-list-title">회원 관리</h2>

                <div className="search-controls">
                    <div className="search-bar">
                        <select className="search-select" value={searchField} onChange={(e) => setSearchField(e.target.value)}>
                            <option value="전체">전체</option>
                            <option value="이름">이름</option>
                            <option value="이메일">이메일</option>
                            <option value="핸드폰">핸드폰</option>
                        </select>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="검색어를 입력하세요."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-btn">검색</button>
                    </div>

                    <div className="pagination-controls">
                        <label>표시 개수: </label>
                        <select className="pagination-select" value={displayCount} onChange={(e) => setDisplayCount(Number(e.target.value))}>
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
                            <th>주민번호</th>
                            <th>상태</th>
                            <th>수정</th>
                            <th>정지/정지 해제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredList.map((member, index) => (
                            <tr key={member.userNo} className="member-row">
                                <td>{index + 1}</td>
                                <td>{member.userId}</td>
                                <td>{member.name}</td>
                                <td>{member.email}</td>
                                <td>{member.hp}</td>
                                <td>{member.address}</td>
                                <td>{member.birth}</td>
                                <td>{member.residentNumber}</td>
                                <td className={member.state === 'y' ? 'active' : 'inactive'}>
                                    {member.state === 'y' ? '활성' : '비활성'}
                                </td>
                                <td><button className="edit-btn" onClick={() => handleEdit(member)}>수정</button></td>
                                <td>
                                    <button className="status-btn" onClick={() => handleStatusChange(member)}>
                                        {member.state === 'y' ? '정지' : '정지 해제'}
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

export default MemberList;
