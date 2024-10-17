import React, { useState, useEffect } from 'react';
import ApiSer from 'component/ApiService'
import localStorage from 'localStorage';

function MyPage() {
    const userNo = localStorage.getItem("userNo");
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
        const response = ApiSer.getUserInfo(userNo)
            .then((response) =>{
                console.log(response.data);
                let gend = response.data.residentNumber;
                console.log(gend[7]);
                let data;
                    if (String(gend[7]) === '1') {
                        data = {
                            id: response.data.userId,
                            name: response.data.name,
                            hp: response.data.hp,
                            email: response.data.email,
                            birth: response.data.birth,
                            gender: '남',
                        };
                    } else {
                        data = {
                            id: response.data.userId,
                            name: response.data.name,
                            hp: response.data.hp,
                            email: response.data.email,
                            birth: response.data.birth,
                            gender: '여',
                        };
                    }
                console.log(data);
                setForm(data);

            }).catch((error) => {
                console.error("Error checking ID: ", error);
            });
        }
  useEffect(() =>{
      getUserInfo();
      },[userNo]);

  return (
    <div className="profile-edit">
      <h2>회원정보</h2>
      <div className="basic-info">
        <h3>기본정보</h3>
        <div>
          <label>아이디</label>
          <span>{form.id}</span>
        </div>
        <div>
          <label>이름</label>
          <span>{form.name}</span>
        </div>
        <div>
          <label>휴대폰번호</label>
          <span>{form.hp}</span>
        </div>
        <div>
          <label>이메일</label>
          <span>{form.email}</span>
        </div>
        <div>
          <label>생년월일</label>
          <span>{form.birth}</span>
        </div>
        <div>
          <label>성별</label>
          <span>{form.gender}</span>
        </div>

      </div>

      <div className="modiButton">
        <button>수정</button>
      </div>
    </div>
  );
}

export default MyPage;