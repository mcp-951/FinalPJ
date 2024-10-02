import React, { useState } from 'react';
import '../../../resource/css/SignUp.css';
import apiSer from '../../ApiService';
import {useNavigate} from 'react-router-dom';

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
    });
    const [idCheckMessage, setIdCheckMessage] = useState('');

    const [startCheckHp, setStartCheckHp] = useState(false);
    const navigate = useNavigate();

    let hpAuthkey = '';

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm({ ...form, [name]: value });
    };

    const startCheckHpHandler = () => {
        setStartCheckHp(true);
    };

  const handleSubmit = (e) => {
    if({...form} == null) {
        alert("값을 입력하세요")
        }else {
            console.log({...form})
            apiSer.signUp({...form});
            navigate("/login");
            }
  };
  const idCheck = () => {
      const userId = form.userId;
      if(userId == "") {
          setIdCheckMessage('아이디를 입력하세요');
      }else{
          console.log("userId :" + userId)
          handleCheckId(userId);
      }
  }

  const hpCheck = () => {
      const hp = form.hp;
      if(hp.length < 10 || hp.length >11) {
          setIdCheckMessage('올바른 휴대폰 번호를 입력하세요');
      }else{
          console.log("hp :" + hp)
          handleCheckHp(hp);
      }
  }

  const handleCheckId = (userId) => {
    apiSer.checkId(userId)
        .then((response) => {
            console.log(response.data);  // 서버에서 받은 데이터
            if(response.data == '') {
              setIdCheckMessage(userId + '는(은) 사용가능한 아이디입니다.');
            }else{
              setIdCheckMessage(userId + '는(은) 이미 존재하는 아이디입니다.');
            }
        })
        .catch((error) => {
            console.error("Error checking ID: ", error);
        });
    };
    const handleCheckHp = (hp) => {
    apiSer.checkHp(hp)
        .then((response) => {
            console.log(response.data);  // 서버에서 받은 데이터
            hpAuthkey = response.data;
        })
        .catch((error) => {
            console.error("Error checking Hp: ", error);
        });
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
            required
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
            required
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
            required
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
          <select>
            <option value="">직접입력</option>
            <option value="gmail.com">gmail.com</option>
            <option value="naver.com">naver.com</option>
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
          <button type="button" onClick = {hpCheck}>인증번호받기</button>
        </div>

        <div className="form-group">
{/*             {!startCheckHp && ( */}
{/*                 <></> */}
{/*             )} */}
{/*             {startCheckHp && ( */}
{/*                 <input */}
{/*                     type="text" */}
{/*                     name="hpAuthkey" */}
{/*                     value={form.hpAuthkey} */}
{/*                     onChange={handleChange} */}
{/*                     required */}
{/*                 /> */}
{/*                 <button type="button">인증</button> */}
{/*             )} */}
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
            value={form.address}
            onChange={handleChange}
            required
          />
          <button type="button">검색</button>
        </div>

        <button type="submit">가입완료</button>
      </div>
    </form>
  );
}

export default SignUp;