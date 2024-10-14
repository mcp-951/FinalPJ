<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import React, { useEffect, useState } from 'react';
>>>>>>> 50b13222d0394431ef705665178103e286840219
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../../ApiService';  // ApiService import
import '../../../resource/css/customerService/InquiryDetail.css';
import axios from 'axios';

function InquiryDetail() {
<<<<<<< HEAD
  const { id } = useParams(); // URL 파라미터로 전달된 ID
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState(null); // 문의글 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(false); // 에러 상태
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
  const [editedTitle, setEditedTitle] = useState(''); // 수정된 제목
  const [editedMessage, setEditedMessage] = useState(''); // 수정된 내용

  useEffect(() => {
    console.log('전달된 ID:', id); // ID 디버깅용 로그

    const fetchInquiry = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:8081/support/detail/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('API 응답 데이터:', response.data); // API 응답 확인
        if (response.data) {
          setInquiry(response.data); // 데이터 상태 저장
          setEditedTitle(response.data.qnaTitle); // 초기 제목 설정
          setEditedMessage(response.data.message); // 초기 내용 설정
        } else {
          console.warn('해당 문의글이 없습니다.');
          setError(true);
        }
      } catch (err) {
        console.error('API 호출 중 오류:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiry();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8081/support/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('문의글이 삭제되었습니다.');
        navigate('/customer-service');
      } catch (err) {
        console.error('문의글 삭제 중 오류 발생:', err);
        alert('문의글 삭제에 실패했습니다.');
      }
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing); // 수정 모드 토글
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8081/support/${id}`,
        { qnaTitle: editedTitle, message: editedMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('문의글이 수정되었습니다.');
      setInquiry({ ...inquiry, qnaTitle: editedTitle, message: editedMessage });
      setIsEditing(false); // 수정 모드 종료
    } catch (err) {
      console.error('문의글 수정 중 오류 발생:', err);
      alert('문의글 수정에 실패했습니다.');
    }
  };

  if (loading) return <p>로딩 중...</p>;

  if (error || !inquiry) {
    return <p>문의글을 찾을 수 없거나 불러오는 중 오류가 발생했습니다.</p>;
=======
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
>>>>>>> 50b13222d0394431ef705665178103e286840219
  }

  return (
    <div className="inquiry-detail">
      <h1>문의글 상세보기</h1>

      <div>
<<<<<<< HEAD
        <label>제목:</label>
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
        ) : (
          <p>{inquiry.qnaTitle}</p>
        )}
=======
        <label>제목 :</label>
        <p>{inquiry.qnaTitle}</p>  {/* 문의 제목 */}
>>>>>>> 50b13222d0394431ef705665178103e286840219
      </div>

      <div>
<<<<<<< HEAD
        <label>내용:</label>
        {isEditing ? (
          <textarea
            value={editedMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
          />
        ) : (
          <p>{inquiry.message}</p>
        )}
=======
        <label>문의 내용 :</label>
        <p>{inquiry.message}</p>  {/* 문의 내용 */}
>>>>>>> 50b13222d0394431ef705665178103e286840219
      </div>

      <div>
<<<<<<< HEAD
        <label>답변:</label>
        <p>{inquiry.answer || '답변이 아직 등록되지 않았습니다.'}</p>
=======
        <label>문의 답변 :</label>
        <p>{inquiry.answer ? inquiry.answer : "답변이 아직 등록되지 않았습니다."}</p> {/* 답변 내용 */}
>>>>>>> 50b13222d0394431ef705665178103e286840219
      </div>

      <div className="button-group">
        {isEditing ? (
          <>
            <button className="save-button" onClick={handleSave}>
              저장하기
            </button>
            <button className="cancel-button" onClick={handleEditToggle}>
              취소하기
            </button>
          </>
        ) : (
          <>
            <button className="edit-button" onClick={handleEditToggle}>
              수정하기
            </button>
            <button className="delete-button" onClick={handleDelete}>
              삭제하기
            </button>
          </>
        )}
      </div>

      <button className="detail-button" onClick={() => navigate('/customer-service')}>
        뒤로가기
      </button>
    </div>
  );
}

export default InquiryDetail;
