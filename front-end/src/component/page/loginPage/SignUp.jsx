import React, { useEffect , useState } from 'react';
import '../../../resource/css/SignUp.css';
import apiSer from '../../ApiService';
import {useNavigate} from 'react-router-dom';
import getAddress from './GetAddress'

function SignUp() {
    const [form, setForm] = useState({
        userId: '',
        userPw: '',
        confirmPassword: '',
        name: '',
        email: '',
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
    const navigate = useNavigate();
    const [hpAuthKey, setHpAuthKey] = useState('');
    const [authHp, setAuthHp] = useState('');
    // 정규식
    const reg_id = /^(?=.*?[a-zA-Z0-9]).{6,16}$/;   //아이디 판별을 위한 정규식 영문자숫자만 입력 가능 6~16 자
    const reg_password = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,20}$/;	//비밀번호 판별을 위한 정규식 문자(소문자, 대문자)+숫자로 구성된 8~20 자

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

    //아이디
    const idCheck = () => {
        const userId = form.userId;
        if(userId === "") {
            setIdCheckMessage('아이디를 입력하세요');
        }else{
          console.log("userId :" + userId)
          handleCheckId(userId);
        }
    }
    const handleCheckId = (userId) => {
    apiSer.checkId(userId)
        .then((response) => {
            console.log(response.data);  // 서버에서 받은 데이터
            if(response.data === '') {
              setIdCheckMessage(userId + '는(은) 사용가능한 아이디입니다.');
              setIdCheckState(true);
            }else{
              setIdCheckMessage(userId + '는(은) 이미 존재하는 아이디입니다.');
              setIdCheckState(false);
            }
        })
        .catch((error) => {
            console.error("Error checking ID: ", error);
        });
    };

    // 비밀번호
    useEffect(() => {
        checkingPw();
    }, [form.userPw, form.confirmPassword]);

    const checkingPw = () => {
        if(form.userPw != null && form.confirmPassword != null) {
            if(form.userPw === form.confirmPassword){
                setPwSameCheck(false);
            }else{
                setPwSameCheck(true);
            }
        }
    };

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
    if({...form} === null) {
        alert("값을 입력하세요")
        }else if(idCheckState === '' || idCheckState === false){
            setIdCheckMessage('중복확인 해주세요.');
            }else if(form.userPw === null || form.userPw === '' || form.userPw !== form.confirmPassword){
                alert("비밀번호 확인 바랍니다.")
                }else if(authHp === 'false' || authHp === ''){
                    alert("휴대폰 인증이 되지 않았습니다.")
                    }else {
                        const fullAddress = form.address1 + form.address2;
                        setForm({...form, address: fullAddress})
                        //form.address == form.address1 + form.address2;
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
            onChange={handleChange}
            placeholder="6-20자 영문, 숫자"
          />
          <button type="button" onClick = {idCheck}>중복체크</button>
          <p name= "checkingId" value = "0">{idCheckMessage}</p>
        </div>

        <div className="form-group">
          <label>비밀번호</label>
          <input
            type="password"
            name="userPw"
            value={form.userPw}
            onChange={handleChange}
            placeholder="8-12자 영문, 숫자, 특수문자"
          />
        </div>

        <div className="form-group">
          <label>비밀번호 확인</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="8-12자 영문, 숫자, 특수문자"
          />
        </div>
        <div className="form-group">
            {pwSameCheck && (<>
               <p>비밀번호가 일치하지 않습니다.</p>
            </>)}
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
          -
          <input
            type="password"
            name="residentNumber2"
            value={form.residentNumber2}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>이메일</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          @
          <select>
            <option value="">직접입력</option>
            <option value="gmail.com">gmail.com</option>
            <option value="naver.com">naver.com</option>
            <option value="daum.co.kr">daum..co.kr</option>
            <option value="nate.com">nate.com</option>
          </select>
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
          <button type="button" onClick = {hpCheck} >인증번호받기</button>
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
                <button type="button" onClick={authingKey}>인증</button>
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
          <button>등록</button>
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
          <button type="button" onClick={openPopup}>검색</button>
        </div>


        <button type="submit">가입완료</button>
      </div>
    </form>
    );
}

export default SignUp;