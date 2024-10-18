import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar'; // 사이드바 추가
import '../../../../resource/css/admin/MemberEdit.css';  // CSS 파일 추가

const MemberEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { memberData } = location.state;
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    userId: memberData.userId,
    userPw: memberData.userPw || '',  
    name: memberData.name,
    email: memberData.email,
    hp: memberData.hp,
    address: memberData.address,
    birth: memberData.birth ? memberData.birth.split('T')[0] : '',  
    residentNumber: memberData.residentNumber,
    OCRcheck: memberData.OCRcheck || 'N',  
    state: memberData.state
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.put(`http://localhost:8081/admin/updateUser/${memberData.userNo}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        navigate('/memberList');
      })
      .catch((error) => {
        console.error('회원 정보 수정 중 오류 발생:', error);
      });
  };

  return (
    <div className="app-container">
      <Sidebar /> {/* 사이드바 추가 */}
      <div className="member-edit-main-content">
        <div className="member-edit-container">
          <h2 className="member-edit-title">회원 수정</h2>
          <form className="member-edit-form" onSubmit={handleSubmit}>
            <label className="form-label">아이디</label>
            <input className="form-input" type="text" value={formData.userId} disabled />

            <label className="form-label">비밀번호</label>
            <input className="form-input" type="password" name="userPw" value={formData.userPw} onChange={handleInputChange} />

            <label className="form-label">이름</label>
            <input className="form-input" type="text" name="name" value={formData.name} onChange={handleInputChange} />

            <label className="form-label">이메일</label>
            <input className="form-input" type="email" name="email" value={formData.email} onChange={handleInputChange} />

            <label className="form-label">핸드폰</label>
            <input className="form-input" type="text" name="hp" value={formData.hp} onChange={handleInputChange} />

            <label className="form-label">주소</label>
            <input className="form-input" type="text" name="address" value={formData.address} onChange={handleInputChange} />

            <label className="form-label">생년월일</label>
            <input className="form-input" type="date" name="birth" value={formData.birth} onChange={handleInputChange} />

            <label className="form-label">주민번호</label>
            <input className="form-input" type="text" name="residentNumber" value={formData.residentNumber} onChange={handleInputChange} />

            <label className="form-label">신분증 확인</label>
            <select className="form-select" name="OCRcheck" value={formData.OCRcheck} onChange={handleInputChange}>
              <option value="Y">확인 완료</option>
              <option value="N">미확인</option>
            </select>

            <label className="form-label">상태</label>
            <select className="form-select" name="state" value={formData.state} onChange={handleInputChange}>
              <option value="NORMAL">정상</option>
              <option value="탈퇴">탈퇴</option>
            </select>

            <div className="form-buttons">
              <button className="submit-btn" type="submit">수정 완료</button>
              <button className="cancel-btn" type="button" onClick={() => navigate('/memberList')}>취소</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MemberEdit;
