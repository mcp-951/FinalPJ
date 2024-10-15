import React, { useState, useEffect } from 'react';
import '../../../resource/css/Login.css';
import apiSer from '../../ApiService';
import { useNavigate } from 'react-router-dom';
import localStorage from 'localStorage';
import kakaoimg from 'resource/img/kakao_login.png';

function Login() {
    const Rest_api_key = '7101f2d4aff750a5e9aba4237ed24b78'; // REST API KEY
    const redirect_uri = 'http://localhost:8081/kakaoLogin'; // Redirect URI
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [popup, setPopup] = useState(null); // 팝업 상태

    // 팝업 카카오 연동 자식창
    const openPopup = () => {
        const width = 500;
        const height = 800;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const windowFeatures = `width=${width},height=${height},left=${left},top=${top}`;

        const popup = window.open(
            `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`,
            'kakaoLogin',
            windowFeatures
        );
        setPopup(popup);
        console.log(popup);
    };
    useEffect(() => {
        const currentUrl = window.location.href;
        const searchParams = new URL(currentUrl).searchParams;
        const code = searchParams.get("code");
        if (code) {
          window.opener.postMessage({ code }, window.location.origin);
        }
    }, []);
    // 로그인 팝입이 열리면 로그인 로직을 처리합니다.
    useEffect(() => {
        if (!popup) {
          return;
    }

    const githubOAuthCodeListener = (e) => {
        // 동일한 Origin 의 이벤트만 처리하도록 제한
        if (e.origin !== window.location.origin) {
            return;
        }
        const { code } = e.data;
        if (code) {
            console.log(`The popup URL has URL code param = ${code}`);
        }
        popup?.close();
        setPopup(null);
    };

    window.addEventListener("message", githubOAuthCodeListener, false);

    return () => {
        window.removeEventListener("message", githubOAuthCodeListener);
        popup?.close();
        setPopup(null);
    };
    }, [popup]);


    const handleKakaoLogin = async (code) => {
        try {
            // 백엔드로 code 전달 후 accessToken 획득
            const response = await apiSer.checkId(code); // 백엔드에서 accessToken 처리
            const accessToken = response.data.accessToken;

            if (accessToken) {
                localStorage.setItem('token', accessToken); // accessToken 저장
                console.log('카카오 로그인 성공, 토큰 저장:', accessToken);
                alert('로그인 성공');
                navigate('/'); // 메인 페이지로 이동
                window.location.reload(); // 새로고침으로 로그인 반영
            }
        } catch (error) {
            console.error('카카오 로그인 실패:', error);
            alert('카카오 로그인에 실패했습니다.');
        }
    };

    const handleLogin = async () => {
        try {
            const form = {
                userId: id,
                userPw: password,
            };
            const response = await apiSer.login(form);
            const token = response.data.accessToken;
            localStorage.setItem('token', token); // 로그인 성공 시 토큰 저장
            localStorage.setItem('userNo', response.data.userNo);
            navigate('/');
            window.location.reload(); // 페이지 새로고침
        } catch (error) {
            console.error('로그인 실패:', error);
            if (error.message === 'Request failed with status code 403') {
                alert('일치하는 아이디가 존재하지 않습니다.');
            } else if (error.message === 'Request failed with status code 401') {
                alert('비밀번호가 일치하지 않습니다.');
            } else {
                alert('로그인에 실패했습니다.');
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
                    <button onClick={openPopup}>
                        <img src={kakaoimg} alt="카카오 로그인" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;