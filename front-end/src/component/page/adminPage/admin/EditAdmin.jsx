import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ApiService from '../service/ApiService'; // ApiService 사용
import '../../../../resource/css/admin/EditAdmin.css';
import Sidebar from '../Sidebar';

const EditAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminNo, adminID, adminName } = location.state; // 전달된 관리자 정보

  const [updatedAdminId, setUpdatedAdminId] = useState(adminID); // 수정 가능한 상태로 설정
  const [updatedAdminName, setUpdatedAdminName] = useState(adminName);
  const [updatedAdminPassword, setUpdatedAdminPassword] = useState(''); // 비밀번호 필드

  // 저장 버튼 클릭 시 호출되는 함수
  const handleSave = () => {
    const updatedAdmin = {
      adminNo,  // 관리자 번호 유지
      adminID: updatedAdminId,
      adminName: updatedAdminName,
      adminPW: updatedAdminPassword || '1234',  // 비밀번호가 입력되지 않은 경우 기본값 유지
    };

    // ApiService를 통해 수정된 데이터를 백엔드로 전송
    ApiService.put(`/admin/update/${adminNo}`, updatedAdmin)  // adminNo를 URI에 포함
      .then((response) => {
        alert('관리자 정보가 성공적으로 수정되었습니다.');
        navigate('/adminList');  // 수정 후 관리자 목록 페이지로 이동
      })
      .catch((error) => {
        console.error('관리자 정보 수정 중 오류 발생:', error);
        alert('관리자 정보 수정에 실패했습니다.');
      });
  };

  return (
    <div className="edit-admin-container">
      <Sidebar />
      <div className="edit-content">
        <h2>관리자 수정</h2>
        <table className="edit-admin-table">
          <tbody>
            <tr>
              <td className="label">관리자 번호</td>
              <td><input type="text" value={adminNo} disabled /></td>
            </tr>
            <tr>
              <td className="label">관리자 아이디</td>
              <td>
                <input
                  type="text"
                  value={updatedAdminId}
                  onChange={(e) => setUpdatedAdminId(e.target.value)} // 수정 가능하도록
                />
              </td>
            </tr>
            <tr>
              <td className="label">관리자 비번</td>
              <td>
                <input
                  type="password"
                  value={updatedAdminPassword}
                  onChange={(e) => setUpdatedAdminPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                />
              </td>
            </tr>
            <tr>
              <td className="label">관리자 이름</td>
              <td>
                <input
                  type="text"
                  value={updatedAdminName}
                  onChange={(e) => setUpdatedAdminName(e.target.value)}
                />
              </td>
            </tr>
           </tbody>
        </table>
        <button onClick={handleSave} className="save-btn">수정</button> {/* 수정 저장 버튼 */}
      </div>
    </div>
  );
};

export default EditAdmin;
