import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko'; // 한글 로케일 추가

import '../../../resource/css/assets/AssetsCal.css'; // 스타일을 위한 CSS 파일
import Footer from '../../util/Footer'; // Footer 컴포넌트 경로 수정
import { Link } from 'react-router-dom';

const AssetsCal = () => {
  const events = [
    { title: '+15000', date: '2024-08-02', color: 'blue' },
    { title: '-3000', date: '2024-08-02', color: 'red' },
    { title: '+15000', date: '2024-08-10', color: 'blue' },
    { title: '-3000', date: '2024-08-15', color: 'red' },
  ];

  // 이벤트를 정렬하여 입금이 위로 올라가도록 설정
  const sortedEvents = events.sort((a, b) => {
    if (a.date === b.date) {
      return a.color === 'blue' ? -1 : 1;
    }
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div className="assets-cal-container">
      <h1 className="calendar-title">자산 캘린더</h1>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={sortedEvents}
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