import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // 캘린더 기본 스타일
import { useLocation } from 'react-router-dom';
import '../../../../resource/css/account/accountView/TransactionCalendar.css'; // 사용자 정의 CSS

const TransactionCalendar = () => {
  const location = useLocation();
  const { accountNumber, transactionLogs } = location.state || {}; // 전달받은 계좌번호와 거래내역
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 거래 내역에서 날짜만 추출하고 중복을 제거한 날짜 목록을 생성
  const transactionDates = transactionLogs
    ? [...new Set(transactionLogs.map(log => new Date(log.sendDate).toDateString()))]
    : [];

  // 특정 날짜에 거래 내역이 있는지 확인
  const isTransactionDate = (date) => {
    return transactionDates.includes(date.toDateString());
  };

  // 날짜 클릭 시 해당 날짜의 거래 내역을 필터링하는 함수
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="transaction-calendar-container">
      <h2>{accountNumber}의 거래 내역</h2>
      <Calendar
        value={selectedDate}
        onClickDay={handleDateClick}
        tileClassName={({ date }) =>
          isTransactionDate(date) ? 'highlight' : null // 거래 내역이 있는 날짜는 하이라이트
        }
      />

      {/* 선택된 날짜의 거래 내역 표시 */}
      <div className="transaction-details">
        <h3>{selectedDate.toLocaleDateString()}의 거래 내역</h3>
        <ul>
          {transactionLogs
            .filter((log) => new Date(log.sendDate).toDateString() === selectedDate.toDateString())
            .map((log) => (
              <li key={log.logNo}>
                {log.sendAccountNumber === accountNumber
                  ? `출금: ${log.sendPrice.toLocaleString()}원`
                  : `입금: ${log.sendPrice.toLocaleString()}원`}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default TransactionCalendar;
