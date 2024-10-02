import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../../../resource/css/admin/AdminList.css';
import Sidebar from '../Sidebar';

const AdminList = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 hook
  const location = useLocation(); // 현재 위치의 상태를 가져오기 위한 hook

  // 관리자 데이터를 관리하는 상태 (초기 값으로 일부 관리자 목록 설정)
  const [admins, setAdmins] = useState([
    { id: 1, adminId: 'admin_1', name: '홍길동' },
    { id: 2, adminId: 'admin_2', name: '김철수' },
    { id: 3, adminId: 'admin_3', name: '박채림' },
    { id: 4, adminId: 'admin_4', name: '이순신' },
    { id: 5, adminId: 'admin_5', name: '강동원' },
  ]);

  // 새로운 관리자 등록을 위한 입력 상태
  const [newAdminId, setNewAdminId] = useState('');

  // 검색어를 관리하는 상태
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // location 상태를 받아서 관리자가 수정될 경우 목록 업데이트
    if (location.state) {
      const { id, adminId, adminName } = location.state;

      // 기존의 관리자 상태를 업데이트
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin.id === id ? { ...admin, adminId, name: adminName } : admin
        )
      );
    }
  }, [location.state]); // location의 상태가 변할 때만 업데이트

  // 관리자 수정 버튼 클릭 시 호출, 수정 페이지로 이동
  const handleEdit = (admin) => {
    navigate('/editAdmin', { state: admin });
  };

  // 관리자 삭제 버튼 클릭 시 호출, 목록에서 해당 관리자 삭제
  const handleDelete = (adminId) => {
    setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.adminId !== adminId));
  };

  // 새로운 관리자 등록 처리 함수
  const handleRegister = () => {
    if (newAdminId.trim() === '') {
      alert('관리자 아이디를 입력해주세요.');
      return;
    }

    // 등록된 관리자 이름 예시 (DB와 연동 시, DB에서 이름을 가져와야 함)
    const adminNameMap = {
      admin_1: '홍길동',
      admin_2: '김철수',
      admin_3: '박채림',
      admin_4: '이순신',
      admin_5: '강동원',
    };

    // 입력된 아이디에 해당하는 이름 가져오기
    const adminName = adminNameMap[newAdminId];

    if (!adminName) {
      alert('유효한 관리자 아이디가 아닙니다.');
      return;
    }

    // 새로운 관리자 정보 추가
    const newAdmin = {
      id: admins.length + 1, // 기존 관리자 수 + 1로 No를 부여
      adminId: newAdminId,
      name: adminName,
    };

    // 새로운 관리자를 기존 목록에 추가하고 입력 필드 초기화
    setAdmins((prevAdmins) => [newAdmin, ...prevAdmins]);
    setNewAdminId('');
  };

  // 검색어에 맞는 관리자 필터링 처리 (아이디 또는 이름으로 필터링)
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.adminId.toLowerCase().includes(searchTerm.toLowerCase()) || // 아이디 검색
      admin.name.includes(searchTerm) // 이름 검색
  );

  return (
    <div className="admin-container">
      <Sidebar /> {/* 사이드바 컴포넌트 */}
      <div className="admin-list-container">
        <h2>관리자 리스트</h2>

        {/* 관리자 등록 입력창 */}
        <div className="admin-register">
          <input
            type="text"
            placeholder="등록할 관리자 아이디를 입력하세요"
            value={newAdminId} // 입력된 새로운 관리자 아이디
            onChange={(e) => setNewAdminId(e.target.value)} // 입력 변경 시 상태 업데이트
          />
          <button onClick={handleRegister}>등록</button> {/* 등록 버튼 */}
        </div>

        {/* 검색 기능 추가 */}
        <div className="admin-search">
          <input
            type="text"
            placeholder="관리자 아이디 또는 이름 검색"
            value={searchTerm} // 검색어 상태
            onChange={(e) => setSearchTerm(e.target.value)} // 입력 변경 시 상태 업데이트
          />
        </div>

        {/* 관리자 목록 테이블 */}
        <table className="admin-table">
          <thead>
            <tr>
              <th>No</th>
              <th>관리자 아이디</th>
              <th>관리자 이름</th>
              <th>수정</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {/* 필터된 관리자를 테이블에 렌더링 */}
            {filteredAdmins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.id}</td> {/* 관리자 순번 */}
                <td>{admin.adminId}</td> {/* 관리자 아이디 */}
                <td>{admin.name}</td> {/* 관리자 이름 */}
                <td>
                  <img
                    src='/images/admin/sujung.png'
                    alt="수정"
                    className="icon"
                    onClick={() => handleEdit(admin)} // 수정 버튼 클릭 시
                  />
                </td>
                <td>
                  <img
                    src='/images/admin/hujitong.jpg'
                    alt="삭제"
                    className="icon"
                    onClick={() => handleDelete(admin.adminId)} // 삭제 버튼 클릭 시
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminList;
