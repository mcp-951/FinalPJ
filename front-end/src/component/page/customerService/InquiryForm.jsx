import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../resource/css/customerService/InquiryForm.css';

function InquiryForm({ addInquiry }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    content: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setForm({
      ...form,
      file: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.title === '' || form.content === '') {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    const newInquiry = {
      id: Date.now(), // 유니크한 id 생성
      title: form.title,
      date: new Date().toISOString().slice(0, 10), // 날짜를 YYYY-MM-DD 형식으로 생성
      status: '처리 중',
    };

    // 문의글 추가
    addInquiry(newInquiry);

    alert('문의가 등록되었습니다!');
    navigate('/customer-service');
  };

  return (
    <form className="inquiry-form" onSubmit={handleSubmit}>
      <h1>Q&A (1:1 문의)</h1>
      <div>
        <label>제목 :</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>문의 내용 :</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          required
        ></textarea>
      </div>
      <div>
        <label>파일 첨부 :</label>
        <input type="file" name="file" onChange={handleFileChange} />
      </div>
      <button type="submit">문의하기</button>
    </form>
  );
}

export default InquiryForm;
