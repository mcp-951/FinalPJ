import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../resource/css/user/MyPageChangePw.css'; // CSS 파일 경로 추가

function MyPageChangePw() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userPw: '',
    newUserPw: '',
    confirmNewUserPw: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const backToMyPage = () => {
    navigate("/mypage");
  };

  return (
    <div className="MyPageChangePw-container">
      <h2 className="MyPageChangePw-title">비밀번호 변경</h2>
      <div className="MyPageChangePw-form">
        <table className="MyPageChangePw-table">
          <tbody>
            <tr>
              <td>기존 비밀번호 확인</td>
              <td>
                <input
                  type="password"
                  name="userPw"
                  value={form.userPw}
                  onChange={handleChange}
                  className="MyPageChangePw-input"
                />
              </td>
            </tr>
            <tr>
              <td>새 비밀번호</td>
              <td>
                <input
                  type="password"
                  name="newUserPw"
                  value={form.newUserPw}
                  onChange={handleChange}
                  className="MyPageChangePw-input"
                />
              </td>
            </tr>
            <tr>
              <td>새 비밀번호 확인</td>
              <td>
                <input
                  type="password"
                  name="confirmNewUserPw"
                  value={form.confirmNewUserPw}
                  onChange={handleChange}
                  className="MyPageChangePw-input"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="MyPageChangePw-buttons">
          <button className="MyPageChangePw-btn">변경</button>
          <button className="MyPageChangePw-btn MyPageChangePw-cancel-btn" onClick={backToMyPage}>취소</button>
        </div>
      </div>
    </div>
  );
}

export default MyPageChangePw;
