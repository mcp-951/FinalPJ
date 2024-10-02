import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const MemberEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { memberData } = location.state;

  const [formData, setFormData] = useState({
    username: memberData.username,
    name: memberData.name,
    email: memberData.email,
    phone: memberData.phone,
    address: memberData.address,
    birthDate: memberData.birthDate,
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
    // 수정된 데이터를 MemberList로 전달
    navigate('/memberList', { state: { updatedMember: formData } });
  };

  return (
    <div>
      <h2>회원 수정</h2>
      <form onSubmit={handleSubmit}>
        <label>아이디</label>
        <input type="text" value={formData.username} disabled />
        <label>이름</label>
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
        <label>이메일</label>
        <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
        <label>핸드폰</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
        <label>주소</label>
        <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
        <label>생년월일</label>
        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} />
        <button type="submit">수정 완료</button>
        <button type="button" onClick={() => navigate('/memberList')}>취소</button>
      </form>
    </div>
  );
};

export default MemberEdit;
