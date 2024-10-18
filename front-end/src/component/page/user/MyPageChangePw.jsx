import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiSer from '../../ApiService';
import localStorage from 'localStorage';

function MyPageChangePw() {
    const userNo = localStorage.getItem("userNo")
    const navigate = useNavigate();
    const [form, setForm] = useState({
        userNo : userNo,
        userPw:'',
        newUserPw:'',
        confirmNewUserPw:''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const backToMyPage = () =>{
        navigate("/mypage");
    }

    const submitNewPw = () => {
        const response = apiSer.changePassword(form)
        .then((response) => {
            console.log(response.data)
            if(response.data === 'ok'){
                alert("비밀번호가 변경되었습니다.")
                navigate("/mypage");
                }else{
                    alert("기존 비밀번호가 일치하지 않습니다.")
                    return;
                    }
        }).catch((error) => {
            console.error("Error checking Hp: ", error);
        });
        }

    return(
        <div className="pwChangeForm">
            <table>
                <thead>
                    <tr>
                        <td colSpan ="2">비밀번호 변경</td>
                    </tr>
                </thead>
                <tbody>
                <tr>
                    <td>기존 비밀번호 확인</td>
                    <td>
                        <input
                            type="password"
                            name="userPw"
                            value={form.userPw}
                            onChange={handleChange}
                        />
                    </td>
                </tr>
                <tr>
                    <td>새 비밀번호</td>
                    <td>
                        <input
                            type="password"
                            name="newUserPw"
                            value={form.newUserPw}
                            onChange={handleChange}
                        />
                    </td>
                </tr>
                <tr>
                    <td>새 비밀번호 확인</td>
                    <td>
                        <input
                            type="password"
                            name="confirmNewUserPw"
                            value={form.confirmNewUserPw}
                            onChange={handleChange}
                        />
                    </td>
                </tr>
                </tbody>
            </table>
            <div>
                <button onClick={submitNewPw}>변경</button>
                <button onClick={backToMyPage}>취소</button>
            </div>
        </div>
        );
    }

export default MyPageChangePw;