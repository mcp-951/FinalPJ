import React, { useEffect , useState } from 'react';

import apiSer from 'component/ApiService';
import {useNavigate, useLocation} from 'react-router-dom';
import getAddress from './GetAddress'

function SignUpForKakao() {
    const location = useLocation();
    const navigate = useNavigate();
    const { kakaoId } = location.state || {};
    const [form, setForm] = useState({
        userId: '',
        userPw: '',
        name: '',
        hp: '',
        birth: '',
        residentNumber1 : '',
        residentNumber2 : '',
        hpAuthkey:'',
        ocrFile: '',
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
    const [ocrCheck, setOcrCheck] = useState(false);
    const [ocrName, setOcrName] =useState('');
    const [ocrLocalNo, setOcrLocalNo] = useState('');

    useEffect(() => {
        if (kakaoId) {
            setForm((prevForm) => ({
                ...prevForm,
                userId: kakaoId,
                userPw: kakaoId
            }));
        }
    }, [kakaoId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...form, [name]: value }));
    };

    const startCheckHpHandler = () => {
        setStartCheckHp(true);
    };

    const settingStateAuth = () => {
        setStateAuth(true);
    };

    const checkResNo1 = () => {
        if (form.residentNumber1 && form.residentNumber1.length !== 6) {
            setResNoError1('주민등록번호 앞자리는 6자리여야 합니다.');
        } else {
            setResNoError1('');
        }
    };

    const checkResNo2 = () => {
        if (form.residentNumber2 && form.residentNumber2.length !== 7) {
            setResNoError2('주민등록번호 뒷자리는 7자리여야 합니다.');
        } else {
            setResNoError2('');
        }
    };

    useEffect(() => {
        if(form.residentNumber1 !== null){
            checkResNo1();
        }
        if(form.residentNumber2 !== null){
            checkResNo2();
        }
    },[form.residentNumber1, form.residentNumber2]);

    const hpCheck = () => {
        const hp = form.hp;
        if(hp.length < 10 || hp.length >11) {
            setIdCheckMessage('올바른 휴대폰 번호를 입력하세요');
        }else{
            handleCheckHp(hp);
            startCheckHpHandler();
        }
    };

    const authingKey = () => {
        const getHpAuthKey = String(hpAuthKey).trim();
        const getFormHpAuthKey = String(form.hpAuthkey).trim();
        if(getHpAuthKey === getFormHpAuthKey) {
            settingStateAuth(true);
            setAuthHp(true);
        }else{
            alert("인증번호가 맞지 않습니다.");
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

    const openPopup = link => {
        const width = 500;
        const height = 400;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const windowFeatures = `width=${width},height=${height},left=${left},top=${top}`;
        window.open("/getAddress", 'getAddress', windowFeatures);
    };

    useEffect(() => {
        const receiveMessage = (event) => {
            if (event.origin !== window.location.origin) return;
            if (event.data.address) {
                setForm((prevForm) => ({ ...prevForm, address1: event.data.address }));
                getPlusAddress();
            }
        };
        window.addEventListener('message', receiveMessage);
        return () => {
            window.removeEventListener('message', receiveMessage);
        };
    }, []);

    const getPlusAddress = () => {
        setPlusAddress(true);
    }

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
                        setForm({ocrCheck : "1"});
                    }
                }
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!authHp) {
            alert("휴대폰 인증이 되지 않았습니다.");
        } else {
            apiSer.signUp({ ...form })
            .then((response) => {
                navigate("/login");
            })
            .catch((error) => {
                console.error('회원가입 중 오류 발생:', error);
            });
        }
    };

    return (
        <div className="signUp-container">
            <form className="signUp-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <label>아이디</label>
                    <input
                        type="text"
                        name="userId"
                        value={form.userId}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-row">
                    <label>비밀번호</label>
                    <input
                        type="password"
                        name="userPw"
                        value={form.userPw}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-row">
                    <label>이름</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-row">
                    <label>주민등록번호</label>
                    <input
                        type="text"
                        name="residentNumber1"
                        value={form.residentNumber1}
                        onChange={handleChange}
                        maxLength={6}
                    />
                    <span>-</span>
                    <input
                        type="password"
                        name="residentNumber2"
                        value={form.residentNumber2}
                        onChange={handleChange}
                        maxLength={7}
                    />
                </div>
                <div className="form-row">
                    <label>휴대폰 번호</label>
                    <input
                        type="tel"
                        name="hp"
                        value={form.hp}
                        onChange={handleChange}
                        placeholder="핸드폰 번호를 - 없이 입력하세요."
                    />
                    <button type="button" onClick={hpCheck}>인증번호 받기</button>
                </div>
                {startCheckHp && (
                    <div className="form-row">
                        <label>인증번호</label>
                        <input
                            type="text"
                            name="hpAuthkey"
                            value={form.hpAuthkey}
                            onChange={handleChange}
                        />
                        <button type="button" onClick={authingKey}>인증번호 확인</button>
                    </div>
                )}
                <div className="form-row">
                    <label>생년월일</label>
                    <input
                        type="date"
                        name="birth"
                        value={form.birth}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-row">
                    <label>신분증 인증</label>
                    {!ocrCheck ? (<p>인증이 완료되지 않았습니다.</p>) : (<p>인증이 완료되었습니다.</p>)}
                    <button type="button" onClick={ocrMove}>인증하기</button>
                </div>
                <div className="form-row">
                    <label>주소</label>
                    <input
                        type="text"
                        name="address1"
                        value={form.address1}
                        onChange={handleChange}
                    />
                    <button type="button" onClick={openPopup}>주소 검색</button>
                </div>
                {plusAddress && (
                    <div className="form-row">
                        <label>추가 주소</label>
                        <input
                            type="text"
                            name="address2"
                            value={form.address2}
                            onChange={handleChange}
                            placeholder="추가 주소를 입력하세요."
                        />
                    </div>
                )}
                <button type="submit">가입 완료</button>
            </form>
        </div>
    );
}

export default SignUpForKakao;
