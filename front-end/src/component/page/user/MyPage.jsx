import React, { useState, useEffect } from 'react';
import ApiSer from 'component/ApiService';
import localStorage from 'localStorage';
import { useNavigate } from 'react-router-dom';
import '../../../resource/css/user/MyPage.css';  // 경로 수정

function MyPage() {
    const navigate = useNavigate();
    const userNo = localStorage.getItem("userNo");
    const token = localStorage.getItem("token");
    // 상태 관리
    const [form, setForm] = useState({
        id: '',
        name: '',
        hp: '',
        email: '',
        birth: '',
        gender: '',
        grade : ''
    });

    const getUserInfo = () => {
        ApiSer.getUserInfo(userNo,{
        headers: {
          'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
        }
      })
            .then((response) => {
                let gend = response.data.residentNumber;
                let data = {
                    id: response.data.userId,
                    name: response.data.name,
                    hp: response.data.hp,
                    email: response.data.email,
                    birth: response.data.birth,
                    gender: String(gend[7]) === '1' ? '남' : '여',
                    grade: response.data.grade
                };
                setForm(data);
            })
            .catch((error) => {
                console.error("Error fetching user info: ", error);
            });
    };
    useEffect(() => {
        if(userNo === null || userNo === ""){
            alert("잘못된 접근입니다.");
            navigate("/");
            return;
            }

        if(token === null || token === ""){
            alert("잘못된 접근입니다.");
            navigate("/");
            return;
            }
        getUserInfo();
    }, [userNo]);

    const moveChangePw = () => {
        navigate("/myPageChangePw", { state: { userId: form.id } });
    };

    return (
        <div className="MyPage-container">
            <h2 className="MyPage-title">회원정보</h2>
            <div className="MyPage-basic-info">
                <h3>기본정보</h3>
                <div className="MyPage-field">
                    <label>아이디</label>
                    <span>{form.id}</span>
                </div>
                <div className="MyPage-field">
                    <label>이름</label>
                    <span>{form.name}</span>
                </div>
                <div className="MyPage-field">
                    <label>휴대폰번호</label>
                    <span>{form.hp}</span>
                </div>
                <div className="MyPage-field">
                    <label>이메일</label>
                    <span>{form.email}</span>
                </div>
                <div className="MyPage-field">
                    <label>생년월일</label>
                    <span>{form.birth}</span>
                </div>
                <div className="MyPage-field">
                    <label>성별</label>
                    <span>{form.gender}</span>
                </div>
                <div className="MyPage-field">
                    <label>사용자 등급</label>
                    <span>{form.grade}등급</span>
                </div>
            </div>

            <div className="MyPage-modiButton">
                <button onClick={moveChangePw} className="MyPage-btn">비밀번호 변경</button>
            </div>
        </div>
    );
}

export default MyPage;
