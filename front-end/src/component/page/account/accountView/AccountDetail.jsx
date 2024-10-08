import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../../../ApiService';  // ApiService 임포트
import '../../../../resource/css/account/accountView/AccountDetail.css'

const AccountDetail = () => {
  const { accountNumber } = useParams(); // 현재 계좌번호
  const navigate = useNavigate();

  const [accountDetail, setAccountDetail] = useState(null); // 계좌 상세 정보 상태
  const [transactionLogs, setTransactionLogs] = useState([]);  // 거래내역 상태
  const [totalDeposit, setTotalDeposit] = useState(0); // 총 입금 금액
  const [totalWithdraw, setTotalWithdraw] = useState(0); // 총 출금 금액
  const [error, setError] = useState(null); // 에러 처리 상태

  // 백엔드에서 계좌 상세 정보와 거래내역 가져오기
  useEffect(() => {
    const fetchAccountDetail = async () => {
      try {
        const accountResponse = await ApiService.getAccountDetail(accountNumber);
        setAccountDetail(accountResponse.data);
        const logsResponse = await ApiService.getAccountLogs(accountNumber);
        const logs = logsResponse.data.length > 0 ? logsResponse.data : [];
        
        // 오래된 순으로 거래 내역 정렬
        const sortedLogs = logs.sort((a, b) => new Date(a.sendDate) - new Date(b.sendDate));
        
        setTransactionLogs(sortedLogs);
        calculateTotals(sortedLogs);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        setError('계좌 정보를 가져오는 중 오류가 발생했습니다.');
      }
    };
  
    fetchAccountDetail();
  }, [accountNumber]);
  
  // 이후에는 accountDetail.productName으로 접근 가능
  

  const handleTransferClick = () => {
    navigate('/account/transfer', { state: { selectedAccount: accountNumber } });
  };

  // 입금, 출금 총액 계산 함수
  const calculateTotals = (logs) => {
    let totalDepositAmount = 0;
    let totalWithdrawAmount = 0;

    logs.forEach(log => {
      if (log.receiveAccountNo === parseInt(accountNumber)) {
        totalDepositAmount += log.sendPrice; // 입금
      } else if (log.sendAccountNo === parseInt(accountNumber)) {
        totalWithdrawAmount += log.sendPrice; // 출금
      }
    });

    setTotalDeposit(totalDepositAmount);
    setTotalWithdraw(totalWithdrawAmount);
  };

  if (error) {
    return <p>{error}</p>; // 에러 메시지 출력
  }

  if (!accountDetail) {
    return <p>로딩 중...</p>; // 로딩 상태 표시
  }

  // 잔액을 현재 잔액에서부터 위로 계산하는 함수
  const calculateBalanceFromCurrent = (logs, currentBalance) => {
    let balance = currentBalance; // 현재 잔액으로 시작

    return logs.reverse().map(log => { // 최신 거래부터 역순으로 잔액 계산
      let currentLog = { ...log };

      // 출금이면 잔액 더하기 (이전 잔액 계산)
      if (log.sendAccountNo === parseInt(accountNumber)) {
        currentLog.balance = balance;
        balance += log.sendPrice; // 출금은 잔액에서 돈이 더해짐
      } 
      // 입금이면 잔액 빼기 (이전 잔액 계산)
      else if (log.receiveAccountNo === parseInt(accountNumber)) {
        currentLog.balance = balance;
        balance -= log.sendPrice; // 입금은 잔액에서 돈이 빠짐
      }

      return currentLog;
    }).reverse(); // 다시 원래 순서로 복구
  };

  // 잔액을 현재 잔액에서부터 계산
  const logsWithCalculatedBalance = calculateBalanceFromCurrent(transactionLogs, accountDetail.accountBalance);

  return (
    <div className="account-detail-container">
      <h2 className="account-detail-title">계좌 상세 조회</h2>

      <div className="account-detail-info">
        <div className="account-number-section">
          <div className="account-number-box">
            <span className="account-detail-number">{accountDetail.accountNumber} | {accountDetail.productName}</span>
          </div>
          <div className="account-detail-balance-box">
            <span className="account-detail-balance">잔액: {accountDetail.accountBalance.toLocaleString()}원</span>
          </div>
        </div>

        <div className="right-section">
          <div className="account-detail-period">
            조회 기간: 2024-01-01 ~ 2024-01-31
          </div>

          <div className="account-detail-action-buttons">
            <button className="account-detail-action-button">거래내역</button>
            <button
              className="account-detail-transfer-button"
              onClick={handleTransferClick}
            >
              이체
            </button>
          </div>
        </div>
      </div>

      <div className="account-summary">
        <span className="total-deposit">총 입금금액: <span className="highlighted-text">{totalDeposit.toLocaleString()}원</span></span>
        <span className="total-withdraw">총 출금금액: <span className="highlighted-text">{totalWithdraw.toLocaleString()}원</span></span>
      </div>

      {transactionLogs.length === 0 ? (
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
                <td>{log.sendAccountNo === parseInt(accountNumber) ? log.receiveAccountNo : log.sendAccountNo}</td>
                <td>{log.sendAccountNo === parseInt(accountNumber) ? log.sendPrice.toLocaleString() : '-'}</td>
                <td>{log.receiveAccountNo === parseInt(accountNumber) ? log.sendPrice.toLocaleString() : '-'}</td>
                <td>{log.balance.toLocaleString()}원</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="account-detail-pagination">
        <div className="pagination-center">
          <button className="account-detail-page-button">1</button>
          <Link to="/account">
            <button className="account-detail-back-button">목록</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountDetail;
