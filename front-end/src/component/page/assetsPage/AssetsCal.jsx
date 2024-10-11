import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko'; // 한글 로케일 추가
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import '../../../resource/css/assets/AssetsCal.css'; // 스타일을 위한 CSS 파일
import Footer from '../../util/Footer'; // Footer 컴포넌트 경로 수정
import { Link } from 'react-router-dom';

const AssetsCal = () => {
  const [events, setEvents] = useState([]);
  const [userNo, setUserNo] = useState(null);
  const [accounts, setAccounts] = useState([]); // 계좌 정보 상태
  const [accountNumbers, setAccountNumbers] = useState([]);
  const [selectedAccountNumber, setSelectedAccountNumber] = useState(''); // 선택한 계좌 번호
  const token = localStorage.getItem('token'); // JWT 토큰
   // JWT 토큰 디코딩해서 username 가져오기
   const decoded = jwtDecode(token);
   const userId = decoded.username;

   // 계좌 선택 핸들러
  const handleSelectedAccountNumber = (event) => {
    const selectedAccountNumber = event.target.value;
    setSelectedAccountNumber(selectedAccountNumber);
    console.log("Selected Account Number: ", event.target.value); // 선택한 계좌 번호 콘솔 출력
  };

  useEffect(() => {
    // 유저의 계좌 정보를 가져오는 API 호출
    const fetchAccounts = async () => {
      try {
        const userNoResponse = await axios.get(`http://localhost:8081/exchange/list/${userId}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          }});
        const userNo = userNoResponse.data;
        setUserNo(userNo);
        console.log("UserNo:", userNo); // 사용자 번호 확인

        const accountsResponse = await axios.get(`http://localhost:8081/exchange/account/${userNo}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          }});
        const accounts = accountsResponse.data;
        console.log("Accounts:", accounts); // 응답 데이터 확인
        setAccountNumbers(accounts);
        
      } catch (error) {
        console.error('계좌 정보를 가져오는 중 오류 발생:', error);
      }
    };

    fetchAccounts(); // 계좌 정보 가져오기
  }, [token]);

  useEffect(() => {
    if (!selectedAccountNumber) return;

    // 선택한 계좌 번호에 따라 로그 데이터를 가져오는 API 호출
    axios.post(`http://localhost:8081/asset-calendar/logs/${selectedAccountNumber}`, 
      {
        selectedAccountNumber: selectedAccountNumber // 선택한 계좌 번호를 서버로 보냄
      },
      
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const logs = response.data;

        // 로그 데이터를 FullCalendar 이벤트로 변환
        const eventsData = logs.map((log) => {
          let title = '';
          let color = '';

          // 로그의 receiveAccountNo와 sendAccountNo 값을 콘솔에 출력
          console.log("Receive Account No: ", log.receiveAccountNo);
          console.log("Send Account No: ", log.sendAccountNo);

          // 선택한 계좌가 receiveAccountNo와 일치하면 파란색 +, sendAccountNo와 일치하면 빨간색 -
          if (log.receiveAccountNo === 2) {
            title = `+ ${log.sendPrice}`;
            color = 'blue'; // receiveAccountNo와 일치, 파란색으로 출력
            console.log("Matched receiveAccountNo, setting title and color: ", title, color);
          } else if (log.sendAccountNo === 1) {
            title = `- ${log.sendPrice}`;
            color = 'red'; // sendAccountNo와 일치, 빨간색으로 출력
            console.log("Matched sendAccountNo, setting title and color: ", title, color);
          }

          return {
            title: title,
            date: log.sendDate,
            color: color,
          };
        });

        // 날짜별로 정렬
        const sortedEvents = eventsData.sort((a, b) => {
          return new Date(a.date) - new Date(b.date); // 날짜순 정렬
        });

        setEvents(sortedEvents); // 이벤트 설정
        console.log("Sorted Events: ", sortedEvents); // 정렬된 이벤트 출력
      })
      .catch((error) => {
        console.error('로그 데이터를 가져오는 중 오류 발생:', error);
      });
  }, [selectedAccountNumber, token]);

  return (
    <div className="assets-cal-container">
      <h1 className="calendar-title">자산 캘린더</h1>

      {/* 계좌 선택 드롭다운 */}
      <div className="account-select-container">
        <label htmlFor="accountSelect">계좌 선택:</label>
        <select id="accountSelect" value={selectedAccountNumber} onChange={handleSelectedAccountNumber}>
          <option value="">계좌를 선택하세요</option>
          {accountNumbers.map((account, index) => (
            <option key={index} value={account.accountNumber}>
              {account.accountNumber}
            </option>
          ))}
        </select>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
        }}
        locale={koLocale} // 한글 로케일 설정
        dayCellClassNames={(arg) => {
          if (arg.date.getDay() === 0) {
            return 'sunday';
          } else if (arg.date.getDay() === 6) {
            return 'saturday';
          } else {
            return 'weekday';
          }
        }}
        eventContent={(arg) => (
          <div className="fc-event-content" style={{ color: arg.event.extendedProps.color }}>
            <span>{arg.event.title}</span>
          </div>
        )}
        height="auto" // 세로 길이 자동 조정
        dayHeaderContent={(arg) => {
          const days = ['일', '월', '화', '수', '목', '금', '토'];
          return <span className="day-header">{days[arg.date.getUTCDay()]}</span>;
        }}
        titleFormat={{ year: 'numeric', month: 'long' }} // 월 표시 형식
        dayCellContent={(arg) => (
          <div className="fc-daygrid-day-number">
            {arg.dayNumberText.replace('일', '')}
          </div>
        )}
      />

      <div className="button-container">
        <Link to="/AssetsAnalysis"><button className="asset-analysis">자산 분석</button></Link>
        <Link to="/myAsset"><button className="myAsset">나의 자산 현황</button></Link>
      </div>

      <Footer />
    </div>
  );
};

export default AssetsCal;
