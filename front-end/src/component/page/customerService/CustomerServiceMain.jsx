import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../resource/css/customerService/CustomerServiceMain.css';

function CustomerServiceMain({ inquiries }) {
  const navigate = useNavigate();

  // 문의글 상세 페이지로 이동하는 함수
  const handleInquiryClick = (id) => {
    navigate(`/inquiry/${id}`); // 고유한 ID로 이동
  };

  return (
    <div className="customer-service-main">
      <h1>무엇을 도와드릴까요? <span>Q&A</span></h1>
  
      {/* 문의글 리스트 테이블을 위쪽에 배치 */}
      {Array.isArray(inquiries) && inquiries.length === 0 ? (
        <p>문의한 내역이 없습니다.</p>
      ) : (
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
            {inquiries && inquiries.map((inquiry, index) => (
              <tr key={inquiry.id}>
                <td>{index + 1}</td>
                <td>
                  <button
                    onClick={() => handleInquiryClick(inquiry.id)}
                    style={{ background: "none", border: "none", color: "blue", textDecoration: "underline", cursor: "pointer" }}
                  >
                    {inquiry.title}
                  </button>
                </td>
                <td>{inquiry.date}</td>
                <td>{inquiry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className="inquiry-button" onClick={() => navigate('/inquiry-form')}>1:1 문의하기</button>

      {/* 고객 상담 정보 섹션을 아래쪽에 배치 */}
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
