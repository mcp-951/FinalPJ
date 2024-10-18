import React, { useEffect , useState } from 'react';
import '../../../resource/css/SignUp.css';
import apiSer from '../../ApiService';
import {useNavigate, useLocation} from 'react-router-dom';
import getAddress from './GetAddress'

function SignUpForKakao() {
    const location = useLocation();
    const navigate = useNavigate();
    const { kakaoId } = location.state || {}; // state에서 kakaoId 가져오기
    const [form, setForm] = useState({
        userId: '',
        userPw: '',
        name: '',
        email: '',
        email1: '',
        email2: '',
        hp: '',
        birth: '',
        residentNumber1 : '',
        residentNumber2 : '',
        hpAuthkey:'',
        ocrFile: null,
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

    // 카카오 아이디를 form에 설정
    useEffect(() => {
        if (kakaoId) {
            setForm((prevForm) => ({
                ...prevForm,
                userId: kakaoId,
                userPw: kakaoId
            }));
        }
    }, [kakaoId]);
    // 입력창 실시간 업데이트
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm({ ...form, [name]: value });
    };

    const startCheckHpHandler = () => {
        setStartCheckHp(true);
    };

    const settingStateAuth = () => {
        setStateAuth(true);
    };


    //이메일 셀렉트 박스 자동 입력
    const handleChangeEmail2 = (e) => {
      const selectedEmail = e.target.value;
      setForm({ ...form, email2: selectedEmail });
    };

    // 주민등록번호 앞자리 체크
    const checkResNo1 = () => {
        if (form.residentNumber1.length !== 6 && form.residentNumber1.length !== 0) {
            setResNoError1('주민등록번호 앞자리는 6자리여야 합니다.');
    } else {
            setResNoError1('');
    }
};

// 주민등록번호 뒷자리 체크
    const checkResNo2 = () => {
        if (form.residentNumber2.length !== 7 && form.residentNumber2.length !== 0) {
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

    // 휴대폰
    const hpCheck = () => {
        const hp = form.hp;
        if(hp.length < 10 || hp.length >11) {
            setIdCheckMessage('올바른 휴대폰 번호를 입력하세요');
        }else{
            console.log("hp :" + hp)
            handleCheckHp(hp);
            startCheckHpHandler();
        }
    };
    const authingKey = () => {
        const getHpAuthKey = String(hpAuthKey).trim()
        const getFormHpAuthKey = String(form.hpAuthkey).trim()
        console.log("hpAuthKey : " + hpAuthKey +", form.hpAuthkey :"+ form.hpAuthkey)
        if(getHpAuthKey === getFormHpAuthKey) {
            settingStateAuth(true);
            setAuthHp(true);
            }else{
                alert("인증번호가 맞지 않습니다.")
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

    // 주소
    const openPopup = link => {
        // 팝업 window의 크기 지정
        const width = 500;
        const height = 400;

        // 팝업을 부모 브라우저의 정 중앙에 나열
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const windowFeatures = `width=${width},height=${height},left=${left},top=${top}`;

        // 팝업을 열고 window 속성 지정
        const popup = window.open("/getAddress", 'getAddress', windowFeatures);
    };
    useEffect(() => {
        const receiveMessage = (event) => {
            if (event.origin !== window.location.origin) return; // 보안 상 다른 도메인에서 온 메시지 무시
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

    // 회원가입 완료
    const handleSubmit = (e) => {
        if(idCheckState === '' || idCheckState === false){
            setIdCheckMessage('중복확인 해주세요.');
            }else if(form.userPw === null || form.userPw === '' || form.userPw !== form.confirmPassword){
                alert("비밀번호 확인 바랍니다.")
                }else if(authHp === 'false' || authHp === ''){
                    alert("휴대폰 인증이 되지 않았습니다.")
                    }else {
                        console.log(form.address)
                        console.log({...form})
                        apiSer.signUp({...form});
                        navigate("/login");
                    }
    };

    return (
    <form className="sign-up-form" onSubmit={handleSubmit}>
      <div className="logo">
        <img src="logo.png" alt="URAM Logo" />
      </div>

      <div className="form-container">
        <div className="form-group">
          <label>아이디</label>
          <input
            type="text"
            name="userId"
            value={form.userId}
            placeholder="6-20자 영문, 숫자"
            readOnly
          />
        </div>

        <div className="form-group">
          <label>비밀번호</label>
          <input
            type="password"
            name="userPw"
            value={form.userPw}
            placeholder="8-12자 영문, 숫자, 특수문자"
            readOnly
          />
        </div>

        <div className="form-group">
          <label>이름</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>주민등록번호</label>
          <input
            type="text"
            name="residentNumber1"
            value={form.residentNumber1}
            onChange={handleChange}
            required
          />
          {resNoError1 && <p style={{ color: 'red' }}>{resNoError1}</p>}
          -
          <input
            type="password"
            name="residentNumber2"
            value={form.residentNumber2}
            onChange={handleChange}
            required
          />
          {resNoError2 && <p style={{ color: 'red' }}>{resNoError2}</p>}
        </div>

        <div className="form-group">
          <label>휴대폰</label>
          <input
            type="tel"
            name="hp"
            value={form.hp}
            onChange={handleChange}
            placeholder="010 1234 5678"
            required
          />
          <button type="button" onClick = {hpCheck} className='signUp-button' >인증번호받기</button>
        </div>

        <div className="form-group">
            {startCheckHp && (<>
                <input
                    type="text"
                    name="hpAuthkey"
                    value={form.hpAuthkey}
                    onChange={handleChange}
                    required
                />
                {stateAuth &&(<>
                    <p> 인증 성공 </p>
                    </>)}
                <button type="button" onClick={authingKey} className='signUp-button'>인증</button>
                </>
            )}
        </div>

        <div className="form-group">
          <label>생년월일</label>
          <input
            type="date"
            name="birth"
            value={form.birth}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>OCR 등록</label>
          <input
            type="text"
            name="ocrFile"
            onChange={handleChange}
            required
          />
          <button className='signUp-button'>등록</button>
        </div>

        <div className="form-group">
          <label>주소</label>
          <input
            type="text"
            name="address"
            value={form.address1}
            required
          />
          {plusAddress && (<>
                <input
                    type="text"
                    name="address2"
                    value={form.address2}
                    onChange={handleChange}
                    placeholder="추가주소를 입력해주세요."
                />
                </>
            )}
          <button type="button" onClick={openPopup} className='signUp-button'>검색</button>
        </div>

        <button type="submit" className='signUp-button'>가입완료</button>
      </div>
    </form>
    );
}

export default SignUpForKakao;