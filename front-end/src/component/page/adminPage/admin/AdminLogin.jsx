import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import '../../../../resource/css/admin/AdminLogin.css';
import localStorage from 'localStorage';
import { jwtDecode } from 'jwt-decode';

const AdminLogin = () => {
  const [adminID, setAdminID] = useState('');
  const [adminPW, setAdminPW] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
        console.log("전송할 데이터:", { userId: adminID, userPw: adminPW });
        const response = await axios.post('http://localhost:8081/login', {
            userId: adminID,
            userPw: adminPW
        });
        if (response.status === 200) {
            localStorage.clear();
            const token = response.data.accessToken;
            const decodedToken = jwtDecode(token);
            if(decodedToken.role === "ROLE_ADMIN") {
                localStorage.setItem("token",token);
                navigate('/adMemberList');
            }else{
                localStorage.clear();
                alert("존재하지 않는 아이디 입니다. ");
                navigate("/");
                return;
            }
        }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      if (error.response) {
        console.log("서버 오류 응답:", error.response);
        alert('로그인 실패: ' + error.response.data);
      } else {
        alert('로그인 실패: 서버와의 연결에 문제가 발생했습니다.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>관리자 로그인</h2>
        <input
          type="text"
          placeholder="아이디"
          value={adminID}
          onChange={(e) => setAdminID(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={adminPW}
          onChange={(e) => setAdminPW(e.target.value)}
        />
        <button onClick={handleLogin}>로그인</button>
      </div>
    </div>
  );
};

export default AdminLogin;
