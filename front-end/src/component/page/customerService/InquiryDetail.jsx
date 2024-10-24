import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../../resource/css/customerService/InquiryDetail.css';
import axios from 'axios';

function InquiryDetail() {
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
          `http://13.125.114.85:8081/support/detail/${id}`,
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
        await axios.delete(`http://13.125.114.85:8081/support/${id}`, {
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
        `http://13.125.114.85:8081/support/${id}`,
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
  }

  return (
    <div className="inquiry-detail">
      <h1>문의글 상세보기</h1>

      <div>
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
      </div>

      <div>
        <label>내용:</label>
        {isEditing ? (
          <textarea
            value={editedMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
          />
        ) : (
          <p>{inquiry.message}</p>
        )}
      </div>

      <div>
        <label>답변:</label>
        <p>{inquiry.answer || '답변이 아직 등록되지 않았습니다.'}</p>
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
