import React, { useState, useEffect } from 'react';
import '../../../resource/css/Login.css';
import apiSer from '../../ApiService';
import { useNavigate } from 'react-router-dom';
import localStorage from 'localStorage';
import kakaoimg from 'resource/img/kakao_login.png';

function Login() {
    const Rest_api_key = '7101f2d4aff750a5e9aba4237ed24b78';    // REST API KEY
    const redirect_uri = 'http://localhost:3000/kakaoLogin';    // 카카오 연동로그인 Redirect URI
    const [id, setId] = useState('');                           // 아이디 변수 설정
    const [password, setPassword] = useState('');               // 패스워드 변수 설정
    const navigate = useNavigate();                             // 네비게이트 기능 사용
    const [popup, setPopup] = useState(null);                   // 팝업 상태

    // 팝업 카카오 연동 자식창
    const openPopup = () => {
        const width = 500;
        const height = 800;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const windowFeatures = `width=${width},height=${height},left=${left},top=${top}`;
        // 카카오 로그인 팝업 호출
        const popup = window.open(
            `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`,
            'kakaoLogin',
            windowFeatures
        );
        setPopup(popup);        // 팝업 오픈으로 상태 변경
    };
    // 부모 창에서 메시지 수신
    useEffect(() => {
        const messageListener = (event) => {
            if (event.origin !== window.location.origin) return; // 같은 도메인에서 온 메시지만 처리
            const { code } = event.data;
            console.log(code);
            if (code) {
                handleKakaoLogin(code); // 로그인 처리
                popup?.close(); // 팝업 닫기
                setPopup(null);
            }
        };
        window.addEventListener('message', messageListener);
        return () => {
            window.removeEventListener('message', messageListener);
            popup?.close();
        };
    }, [popup]);

    // 카카오 로그인 처리
    const handleKakaoLogin = async (code) => {
        try {
            const response = await apiSer.kakaoLogin(code);     // axios 사용한 벡앤드 통신
            //console.log(response.data)
            const kakaoId = response.data;                      // 통신 데이터를 변수에 저장

            const response2 = await apiSer.checkId(kakaoId);
            console.log(response2.data);  // 서버에서 받은 데이터

            if (response2.data === "" || response2.data === null || response2.data === undefined) {
                alert('추가 회원가입이 필요합니다.');
                // 값을 가지고 회원가입 페이지로 이동
                navigate('/signupForKakao', { state: { kakaoId: kakaoId } });
            } else {
                // 로그인 처리
                const data = {  // 아이디 비밀번호 설정
                    "userId" : kakaoId,
                    "userPw" : kakaoId
                };
                const response = await apiSer.login(data)           // 로그인 벡앤드 통신
                    .then((response) =>{
                        const token = response.data.accessToken;            // 통신 데이터 변수에 저장
                        localStorage.setItem('token', token);               // 로그인 성공 시 토큰 저장
                        localStorage.setItem('userNo', response.data.userNo);
                        navigate('/'); // 메인 페이지로 이동
                    })
                    .catch((error) =>{
                        console.error("Error checking Hp: ", error);
                    })
            }
        } catch (error) {
            console.error('카카오 로그인 실패:', error);
        }
    };

    // 로그인 처리
    const handleLogin = async () => {
        try {
            const form = {
                userId: id,
                userPw: password,
            };
            const response = await apiSer.login(form)      // 로그인 벡앤드 통신
                .then((response) =>{
                    const token = response.data.accessToken;                // 통신 데이터 변수에 저장
                    localStorage.setItem('token', token);                   // 로그인 성공 시 토큰 저장
                    localStorage.setItem('userNo', response.data.userNo);   // 로그인 성공 시 유저 넘버 저장
                    navigate('/'); // 메인 페이지로 이동
                })
                .catch((error) =>{
                    console.error("Error : ", error);
                })
        } catch (error) {
            console.error('로그인 실패:', error);
            if (error.message === 'Request failed with status code 403') {  // 아이디 일치하지 않거나 정지당한 유저의 경우
                alert('일치하는 아이디가 존재하지 않습니다.');
            } else if (error.message === 'Request failed with status code 401') {   // 비밀번호 불일치
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
                    <a href="/FindIdAndPw">아이디/비밀번호 찾기</a> |  <a href="/signup">회원가입 </a>
                </div>
                <div>
                <button onClick={openPopup} style={{ border: 'none', background: 'none' }}>
                    <img src={kakaoimg} alt="카카오 로그인" />
                </button>
                </div>
            </div>
        </div>
    );
}

export default Login;