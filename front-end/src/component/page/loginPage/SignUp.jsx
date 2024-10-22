import React, { useState, useEffect } from 'react';
import apiSer from '../../ApiService';
import { useNavigate } from 'react-router-dom';
import '../../../resource/css/login/SignUp.css';

function SignUp() {
    const [form, setForm] = useState({
        userId: '',
        userPw: '',
        confirmPassword: '',
        name: '',
        email: '',
        email1: '',
        email2: '',
        hp: '',
        birth: '',
        residentNumber1: '',
        residentNumber2: '',
        hpAuthkey: '',
        ocrCheck: '',
        address: '',
        address1: '',
        address2: ''
    });
    const [idCheckMessage, setIdCheckMessage] = useState('');
    const [idCheckState, setIdCheckState] = useState('');
    const [startCheckHp, setStartCheckHp] = useState(false);
    const [stateAuth, setStateAuth] = useState(false);
    const [pwSameCheck, setPwSameCheck] = useState(false);
    const [plusAddress, setPlusAddress] = useState(false);
    const [hpAuthKey, setHpAuthKey] = useState('');
    const [authHp, setAuthHp] = useState(false);
    const [resNoError1, setResNoError1] = useState('');
    const [resNoError2, setResNoError2] = useState('');
    const [ocrCheck, setOcrCheck] = useState(false); // 신분증 인증 상태
    const [ocrName, setOcrName] = useState(''); // 신분증에서 받아온 이름
    const [ocrLocalNo, setOcrLocalNo] = useState(''); // 신분증에서 받아온 주민번호

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // 신분증 인증 처리 함수
    const ocrMove = () => {
        const localNo = form.residentNumber1 + form.residentNumber2;
        const userName = form.name;

        if (!ocrCheck) {
            const popup = window.open('http://localhost:3000/ocr', '_blank');

            window.addEventListener('message', (event) => {
                if (event.origin === 'http://localhost:3000') {
                    const { value1, value2 } = event.data;

                    setOcrName(value1);
                    setOcrLocalNo(value2);

                    if (value1 && value2 && userName === value1 && value2 === localNo) {
                        setOcrCheck(true);
                        setForm({ ...form, ocrCheck: '1' });
                    }
                }
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (idCheckState === '' || idCheckState === false) {
            setIdCheckMessage('아이디 중복확인을 해주세요.');
        } else if (form.userPw === '' || form.userPw !== form.confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
        } else if (!authHp) {
            alert('휴대폰 인증을 완료해 주세요.');
        } else if (!ocrCheck) {
            alert('신분증 인증을 진행하세요.');
        } else {
            apiSer.signUp({ ...form }).then(() => {
                navigate('/login');
            });
        }
    };

    // 아이디 중복 확인
    const idCheck = () => {
        const userId = form.userId;
        if (userId === '') {
            setIdCheckMessage('아이디를 입력하세요');
        } else {
            handleCheckId(userId);
        }
    };

    const handleCheckId = (userId) => {
        apiSer.checkId(userId)
            .then((response) => {
                if (response.data === '') {
                    setIdCheckMessage(`${userId}는(은) 사용가능한 아이디입니다.`);
                    setIdCheckState(true);
                } else {
                    setIdCheckMessage(`${userId}는(은) 이미 존재하는 아이디입니다.`);
                    setIdCheckState(false);
                }
            })
            .catch((error) => {
                console.error('Error checking ID: ', error);
            });
    };

    // 비밀번호 확인
    useEffect(() => {
        checkingPw();
    }, [form.userPw, form.confirmPassword]);

    const checkingPw = () => {
        if (form.userPw && form.confirmPassword) {
            if (form.userPw === form.confirmPassword) {
                setPwSameCheck(false);
            } else {
                setPwSameCheck(true);
            }
        }
    };

    // 이메일 셀렉트 박스 자동 입력
    const handleChangeEmail2 = (e) => {
        const selectedEmail = e.target.value;
        setForm({ ...form, email2: selectedEmail });
    };

    // 주민등록번호 체크
    const checkResNo1 = () => {
        if (form.residentNumber1.length !== 6 && form.residentNumber1.length !== 0) {
            setResNoError1('주민등록번호 앞자리는 6자리여야 합니다.');
        } else {
            setResNoError1('');
        }
    };

    const checkResNo2 = () => {
        if (form.residentNumber2.length !== 7 && form.residentNumber2.length !== 0) {
            setResNoError2('주민등록번호 뒷자리는 7자리여야 합니다.');
        } else {
            setResNoError2('');
        }
    };

    useEffect(() => {
        checkResNo1();
        checkResNo2();
    }, [form.residentNumber1, form.residentNumber2]);

    // 휴대폰 인증
    const hpCheck = () => {
        const hp = form.hp;
        if (hp.length < 10 || hp.length > 11) {
            setIdCheckMessage('올바른 휴대폰 번호를 입력하세요');
        } else {
            handleCheckHp(hp);
            setStartCheckHp(true);
        }
    };

    const authingKey = () => {
        const getHpAuthKey = String(hpAuthKey).trim();
        const getFormHpAuthKey = String(form.hpAuthkey).trim();
        if (getHpAuthKey === getFormHpAuthKey) {
            setStateAuth(true);
            setAuthHp(true);
        } else {
            alert('인증번호가 맞지 않습니다.');
        }
    };

    const handleCheckHp = (hp) => {
        apiSer.checkHp(hp)
            .then((response) => {
                setHpAuthKey(response.data);
            })
            .catch((error) => {
                console.error('Error checking Hp: ', error);
            });
    };

    // 주소 검색 팝업
    const openPopup = () => {
        const width = 500;
        const height = 450;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const windowFeatures = `width=${width},height=${height},left=${left},top=${top}`;

        window.open('/getAddress', 'getAddress', windowFeatures);
    };

    useEffect(() => {
        const receiveMessage = (event) => {
            if (event.origin !== window.location.origin) return;
            if (event.data.address) {
                setForm((prevForm) => ({ ...prevForm, address1: event.data.address }));
                setPlusAddress(true);
            }
        };
        window.addEventListener('message', receiveMessage);

        return () => {
            window.removeEventListener('message', receiveMessage);
        };
    }, []);

    return (
        <div className="SignUp-container">
            <form onSubmit={handleSubmit} className="SignUp-form">
                <div className="form-row">
                    <label className="SignUp-label">아이디</label>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="아이디를 입력하세요"
                            name="userId"
                            value={form.userId}
                            onChange={handleChange}
                            className="SignUp-input"
                        />
                        <button type="button" onClick={idCheck} className="SignUp-button">중복체크</button>
                    </div>
                    {idCheckMessage && <p className="SignUp-message">{idCheckMessage}</p>}
                </div>

                <div className="form-row">
                    <label className="SignUp-label">비밀번호</label>
                    <input
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        name="userPw"
                        value={form.userPw}
                        onChange={handleChange}
                        className="SignUp-input"
                    />
                </div>

                <div className="form-row">
                    <label className="SignUp-label">비밀번호 확인</label>
                    <input
                        type="password"
                        placeholder="비밀번호를 다시 입력해 주세요"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="SignUp-input"
                    />
                    {pwSameCheck && <p className="SignUp-message">비밀번호가 일치하지 않습니다.</p>}
                </div>

                <div className="form-row">
                    <label className="SignUp-label">이름</label>
                    <input
                        type="text"
                        placeholder="이름을 입력해 주세요"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="SignUp-input"
                    />
                </div>

                <div className="form-row">
                    <label className="SignUp-label">주민등록번호</label>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="앞 6자리"
                            name="residentNumber1"
                            value={form.residentNumber1}
                            onChange={handleChange}
                            className="SignUp-input-half"
                        />
                        <span className="hyphen">-</span>
                        <input
                            type="password"
                            placeholder="뒤 7자리"
                            name="residentNumber2"
                            value={form.residentNumber2}
                            onChange={handleChange}
                            className="SignUp-input-half"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <label className="SignUp-label">신분증 인증</label>
                    <button type="button" onClick={ocrMove} className="SignUp-button">신분증 인증하기</button>
                    {ocrCheck && <p className="SignUp-auth-success">신분증 인증 완료</p>}
                </div>

                <div className="form-row">
                    <label className="SignUp-label">이메일</label>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="이메일을 입력하세요"
                            name="email1"
                            value={form.email1}
                            onChange={handleChange}
                            className="SignUp-input-half"
                        />
                        <span className="at">@</span>
                        <input
                            type="text"
                            placeholder="도메인"
                            name="email2"
                            value={form.email2}
                            onChange={handleChange}
                            className="SignUp-input-half"
                        />
                        <select value={form.email2} onChange={handleChangeEmail2} className="SignUp-select">
                            <option value="">직접입력</option>
                            <option value="gmail.com">gmail.com</option>
                            <option value="naver.com">naver.com</option>
                            <option value="daum.net">daum.net</option>
                            <option value="nate.com">nate.com</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <label className="SignUp-label">핸드폰 번호</label>
                    <div className="input-group">
                        <input
                            type="tel"
                            placeholder="핸드폰 번호를 입력해 주세요"
                            name="hp"
                            value={form.hp}
                            onChange={handleChange}
                            className="SignUp-input"
                        />
                        <button type="button" onClick={hpCheck} className="SignUp-button">인증번호 받기</button>
                    </div>
                </div>

                {startCheckHp && (
                    <div className="form-row">
                        <label className="SignUp-label">인증번호</label>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="인증번호를 입력하세요"
                                name="hpAuthkey"
                                value={form.hpAuthkey}
                                onChange={handleChange}
                                className="SignUp-input"
                            />
                            <button type="button" onClick={authingKey} className="SignUp-button">인증번호 확인</button>
                        </div>
                        {stateAuth && <p className="SignUp-auth-success">인증 성공</p>}
                    </div>
                )}

                <div className="form-row">
                    <label className="SignUp-label">생년월일</label>
                    <input
                        type="date"
                        name="birth"
                        value={form.birth}
                        onChange={handleChange}
                        className="SignUp-input"
                    />
                </div>

                <div className="form-row">
                    <label className="SignUp-label">주소</label>
                    <div className="input-group">
                        <input
                            type="text"
                            name="address1"
                            value={form.address1}
                            className="SignUp-input"
                        />
                        <button type="button" onClick={openPopup} className="SignUp-button">검색</button>
                    </div>
                </div>

                {plusAddress && (
                    <div className="form-row">
                        <label className="SignUp-label">추가 주소</label>
                        <input
                            type="text"
                            name="address2"
                            value={form.address2}
                            onChange={handleChange}
                            placeholder="추가 주소를 입력하세요"
                            className="SignUp-input"
                        />
                    </div>
                )}

                <button type="submit" className="SignUp-submit-button">가입완료</button>
            </form>
        </div>
    );
}

export default SignUp;
