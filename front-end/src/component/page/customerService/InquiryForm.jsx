import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../../ApiService';  // ApiService import
import '../../../resource/css/customerService/InquiryForm.css';

function InquiryForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    qnaTitle: '',   // 제목 필드를 qnaTitle로 변경
    message: '',    // 내용 필드를 message로 변경
    file: null,
  });

  // 입력 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  // 파일 첨부 핸들러
  const handleFileChange = (e) => {
    setForm({
      ...form,
      file: e.target.files[0],
    });
  };

  // 폼 전송 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 제목과 내용이 없는 경우 경고
    if (form.qnaTitle === '' || form.message === '') {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      // FormData 객체 생성 (파일 업로드가 있는 경우)
      const formData = new FormData();
      formData.append('userNo', 1);  // 사용자 번호를 하드코딩 (로그인 구현 시 변경 필요)
      formData.append('qnaTitle', form.qnaTitle);
      formData.append('message', form.message);
      formData.append('status', '답변전');  // 초기 상태는 '답변전'으로 설정
      if (form.file) {
        formData.append('file', form.file); // 파일이 있는 경우 파일 추가
      }

      // 백엔드로 POST 요청 (FormData 전송)
      const response = await ApiService.createInquiryWithFile(formData);

      // 문의글이 성공적으로 등록된 경우
      if (response.status === 201) {
        alert('문의가 성공적으로 등록되었습니다!');
        navigate('/customer-service'); // 문의글 등록 후 고객센터 메인 페이지로 이동
      }
    } catch (error) {
      console.error('문의글 등록 중 오류가 발생했습니다.', error);
      alert('문의글 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <form className="inquiry-form" onSubmit={handleSubmit}>
      <h1>Q&A (1:1 문의)</h1>
      <div>
        <label>제목 :</label>
        <input
          type="text"
          name="qnaTitle"
          value={form.qnaTitle}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>문의 내용 :</label>
        <textarea
          name="message"
          value={form.message}
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
