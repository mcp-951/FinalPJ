import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../resource/css/customerService/CustomerServiceMain.css';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

function CustomerServiceMain() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userNo = localStorage.getItem('userNo');
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const decoding = jwtDecode(token); // JWT 토큰에서 사용자 정보 디코딩
        const response = await axios.get(
          `http://localhost:8081/support/board/${userNo}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('API 응답 데이터:', response.data); // 응답 확인
        setData(response.data); // 삭제되지 않은 글만 저장
      } catch (error) {
        console.error('문의글 목록을 불러오는 중 오류가 발생했습니다:', error);
      }
    };

    if (token) {
      fetchInquiries();
    } else {
      alert('로그인이 필요합니다.');
      navigate('/');
    }
  }, [token, navigate]);

  const handleRowClick = (qnaNo) => {
    navigate(`/inquiry/${qnaNo}`); // 문의글 상세 페이지로 이동
  };

  const handleNewInquiryClick = () => {
    navigate('/inquiry-form'); // 1:1 문의하기 페이지로 이동
  };

  return (
    <div className="customer-service-main">
      <h1>Q&A</h1>
      <table className="inquiry-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>문의 날짜</th>
            <th>진행상황</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.qnaNo} onClick={() => handleRowClick(item.qnaNo)}>
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

      <div className="inquiry-button-container">
        <button className="inquiry-button" onClick={handleNewInquiryClick}>
          1:1 문의하기
        </button>
      </div>

      {/* 고객 상담 정보 섹션 */}
      <div className="customer-service-info">
        <div className="info-section">
          <h2>고객상담전화</h2>
          <ul>
            <li>국내 1644-9999, 1599-9999</li>
            <li>해외 +82-2-6300-9999</li>
            <li>상담전용 1800-9999 (분실 및 사고신고 제외)</li>
            <li>전자금융사고예방 1577-9999</li>
            <li>외국인전용 1599-4477 (Foreigner)</li>
            <li>어르신전용 1644-3308</li>
            <li>수화상담 070-7451-9901</li>
            <li>대출 단기연체 및 만기안내</li>
            <li>국내 1588-9008, 1566-9008</li>
            <li>해외 +82-2-3702-1240</li>
            <li>투자상품 승낙확인</li>
            <li>국내 1833-3938</li>
          </ul>
        </div>
        <div className="info-section">
          <h2>상담시간안내</h2>
          <ul>
            <li>예금/대출/인터넷/스타뱅킹 상담 24시간</li>
            <li>사고신고/자동화기기 24시간</li>
            <li>전자금융사고예방 24시간</li>
            <li>챗봇/채팅상담 24시간</li>
            <li>어르신전용/수화상담 평일 09:00~18:00</li>
          </ul>
        </div>
        <div className="info-section">
          <h2>콜백서비스 안내</h2>
          <ul>
            <li>대상업무: 야간/휴일/외국어 상담</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CustomerServiceMain;
