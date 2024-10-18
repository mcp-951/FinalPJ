import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminInquiryDetail() {
  const { qnaNo } = useParams(); // URL 파라미터로부터 qnaNo 가져오기
  const [inquiry, setInquiry] = useState(null); // 문의글 데이터
  const [answer, setAnswer] = useState(''); // 답변 내용
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate
  const token = localStorage.getItem('token'); // 토큰 가져오기

  // 문의글을 서버에서 가져오는 useEffect
  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/admin/support/inquiry/${qnaNo}`, {
          headers: {
            Authorization: `Bearer ${token}`, // 토큰 포함
          },
        });
        setInquiry(response.data); // 문의글 데이터 저장

        // 답변 내용이 JSON 객체로 되어 있을 경우 해당 속성만 저장
        setAnswer(response.data.answer ? response.data.answer : ''); 
      } catch (error) {
        console.error('문의글을 불러오는 중 오류가 발생했습니다:', error.response?.data || error.message);
        alert('문의글을 불러오는 중 오류가 발생했습니다. 관리자에게 문의하세요.');
      }
    };

    fetchInquiry();
  }, [qnaNo, token]);

  // 답변 저장 함수
  const handleSaveAnswer = async () => {
    try {
        await axios.put(`http://localhost:8081/admin/support/answer/${qnaNo}`, answer, {
            headers: {
              Authorization: `Bearer ${token}`, // 토큰 포함
              'Content-Type': 'text/plain', // 변수를 문자열로 처리
            },
      });
      alert('답변이 성공적으로 등록되었습니다.');
      navigate('/admin/support/inquiries'); // 답변 저장 후 문의 목록 페이지로 이동
    } catch (error) {
      console.error('답변 등록 중 오류가 발생했습니다:', error.response?.data || error.message);
      alert('답변 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 문의글 로딩 중일 때 표시할 UI
  if (!inquiry) {
    return <p>문의글을 불러오는 중입니다...</p>;
  }

  const saveAnswer = (e) => {
    setAnswer(e.target.value)
  }
  return (
    <div>
      <h1>문의글 상세</h1>
      <div>
        <strong>제목:</strong> {inquiry.qnaTitle}
      </div>
      <div>
        <strong>내용:</strong> {inquiry.message}
      </div>
      <div>
        <strong>답변:</strong>
        <textarea
          value={answer}
          onChange={saveAnswer} // 답변 내용 변경
          rows="5"
          style={{ width: '100%' }} // 답변 창 스타일 조정
        />
      </div>
      <button onClick={handleSaveAnswer} style={{ marginTop: '10px' }}>답변 저장</button> {/* 답변 저장 버튼 */}
    </div>
  );
}

export default AdminInquiryDetail;
