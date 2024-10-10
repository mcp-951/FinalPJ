import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';  // ApiService 추가
import localStorage from 'localStorage';

const MemberEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { memberData } = location.state;
  const token = localStorage.getItem("token");

  // formData 초기값 설정
  const [formData, setFormData] = useState({
    userId: memberData.userId,
    userPw: memberData.userPw || '',  // userPw 필드 추가 (기본값 설정)
    name: memberData.name,
    email: memberData.email,
    hp: memberData.hp,
    address: memberData.address,
    birth: memberData.birth ? memberData.birth.split('T')[0] : '',  
    residentNumber: memberData.residentNumber,
    OCRcheck: memberData.OCRcheck || 'N',  
    state: memberData.state
  });

  // input 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 수정 제출
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('수정할 데이터:', formData);  // 수정할 데이터 확인용

    // 백엔드로 PUT 요청 전송
    axios.put(`http://localhost:8081/admin/updateUser/${memberData.userNo}`, formData,{
      headers: {
        'Authorization': `Bearer ${token}`  // Authorization 헤더에 JWT 추가
      }
    })
      .then(() => {
        console.log('회원 정보 수정 성공');
        navigate('/memberList');  // 수정 후 회원 리스트로 돌아감
      })
      .catch((error) => {
        console.error('회원 정보 수정 중 오류 발생:', error);
      });
  };

  return (
    <div>
      <h2>회원 수정</h2>
      <form onSubmit={handleSubmit}>
        <label>아이디</label>
        <input type="text" value={formData.userId} disabled />

        <label>비밀번호</label> {/* 비밀번호 입력 필드 추가 */}
        <input type="password" name="userPw" value={formData.userPw} onChange={handleInputChange} />

        <label>이름</label>
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} />

        <label>이메일</label>
        <input type="email" name="email" value={formData.email} onChange={handleInputChange} />

        <label>핸드폰</label>
        <input type="text" name="hp" value={formData.hp} onChange={handleInputChange} />

        <label>주소</label>
        <input type="text" name="address" value={formData.address} onChange={handleInputChange} />

        <label>생년월일</label>
        <input type="date" name="birth" value={formData.birth} onChange={handleInputChange} />

        <label>주민번호</label>
        <input type="text" name="residentNumber" value={formData.residentNumber} onChange={handleInputChange} />

        <label>신분증 확인</label>
        <select name="OCRcheck" value={formData.OCRcheck} onChange={handleInputChange}>
          <option value="Y">확인 완료</option>
          <option value="N">미확인</option>
        </select>

        <label>상태</label>
        <select name="state" value={formData.state} onChange={handleInputChange}>
          <option value="NORMAL">정상</option>
          <option value="탈퇴">탈퇴</option>
        </select>

        <button type="submit">수정 완료</button>
        <button type="button" onClick={() => navigate('/memberList')}>취소</button>
      </form>
    </div>
  );
};

export default MemberEdit;
