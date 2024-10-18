import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function MyPageChangePw() {
  const navigate = useNavigate();
    const [form, setForm] = useState({
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
                            type="text"
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
                            type="text"
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
                            type="text"
                            name="confirmNewUserPw"
                            value={form.confirmNewUserPw}
                            onChange={handleChange}
                        />
                    </td>
                </tr>
                </tbody>
            </table>
            <div>
                <button>변경</button>
                <button onClick={backToMyPage}>취소</button>
            </div>
        </div>
        );
    }

export default MyPageChangePw;