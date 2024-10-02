import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../../../resource/css/admin/EditAdmin.css';
import Sidebar from '../Sidebar';

const EditAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, name } = location.state;

  const [adminId, setAdminId] = useState(`admin_${id}`); // 수정 가능하도록 변경
  const [adminName, setAdminName] = useState(name);
  const [adminPassword, setAdminPassword] = useState('');

  const handleSave = () => {
    // 수정된 데이터를 리스트 페이지로 전송
    navigate('/adminList', { state: { id, adminId, adminName, adminPassword } });
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
              <td><input type="text" value={id} disabled /></td>
            </tr>
            <tr>
              <td className="label">관리자 아이디</td>
              <td>
                <input
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)} // 관리자 아이디 수정 가능
                />
              </td>
            </tr>
            <tr>
              <td className="label">관리자 비번</td>
              <td>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                />
              </td>
            </tr>
            <tr>
              <td className="label">관리자 이름</td>
              <td>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                />
              </td>
            </tr>
           </tbody>
        </table>
        <button onClick={handleSave} className="save-btn">수정</button>
      </div>
    </div>
  );
};

export default EditAdmin;
