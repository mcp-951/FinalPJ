import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../../resource/css/customerService/InquiryDetail.css';

function InquiryDetail({ inquiries }) {
  const { id } = useParams(); // URL에서 id 가져옴
  const navigate = useNavigate();

  // 선택한 문의글을 찾음
  const inquiry = inquiries.find((inquiry) => inquiry.id === parseInt(id));

  if (!inquiry) {
    return <p>문의글을 찾을 수 없습니다.</p>;
  }

  return (
    <div className="inquiry-detail">
      <h1>문의글 상세보기</h1>
      <div>
        <label>제목 :</label>
        <p>{inquiry.title}</p>
      </div>
      <div>
        <label>문의 내용 :</label>
        <p>{inquiry.content}</p>
      </div>
      <div>
        <label>문의 답변 :</label>
        <p>{inquiry.answer ? inquiry.answer : "답변이 아직 등록되지 않았습니다."}</p>
      </div>
      <button onClick={() => navigate('/customer-service')}>뒤로가기</button>
    </div>
  );
}

export default InquiryDetail;
