import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../resource/css/login/FindIdAndPw.css';
import apiSer from '../../ApiService';

function FindIdAndPw() {
    const [form, setForm] = useState({
        userId:'',
        name: '',
        email: '',
        email1: '',
        email2: '',
        hp: '',
        hpAuthkey: '',
        userPw: '', // 새로운 비밀번호 필드 추가
        confirmPassword: '' // 비밀번호 확인 필드 추가
    });
    const [selectedTab, setSelectedTab] = useState('id'); // 'id' 또는 'pw' 탭 상태값
    const [selectedMethod, setSelectedMethod] = useState('phone'); // 기본 인증 방법 선택 (휴대폰)
    const [startCheckHp, setStartCheckHp] = useState(false); // 휴대폰 인증 확인 상태
    const [stateAuth, setStateAuth] = useState(false); // 인증 성공 여부 상태
    const [hpAuthKey, setHpAuthKey] = useState(''); // 서버에서 받은 휴대폰 인증 키
    const [authHp, setAuthHp] = useState(false); // 인증 완료 여부 상태
    const [idCheckMessage, setIdCheckMessage] = useState(''); // 메시지 상태 관리
    const [userId, setUserId] = useState(''); // 찾은 아이디 저장

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleTabClick = (tab) => {
        setSelectedTab(tab); // 탭 전환
        resetState(); // 상태 초기화
    };

    const handleMethodChange = (method) => {
        setSelectedMethod(method); // 인증 방법 변경
    };

    // 휴대폰 인증 요청
    const handlePhoneAuth = () => {
        const hp = form.hp;
        if (hp.length < 10 || hp.length > 11) {
            setIdCheckMessage('올바른 휴대폰 번호를 입력하세요');
        } else {
            console.log("hp: " + hp);
            handleCheckHp(hp); // API 호출
            setStartCheckHp(true); // 인증 단계로 진행
        }
    };

    const handleCheckHp = (hp) => {
        apiSer.checkHp(hp)
            .then((response) => {
                setHpAuthKey(response.data); // 서버로부터 인증 키 받음
            })
            .catch((error) => {
                console.error("Error checking Hp: ", error);
            });
    };

    // 인증 키 확인
    const authingKey = () => {
        const getHpAuthKey = String(hpAuthKey).trim();
        const getFormHpAuthKey = String(form.hpAuthkey).trim();
        console.log("hpAuthKey: " + hpAuthKey + ", form.hpAuthkey: " + form.hpAuthkey);

        if (getHpAuthKey === getFormHpAuthKey) {
            setStateAuth(true); // 인증 성공
            setAuthHp(true);
            if (selectedTab === 'id') {
                findUserId(); // 아이디 찾기
            } else {

            }
        } else {
            alert("인증번호가 맞지 않습니다.");
        }
    };

    // 인증 성공 시 아이디 찾기
    const findUserId = () => {
        const { name, hp } = form;
        const response = apiSer.findUserId({ name, hp }) // API를 통해 서버에서 아이디 요청
            .then((response) => {
                console.log(response)
                console.log(response.data.userId)
                if(response.data == ''){
                    alert("일치하는 아이디가 존재하지 않습니다.")
                } else {
                    setUserId(response.data.userId); // 서버로부터 받은 아이디 저장
                }

            })
            .catch((error) => {
                console.error("Error finding user ID: ", error);
            });
    };

    // 인증 성공 시 비밀번호 재설정
    const resetPw = () => {
        const { userPw, confirmPassword, userId, name, hp } = form;

        if (userPw !== confirmPassword) {
            alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        // 비밀번호 재설정 API 호출
        const response = apiSer.resetPassword({ userId,name, hp, userPw })
            .then((response) => {
                console.log(response.data)
                if(response.data === ''){
                    alert("일치 정보가 존재하지 않습니다. 다시 시도해주세요.")
                    }else{
                        alert("비밀번호가 성공적으로 재설정되었습니다.");
                        navigate('/login'); // 로그인 페이지로 이동
                        }
                })
            .catch((error) => {
                console.error("Error resetting password: ", error);
            });
    };

    // 상태 초기화 함수
    const resetState = () => {
        setForm({
            userId:'',
            name: '',
            email: '',
            email1: '',
            email2: '',
            hp: '',
            hpAuthkey: '',
            userPw: '', // 새로운 비밀번호 초기화
            confirmPassword: '' // 비밀번호 확인 초기화
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
                                                    name="userPw"
                                                    value={form.userPw}
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