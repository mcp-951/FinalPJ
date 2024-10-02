import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../../../../resource/css/account/accountView/AccountDetail.css'

const AccountDetail = () => {
  const { accountNumber } = useParams();
  const navigate = useNavigate();

  const handleTransferClick = () => {
    navigate('/account/transfer', { state: { selectedAccount: accountNumber } });
  };

  return (
    <div className="account-detail-container">
      <h2 className="account-detail-title">계좌 상세 조회</h2>

      <div className="account-detail-info">
        <div className="account-number-section">
          <div className="account-number-box">
            <span className="account-detail-number">{accountNumber} | 계좌종류</span>
          </div>
          <div className="account-detail-balance-box">
            <span className="account-detail-balance">잔액: 100,000원</span>
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
        <span className="total-deposit">총 입금금액: <span className="highlighted-text">10,000원</span></span>
        <span className="total-withdraw">총 출금금액: <span className="highlighted-text">10,000원</span></span>
      </div>

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
          <tr>
            <td>2024-01-01</td>
            <td>홍길동</td>
            <td>5,000원</td>
            <td>-</td>
            <td>95,000원</td>
          </tr>
        </tbody>
      </table>

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
