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

  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(10);

  const token = localStorage.getItem("token");
  const userNo = localStorage.getItem("userNo");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchAccountDetail = async () => {
      try {
        const accountResponse = await ApiService.getAccountDetail(userNo, accountNumber, token);
        setAccountDetail(accountResponse.data);

        const logsResponse = await ApiService.getAccountLogs(accountNumber, token);
        const logs = logsResponse.data.length > 0 ? logsResponse.data : [];
        const sortedLogs = logs.sort((a, b) => new Date(b.sendDate) - new Date(a.sendDate));

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
    setShowCalendar(!showCalendar);
  };

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
    return logs.map(log => {
      const updatedLog = { ...log };
      if (log.sendAccountNumber === accountNumber) {
        updatedLog.balance = balance;
        balance += log.sendPrice;
      } else if (log.receiveAccountNumber === accountNumber) {
        updatedLog.balance = balance;
        balance -= log.sendPrice;
      }
      return updatedLog;
    });
  };

  const logsWithCalculatedBalance = calculateBalanceFromCurrent(transactionLogs, accountDetail ? accountDetail.accountBalance : 0);

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logsWithCalculatedBalance.slice(indexOfFirstLog, indexOfLastLog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(transactionLogs.length / logsPerPage);

  if (error) {
    return <p>{error}</p>;
  }

  if (!accountDetail) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="AccountDetail-container">
      <h2 className="AccountDetail-title">계좌 상세 조회</h2>

      <div className="AccountDetail-info">
        <div>
          <span className="AccountDetail-number">{accountDetail.accountNumber} | {accountDetail.depositName}</span>
        </div>
        <div className="AccountDetail-balance-box">
          잔액: {accountDetail.accountBalance.toLocaleString()}원
        </div>
      </div>

      <div className="AccountDetail-summary">
        <span>총 입금금액: <span className="highlighted-text">{totalDeposit.toLocaleString()}원</span></span>
        <span>총 출금금액: <span className="highlighted-text">{totalWithdraw.toLocaleString()}원</span></span>
      </div>

      <button className="AccountDetail-action-button" onClick={handleCalendarViewClick}>
        {showCalendar ? '표로 보기' : '캘린더로 보기'}
      </button>

      {showCalendar ? (
        <Calendar
          tileClassName={({ date }) => {
            const { totalDepositForDate, totalWithdrawForDate } = getTotalAmountsForDate(date);
            const classes = [];
            if (totalWithdrawForDate > 0) classes.push('withdraw');
            if (totalDepositForDate > 0) classes.push('deposit');
            return classes.join(' ');
          }}
          tileContent={({ date }) => {
            const { totalDepositForDate, totalWithdrawForDate } = getTotalAmountsForDate(date);
            return (
              <div>
                {totalDepositForDate > 0 && <div className="blue-text">입금: {totalDepositForDate.toLocaleString()}원</div>}
                {totalWithdrawForDate > 0 && <div className="red-text">출금: {totalWithdrawForDate.toLocaleString()}원</div>}
              </div>
            );
          }}
        />
      ) : (
        <table className="AccountDetail-table">
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
      )}

      {!showCalendar && (
        <div className="AccountDetail-pagination">
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
      )}

      <button className="AccountDetail-back-button" onClick={() => navigate(`/accounts`)}>
        목록
      </button>
    </div>
  );
};

export default AccountDetail;
