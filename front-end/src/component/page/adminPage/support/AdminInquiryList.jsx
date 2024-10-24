import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar'; // Sidebar 추가
import '../../../../resource/css/admin/AdminInquiryList.css'; // CSS 파일 추가

function AdminInquiryList() {
  const [inquiries, setInquiries] = useState([]); // 문의글 목록 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

  // 서버에서 모든 문의글을 가져오는 useEffect
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const token = localStorage.getItem('token'); // 인증 토큰 가져오기
        const response = await axios.get('http://13.125.114.85:8081/admin/support/inquiries', {
          headers: { Authorization: `Bearer ${token}` }, // 인증 헤더 추가
        });
        setInquiries(response.data); // 문의글 목록 상태 저장
      } catch (error) {
        console.error('문의글 목록을 불러오는 중 오류가 발생했습니다:', error);
      }
    };

    fetchInquiries();
  }, []);

  // 문의글 클릭 시 상세 페이지로 이동
  const handleRowClick = (qnaNo) => {
    navigate(`/admin/support/inquiry/${qnaNo}`);
  };

  return (
    <div className="app-container">
      <Sidebar /> {/* 사이드바 추가 */}
      <div className="AdminInquiryList-main-content">
        <h1 className="AdminInquiryList-title">문의글 관리</h1>
        <table className="AdminInquiryList-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성일</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length > 0 ? (
              inquiries.map((item) => (
                <tr key={item.qnaNo} onClick={() => handleRowClick(item.qnaNo)} className="AdminInquiryList-row">
                  <td>{item.qnaNo}</td>
                  <td>{item.qnaTitle}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td>{item.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">문의 내역이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminInquiryList;
