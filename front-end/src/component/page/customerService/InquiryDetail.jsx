import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../../ApiService';  // ApiService import
import '../../../resource/css/customerService/InquiryDetail.css';

function InquiryDetail() {
  const { id } = useParams(); // URL에서 id 가져옴
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState(null);  // 문의글 상태값
  const [loading, setLoading] = useState(true);  // 로딩 상태
  const [error, setError] = useState(null);      // 오류 상태

  // 문의글 데이터 불러오기
  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        setLoading(true); // 로딩 상태로 설정
        const response = await ApiService.getInquiryById(id);  // API 호출
        setInquiry(response.data);  // 응답 데이터를 상태로 설정
        setLoading(false);
      } catch (err) {
        setError('문의글을 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchInquiry();
  }, [id]);  // id가 변경될 때마다 실행

  // 오류 발생 시 오류 메시지 표시
  if (error) {
    return <p>{error}</p>;
  }

  // 로딩 중일 때 로딩 메시지 표시
  if (loading) {
    return <p>로딩 중...</p>;
  }

  // 문의글이 없는 경우 처리
  if (!inquiry) {
    return <p>문의글을 찾을 수 없습니다.</p>;
  }

  return (
    <div className="inquiry-detail">
      <h1>문의글 상세보기</h1>
      <div>
        <label>제목 :</label>
        <p>{inquiry.qnaTitle}</p>  {/* 문의 제목 */}
      </div>
      <div>
        <label>문의 내용 :</label>
        <p>{inquiry.message}</p>  {/* 문의 내용 */}
      </div>
      <div>
        <label>문의 답변 :</label>
        <p>{inquiry.answer ? inquiry.answer : "답변이 아직 등록되지 않았습니다."}</p> {/* 답변 내용 */}
      </div>
      <button onClick={() => navigate('/customer-service')}>뒤로가기</button>
    </div>
  );
}

export default InquiryDetail;
