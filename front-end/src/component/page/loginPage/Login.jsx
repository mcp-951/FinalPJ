import React, { useState } from 'react';
import '../../../resource/css/Login.css'
import apiSer from '../../ApiService'
import {useNavigate} from 'react-router-dom';
import localStorage from 'localStorage';
import kakaoimg from 'resource/img/kakao_login.png'

function Login() {
//     if(localStorage.getItem('token') !== null || localStorage.getItem('token') !== ''){
//         alert('이미 로그인된 상태입니다.')
//         navigate('/')
//         }

    const Rest_api_key='7101f2d4aff750a5e9aba4237ed24b78' //REST API KEY
    const redirect_uri = 'http://localhost:8081/kakaoLogin' //Redirect URI
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleKaKaoLogin = () => {
        const width = 500;
        const height = 400;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const windowFeatures = `width=${width},height=${height},left=${left},top=${top}`;

        const kakaoLoginWindow = window.open(
            `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`,
            'kakaoLogin',
            windowFeatures
        );
    }


    const handleLogin = async () => {       // 로그인 로직
    try {
        const form = {
            "userId": id,      // id 값 전달
            "userPw": password // pw 값 전달
        };
        const response = await apiSer.login(form);
        console.log("Login successful:", response);
        // 로그인 성공 시 처리
        const token = response.data.accessToken;
        localStorage.setItem("token",token);
        const userNo =
        localStorage.setItem("userNo", response.data.userNo);
        navigate("/");
        window.location.reload();
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
                <div>
                    <>
                        <button onClick={handleKaKaoLogin}><img src = {kakaoimg}/></button>
                    </>
                </div>
            </div>
        </div>
    );
}


export default Login;