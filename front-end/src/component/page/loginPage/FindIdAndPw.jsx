import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../resource/css/login/FindIdAndPw.css'; // CSS 파일 경로 추가
import apiSer from '../../ApiService';

function FindIdAndPw() {
    const [form, setForm] = useState({
        userId: '',
        name: '',
        email: '',
        hp: '',
        hpAuthkey: '',
        newPassword: '', 
        confirmPassword: ''
    });
    const [selectedTab, setSelectedTab] = useState('id'); 
    const [selectedMethod, setSelectedMethod] = useState('phone'); 
    const [startCheckHp, setStartCheckHp] = useState(false); 
    const [stateAuth, setStateAuth] = useState(false); 
    const [hpAuthKey, setHpAuthKey] = useState(''); 
    const [authHp, setAuthHp] = useState(false); 
    const [idCheckMessage, setIdCheckMessage] = useState(''); 
    const [userId, setUserId] = useState(''); 

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
        resetState();
    };

    const handleMethodChange = (method) => {
        setSelectedMethod(method);
    };

    const handlePhoneAuth = () => {
        const hp = form.hp;
        if (hp.length < 10 || hp.length > 11) {
            setIdCheckMessage('올바른 휴대폰 번호를 입력하세요');
        } else {
            handleCheckHp(hp);
            setStartCheckHp(true);
        }
    };

    const handleCheckHp = (hp) => {
        apiSer.checkHp(hp)
            .then((response) => {
                setHpAuthKey(response.data);
            })
            .catch((error) => {
                console.error("Error checking Hp: ", error);
            });
    };

    const authingKey = () => {
        if (hpAuthKey === form.hpAuthkey.trim()) {
            setStateAuth(true);
            setAuthHp(true);
            if (selectedTab === 'id') {
                findUserId();
            }
        } else {
            alert("인증번호가 맞지 않습니다.");
        }
    };

    const findUserId = () => {
        const { name, hp } = form;
        apiSer.findUserId({ name, hp })
            .then((response) => {
                setUserId(response.data.userId);
            })
            .catch((error) => {
                console.error("Error finding user ID: ", error);
            });
    };

    const resetPw = () => {
        const { newPassword, confirmPassword, userId, name, hp } = form;

        if (newPassword !== confirmPassword) {
            alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        apiSer.resetPassword({ userId, name, hp, newPassword })
            .then(() => {
                alert("비밀번호가 성공적으로 재설정되었습니다.");
                navigate('/login');
            })
            .catch((error) => {
                console.error("Error resetting password: ", error);
            });
    };

    const resetState = () => {
        setForm({
            userId: '',
            name: '',
            email: '',
            hp: '',
            hpAuthkey: '',
            newPassword: '', 
            confirmPassword: '' 
        });
        setSelectedMethod('phone');
        setStartCheckHp(false);
        setStateAuth(false);
        setHpAuthKey('');
        setAuthHp(false);
        setIdCheckMessage('');
        setUserId('');
    };

    return (
        <div className="FindIdAndPw-container">
            <div className="FindIdAndPw-header">
                <h1>계정 찾기</h1>
                <div className="FindIdAndPw-tabs">
                    <button className={selectedTab === 'id' ? 'active' : ''} onClick={() => handleTabClick('id')}>
                        아이디 찾기
                    </button>
                    <button className={selectedTab === 'pw' ? 'active' : ''} onClick={() => handleTabClick('pw')}>
                        비밀번호 찾기
                    </button>
                </div>
            </div>

            {selectedTab === 'id' && (
                <div className="FindIdAndPw-methods">
                    <div className="method">
                        <label>
                            <input
                                type="radio"
                                name="find-method"
                                value="phone"
                                checked={selectedMethod === 'phone'}
                                onChange={() => handleMethodChange('phone')}
                            />
                            휴대폰으로 아이디 찾기
                        </label>
                        {selectedMethod === 'phone' && (
                            <>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    placeholder="이름을 입력하세요"
                                    onChange={handleChange}
                                    className="FindIdAndPw-input"
                                />
                                <input
                                    type="tel"
                                    name="hp"
                                    value={form.hp}
                                    placeholder="휴대폰 번호를 입력하세요"
                                    onChange={handleChange}
                                    className="FindIdAndPw-input"
                                />
                                <button className="FindIdAndPw-auth-btn" onClick={handlePhoneAuth}>휴대폰 인증</button>
                                {startCheckHp && (
                                    <>
                                        <input
                                            type="text"
                                            name="hpAuthkey"
                                            value={form.hpAuthkey}
                                            placeholder="인증번호를 입력하세요"
                                            onChange={handleChange}
                                            className="FindIdAndPw-input"
                                        />
                                        <button className="FindIdAndPw-auth-btn" onClick={authingKey}>인증 확인</button>
                                    </>
                                )}
                                {userId && <p>찾은 아이디: {userId}</p>}
                            </>
                        )}
                    </div>
                </div>
            )}

            {selectedTab === 'pw' && (
                <div className="FindIdAndPw-methods">
                    <div className="method">
                        <label>
                            <input
                                type="radio"
                                name="find-method"
                                value="phone"
                                checked={selectedMethod === 'phone'}
                                onChange={() => handleMethodChange('phone')}
                            />
                            휴대폰으로 비밀번호 찾기
                        </label>
                        {selectedMethod === 'phone' && (
                            <>
                                <input
                                    type="text"
                                    name="userId"
                                    value={form.userId}
                                    placeholder="아이디를 입력하세요"
                                    onChange={handleChange}
                                    className="FindIdAndPw-input"
                                />
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    placeholder="이름을 입력하세요"
                                    onChange={handleChange}
                                    className="FindIdAndPw-input"
                                />
                                <input
                                    type="tel"
                                    name="hp"
                                    value={form.hp}
                                    placeholder="휴대폰 번호를 입력하세요"
                                    onChange={handleChange}
                                    className="FindIdAndPw-input"
                                />
                                <button className="FindIdAndPw-auth-btn" onClick={handlePhoneAuth}>휴대폰 인증</button>
                                {startCheckHp && (
                                    <>
                                        <input
                                            type="text"
                                            name="hpAuthkey"
                                            value={form.hpAuthkey}
                                            placeholder="인증번호를 입력하세요"
                                            onChange={handleChange}
                                            className="FindIdAndPw-input"
                                        />
                                        <button className="FindIdAndPw-auth-btn" onClick={authingKey}>인증 확인</button>
                                        {stateAuth && (
                                            <>
                                                <input
                                                    type="password"
                                                    name="newPassword"
                                                    value={form.newPassword}
                                                    placeholder="새 비밀번호"
                                                    onChange={handleChange}
                                                    className="FindIdAndPw-input"
                                                />
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={form.confirmPassword}
                                                    placeholder="비밀번호 확인"
                                                    onChange={handleChange}
                                                    className="FindIdAndPw-input"
                                                />
                                                <button className="FindIdAndPw-auth-btn" onClick={resetPw}>비밀번호 재설정</button>
                                            </>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default FindIdAndPw;
