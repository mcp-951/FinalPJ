import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../../../ApiService';
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css'; 
import '../../../../resource/css/account/accountView/AccountDetail.css';

const AccountDetail = () => {
  const { accountNumber } = useParams();
  const navigate = useNavigate();

  const [accountDetail, setAccountDetail] = useState(null);
  const [transactionLogs, setTransactionLogs] = useState([]);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalWithdraw, setTotalWithdraw] = useState(0);
  const [error, setError] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const token = localStorage.getItem("token");
  const userNo = localStorage.getItem("userNo");

  useEffect(() => {
    const fetchAccountDetail = async () => {
      try {
        const accountResponse = await ApiService.getAccountDetail(userNo, accountNumber, token);
        setAccountDetail(accountResponse.data);

        const logsResponse = await ApiService.getAccountLogs(accountNumber, token);
        const logs = logsResponse.data.length > 0 ? logsResponse.data : [];
        const sortedLogs = logs.sort((a, b) => new Date(a.sendDate) - new Date(b.sendDate));

        setTransactionLogs(sortedLogs);
        calculateTotals(sortedLogs);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        setError('계좌 정보를 가져오는 중 오류가 발생했습니다.');
      }
    };

    fetchAccountDetail();
  }, [userNo, accountNumber, token]);

  const calculateTotals = (logs) => {
    let totalDepositAmount = 0;
    let totalWithdrawAmount = 0;

    logs.forEach(log => {
      if (log.receiveAccountNumber === accountNumber) {
        totalDepositAmount += log.sendPrice;
      } else if (log.sendAccountNumber === accountNumber) {
        totalWithdrawAmount += log.sendPrice;
      }
    });

    setTotalDeposit(totalDepositAmount);
    setTotalWithdraw(totalWithdrawAmount);
  };

  const handleCalendarViewClick = () => {
    setShowCalendar(!showCalendar); // 캘린더 보기/숨기기
  };

  // 날짜별 총 입금/출금 금액 계산
  const getTotalAmountsForDate = (date) => {
    let totalDepositForDate = 0;
    let totalWithdrawForDate = 0;

    transactionLogs.forEach(log => {
      const logDate = new Date(log.sendDate).toDateString();
      if (logDate === date.toDateString()) {
        if (log.receiveAccountNumber === accountNumber) {
          totalDepositForDate += log.sendPrice;
        } else if (log.sendAccountNumber === accountNumber) {
          totalWithdrawForDate += log.sendPrice;
        }
      }
    });

    return { totalDepositForDate, totalWithdrawForDate };
  };

  const calculateBalanceFromCurrent = (logs, currentBalance) => {
    let balance = currentBalance;

    return logs.reverse().map(log => {
      let currentLog = { ...log };

      if (log.sendAccountNumber === accountNumber) {
        currentLog.balance = balance;
        balance += log.sendPrice;
      } else if (log.receiveAccountNumber === accountNumber) {
        currentLog.balance = balance;
        balance -= log.sendPrice;
      }

      return currentLog;
    }).reverse();
  };

  const logsWithCalculatedBalance = calculateBalanceFromCurrent(transactionLogs, accountDetail ? accountDetail.accountBalance : 0);

  if (error) {
    return <p>{error}</p>;
  }

  if (!accountDetail) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="account-detail-container">
      <h2 className="account-detail-title">계좌 상세 조회</h2>

      <div className="account-detail-info">
        <div className="account-number-section">
          <div className="account-number-box">
            <span className="account-detail-number">{accountDetail.accountNumber} | {accountDetail.depositName}</span>
          </div>
          <div className="account-detail-balance-box">
            <span className="account-detail-balance">잔액: {accountDetail.accountBalance.toLocaleString()}원</span>
          </div>
        </div>

        <div className="right-section">
          <div className="account-detail-action-buttons">
            <button className="account-detail-transfer-button" onClick={() => navigate('/account/transfer', { state: { selectedAccount: accountNumber } })}>
              이체
            </button>
          </div>
        </div>
      </div>

      <div className="account-summary">
        <span className="total-deposit">총 입금금액: <span className="highlighted-text">{totalDeposit.toLocaleString()}원</span></span>
        <span className="total-withdraw">총 출금금액: <span className="highlighted-text">{totalWithdraw.toLocaleString()}원</span></span>
      </div>

      {/* 거래내역 표 위에 '캘린더로 보기' 버튼 추가 */}
      <div className="calendar-toggle-section">
        <button className="account-detail-action-button" onClick={handleCalendarViewClick}>
          {showCalendar ? '표로 보기' : '캘린더로 보기'}
        </button>
      </div>

      {showCalendar ? (
        <Calendar
        tileClassName={({ date, view }) => {
          if (view === 'month') {
            const day = date.getDay();
            const isSaturday = day === 6;
            const isSunday = day === 0;
      
            const classes = [];
            if (isSaturday) {
              classes.push('saturday');
            }
            if (isSunday) {
              classes.push('sunday');
            }
      
            const { totalDepositForDate, totalWithdrawForDate } = getTotalAmountsForDate(date);

            if (totalDepositForDate > 0 || totalWithdrawForDate > 0) {
              if (totalWithdrawForDate > 0) {
                classes.push('withdraw');
              }
              if (totalDepositForDate > 0) {
                classes.push('deposit');
              }
            }
      
            return classes.join(' ');
          }
        }}
        tileContent={({ date }) => {
          const { totalDepositForDate, totalWithdrawForDate } = getTotalAmountsForDate(date);
        
          if (totalDepositForDate > 0 || totalWithdrawForDate > 0) {
            return (
              <div>
                {totalDepositForDate > 0 && (
                  <div className="transaction-info blue-text">
                    총 입금: {totalDepositForDate.toLocaleString()}원
                  </div>
                )}
                {totalWithdrawForDate > 0 && (
                  <div className="transaction-info red-text">
                    총 출금: {totalWithdrawForDate.toLocaleString()}원
                  </div>
                )}
              </div>
            );
          } else {
            return null;
          }
        }}
      />
      ) : (
        transactionLogs.length === 0 ? (
          <p>거래 내역이 없습니다.</p>
        ) : (
          <table className="account-detail-table">
            <thead>
              <tr>
                <th>거래일시</th>
                <th>보낸/받는분</th>
                <th>출금(원)</th>
                <th>입금(원)</th>
                <th>잔액(원)</th>
              </tr>
            </thead>
            <tbody>
              {logsWithCalculatedBalance.map((log) => (
                <tr key={log.logNo}>
                  <td>{new Date(log.sendDate).toLocaleDateString()}</td>
                  <td>{log.sendAccountNumber === accountNumber ? log.receiveAccountNumber : log.sendAccountNumber}</td>
                  <td>{log.sendAccountNumber === accountNumber ? log.sendPrice.toLocaleString() : '-'}</td>
                  <td>{log.receiveAccountNumber === accountNumber ? log.sendPrice.toLocaleString() : '-'}</td>
                  <td>{log.balance.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      <div className="account-detail-pagination">
        <div className="pagination-center">
          <button className="account-detail-back-button" onClick={() => navigate('/account')}>
            목록
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountDetail;
