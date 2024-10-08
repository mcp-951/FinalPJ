import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../service/ApiService';  // ApiService 사용
import '../../../../resource/css/admin/AdminLogin.css';

const AdminLogin = ({ setIsLoggedIn, isLoggedIn }) => {  // isLoggedIn과 상태 변경 함수 props로 전달
    const [adminID, setAdminID] = useState('');
    const [adminPW, setAdminPW] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
    try {
      // 전송할 데이터를 로그에 출력하여 확인
      console.log("전송할 데이터:", {
        userId: adminID,
        userPw: adminPW,
      });

      // ApiService 요청으로 로그인 API 호출
      const response = await ApiService.post('/login', {
        userId : adminID,
        userPw : adminPW
      });

      // 로그인 성공 처리
      if (response.status === 200) {
        alert('로그인 성공');
        const token = response.data.accessToken;
        localStorage.setItem("token",token);
        console.log(token);
        navigate('/memberList');
      }
    } catch (error) {
      // 에러 처리: 서버 응답이 있는 경우와 없는 경우 구분
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
    <div>
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
      <button onClick={handleLogin}>
        로그인
      </button>
    </div>
    );
};

export default AdminLogin;
