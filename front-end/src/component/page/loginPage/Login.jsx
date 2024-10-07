import React, { useState } from 'react';
import '../../../resource/css/Login.css'
import apiSer from '../../ApiService'
import {useNavigate} from 'react-router-dom';
import localStorage from 'localStorage';

function Login() {
//     if(localStorage.getItem('token') !== null || localStorage.getItem('token') !== ''){
//         alert('이미 로그인된 상태입니다.')
//         navigate('/')
//         }

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
    try {
        const form = {
            "userId": id,      // id 값 전달
            "userPw": password // pw 값 전달
        };
        const response = await apiSer.login(form);
        console.log("Login successful:", response);
        // 로그인 성공 시 처리
        const token = response.data.accessToken;
        localStorage.setItem("token",token.data);
        //console.log("token:", token);
        navigate("/");
    } catch (error) {
        console.error("Login failed:", error);
        // 로그인 실패 시 처리
        if(error.message == 'Request failed with status code 403') {
            alert("일치하는 아이디가 존재하지 않습니다.");
            } else if(error.message == 'Request failed with status code 401') {
                alert("비밀번호가 일치하지 않습니다.");
                }else{
                    alert("로그인에 실패했습니다.");
                    }
    }
};

    return (
        <div className="login-container">
            <div className="login_box_home">
                <div className="login_input-group">
                    <input
                        type="text"
                        placeholder="아이디"
                        className="id_input_box"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                    <span className="login_icon"></span>
                </div>
                <div className="login_input-group">
                    <input
                        type="password"
                        placeholder="비밀번호"
                        className="pw_input_box"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className="login-button" onClick={handleLogin}>로그인</button>
                <div className="login_move_other_href">
                    <a href="#">아이디 찾기</a> | <a href="#">비밀번호 찾기</a> | <a href="/signup">회원가입</a>
                </div>
            </div>
        </div>
    );
}

export default Login;