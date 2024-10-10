import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../../ApiService';  // ApiService import
import axios from 'axios';
import '../../../resource/css/customerService/CustomerServiceMain.css';

function CustomerServiceMain() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);  // 문의글 상태 관리
  const [loading, setLoading] = useState(true);    // 로딩 상태 관리
  const [error, setError] = useState(null);        // 오류 상태 관리

  // 전체 문의글 가져오기
  useEffect(() => {
    // 로컬 스토리지에서 JWT 토큰 가져오기
    const token = localStorage.getItem('token');
    if (token == null) {
      alert("로그인해주세요.");
      navigate('/');
      return;
    } else {
      // 비동기 함수로 API 요청 수행
      const fetchInquiries = async () => {
        try {
          // console.log로 토큰 값 확인 (디버깅)
          console.log("토큰 값:", token);
          
          // axios를 사용하여 API 요청
          const response = await axios.get('http://localhost:8081/support/all', {
            headers: {
              'Authorization': `Bearer ${token}`,  // Bearer 토큰 형식으로 헤더에 추가
            }
          });
          
          // 가져온 데이터로 상태 설정
          setInquiries(response.data);
          setLoading(false);  // 로딩 완료
        } catch (err) {
          console.error("문의글을 불러오는 중 오류가 발생했습니다:", err);  // 오류 로그 출력
          setError('문의글을 불러오는 중 오류가 발생했습니다.');
          setLoading(false);
        }
      };

      // 비동기 함수 호출
      fetchInquiries();
    }
  }, [navigate]);  // 컴포넌트가 처음 렌더링될 때 한 번만 실행

  // 문의글 상세 페이지로 이동하는 함수
  const handleInquiryClick = (id) => {
    navigate(`/inquiry/${id}`); // 고유한 ID로 이동
  };

  return (
    <div className="customer-service-main">
      <h1>무엇을 도와드릴까요? <span>Q&A</span></h1>

      {/* 로딩 중 상태 처리 */}
      {loading ? (
        <p>로딩 중...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          {inquiries.length === 0 ? (
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
                {inquiries.map((inquiry, index) => (
                  <tr key={inquiry.qnaNo}> {/* 문의글의 고유 ID (qnaNo) 사용 */}
                    <td>{index + 1}</td>
                    <td>
                      <button
                        onClick={() => handleInquiryClick(inquiry.qnaNo)}  // 고유 ID로 클릭 이벤트 설정
                        style={{ background: "none", border: "none", color: "blue", textDecoration: "underline", cursor: "pointer" }}
                      >
                        {inquiry.qnaTitle}  {/* 제목 표시 */}
                      </button>
                    </td>
                    <td>
                      {inquiry.createdAt 
                        ? new Date(inquiry.createdAt).toLocaleDateString() 
                        : "날짜 정보 없음"} {/* 날짜를 형식에 맞게 표시 */}
                    </td>
                    <td>{inquiry.status || "상태 정보 없음"}</td>  {/* 상태 표시 */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
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
