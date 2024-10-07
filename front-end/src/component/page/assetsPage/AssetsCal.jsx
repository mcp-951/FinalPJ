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
    // Fetch asset logs from the backend
    axios.get('/api/assets/logs')
      .then(response => {
        const logs = response.data;

        // Convert logs to FullCalendar events
        const eventsData = logs.map(log => ({
          title: `${log.logState === 'deposit' ? '+' : '-'}${log.sendPrice}`,
          date: log.sendDate,
          color: log.logState === 'deposit' ? 'blue' : 'red'
        }));

        // Sort events so deposits come first if on the same day
        const sortedEvents = eventsData.sort((a, b) => {
          if (a.date === b.date) {
            return a.color === 'blue' ? -1 : 1;
          }
          return new Date(a.date) - new Date(b.date);
        });

        setEvents(sortedEvents);
      })
      .catch(error => {
        console.error('Error fetching logs:', error);
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
