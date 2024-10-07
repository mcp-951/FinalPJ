import React, { useState } from 'react';
import '../../../resource/css/login/Login.css'

function Login() {
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);

    const toggleKeepLoggedIn = () => {
        setKeepLoggedIn(!keepLoggedIn);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="input-group">
                    <input type="text" placeholder="아이디" className="login-input" />
                    <span className="icon">👤</span>
                </div>
                <div className="input-group">
                    <input type="password" placeholder="비밀번호" className="login-input" />
                    <span className="icon">🔒</span>
                    <span className="toggle-password">👁️</span>
                </div>
                <div className="keep-login">
                    <label>
                        <input
                            type="checkbox"
                            checked={keepLoggedIn}
                            onChange={toggleKeepLoggedIn}
                        />
                        로그인 상태 유지
                    </label>
                </div>
                <button className="login-button">로그인</button>
                <div className="login-footer">
                    <a href="#">아이디 찾기</a> | <a href="#">비밀번호 찾기</a> | <a href="#">회원가입</a>
                </div>
            </div>
        </div>
    );
}

export default Login;