import React from 'react';
import { Link } from 'react-router-dom';
import '../../../../resource/css/account/accountView/Total.css'; // CSS 파일명 수정

const Total = () => (
  <div className="total-account-container">
    <h5>(고객명)님 | 총 잔액: 300,000원</h5>

    {/* 예금 섹션 */}
    <div className="total-account-section">
      <h6>예금 (계좌 수) | 잔액 100,000원</h6>
      <table className="total-account-table">
        <thead>
          <tr>
            <th>계좌번호</th>
            <th>계좌명</th>
            <th>개설일</th>
            <th>만기일</th>
            <th>잔액</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Link to="/account/detail/123-456-789">123-456-789</Link>
            </td>
            <td>예금계좌</td>
            <td>2024-01-01</td>
            <td>2025-01-01</td>
            <td>100,000원</td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* 적금 섹션 */}
    <div className="total-account-section">
      <h6>적금 (계좌 수) | 잔액 100,000원</h6>
      <table className="total-account-table">
        <thead>
          <tr>
            <th>계좌번호</th>
            <th>계좌명</th>
            <th>개설일</th>
            <th>만기일</th>
            <th>잔액</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Link to="/account/detail/234-567-890">234-567-890</Link>
            </td>
            <td>적금계좌</td>
            <td>2024-01-01</td>
            <td>2025-01-01</td>
            <td>100,000원</td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* 대출 섹션 */}
    <div className="total-account-section">
      <h6>대출 (계좌 수) | 잔액 100,000원</h6>
      <table className="total-account-table">
        <thead>
          <tr>
            <th>계좌번호</th>
            <th>계좌명</th>
            <th>개설일</th>
            <th>만기일</th>
            <th>대출잔액</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Link to="/account/detail/345-678-901">345-678-901</Link>
            </td>
            <td>대출계좌</td>
            <td>2024-01-01</td>
            <td>2025-01-01</td>
            <td>100,000원</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default Total;
