import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko'; // 한글 로케일 추가
import axios from 'axios';

import '../../../resource/css/assets/AssetsCal.css'; // 스타일을 위한 CSS 파일
import Footer from '../../util/Footer'; // Footer 컴포넌트 경로 수정
import { Link } from 'react-router-dom';

const AssetsCal = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // 백엔드에서 로그 데이터를 가져오는 API 호출
    axios.get('http://localhost:8081/asset-calendar/logs')
      .then(response => {
        const logs = response.data;

        // 로그 데이터를 FullCalendar 이벤트로 변환
        const eventsData = logs.map(log => ({
          title: `${log.logState === 'in' ? '+' : '-'}${log.sendPrice}`, // 입금이면 +, 출금이면 -
          date: log.sendDate,
          color: log.logState === 'in' ? 'blue' : 'red' // 입금이면 파란색, 출금이면 빨간색
        }));

        // 날짜별로 정렬
        const sortedEvents = eventsData.sort((a, b) => {
          if (a.date === b.date) {
            return a.color === 'blue' ? -1 : 1; // 같은 날이면 입금이 먼저 오도록
          }
          return new Date(a.date) - new Date(b.date); // 날짜순 정렬
        });

        setEvents(sortedEvents); // 이벤트 설정
      })
      .catch(error => {
        console.error('로그 데이터를 가져오는 중 오류 발생:', error);
      });
  }, []);

  return (
    <div className="assets-cal-container">
      <h1 className="calendar-title">자산 캘린더</h1>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay'
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
