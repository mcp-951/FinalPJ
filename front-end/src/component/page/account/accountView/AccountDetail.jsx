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

  // 페이징 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(10); // 한 페이지에 10개의 거래 내역 표시

  const token = localStorage.getItem("token");
  const userNo = localStorage.getItem("userNo");

  useEffect(() => {
    const fetchAccountDetail = async () => {
      try {
        const accountResponse = await ApiService.getAccountDetail(userNo, accountNumber, token);
        setAccountDetail(accountResponse.data);

        const logsResponse = await ApiService.getAccountLogs(accountNumber, token);
        const logs = logsResponse.data.length > 0 ? logsResponse.data : [];
        const sortedLogs = logs.sort((a, b) => new Date(b.sendDate) - new Date(a.sendDate)); // 최신순으로 정렬

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

  // 잔액 계산 함수 (최신 거래부터 시작해서 차례로 잔액 계산)
  const calculateBalanceFromCurrent = (logs, currentBalance) => {
    let balance = currentBalance; // 현재 잔액부터 시작
    const updatedLogs = logs.map(log => {
      const updatedLog = { ...log };

      // 거래 전 잔액을 먼저 계산
      if (log.sendAccountNumber === accountNumber) {
        updatedLog.balance = balance;  // 거래 전 잔액 설정
        balance += log.sendPrice;      // 출금 전 잔액 증가
      } else if (log.receiveAccountNumber === accountNumber) {
        updatedLog.balance = balance;  // 거래 전 잔액 설정
        balance -= log.sendPrice;      // 입금 전 잔액 감소
      }

      return updatedLog;
    });

    return updatedLogs; // 최신순으로 유지
  };

  const logsWithCalculatedBalance = calculateBalanceFromCurrent(transactionLogs, accountDetail ? accountDetail.accountBalance : 0);

  // 현재 페이지에 맞는 거래 내역 가져오기
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logsWithCalculatedBalance.slice(indexOfFirstLog, indexOfLastLog);

  // 페이지 변경 핸들러
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 페이지 수 계산
  const totalPages = Math.ceil(transactionLogs.length / logsPerPage);

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
          <div>
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
                {currentLogs.map((log) => (
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

            {/* 페이지네이션 버튼 */}
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )
      )}

      <div className="account-detail-pagination">
        <div className="pagination-center">
          <button className="account-detail-back-button" onClick={() => navigate(`/users/${userNo}/accounts`)}>
            목록
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountDetail;
