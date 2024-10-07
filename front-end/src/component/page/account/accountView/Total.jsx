import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../../../../ApiService';
import '../../../../resource/css/account/accountView/Total.css';

const Total = () => {
  const [accounts, setAccounts] = useState([]);
  const [productMap, setProductMap] = useState({}); // productNo와 productName 매핑

  // 만기일 계산 함수
  const calculateExpiryDate = (accountOpen, productPeriod) => {
    const openDate = new Date(accountOpen);
    openDate.setMonth(openDate.getMonth() + (productPeriod || 0));
    return openDate;
  };

  const fetchData = async () => {
    try {
      // 전체 계좌를 한 번에 가져오는 API 호출
      const response = await ApiService.getAllAccounts();
      const allAccounts = response.data;

      // 중복 계좌 제거 (계좌번호 기준으로)
      const uniqueAccounts = allAccounts.filter((account, index, self) =>
        index === self.findIndex((acc) => acc.accountNumber === account.accountNumber)
      );

      // productPeriod를 가져와서 만기일 계산을 추가
      const updatedAccounts = uniqueAccounts.map(account => {
        const accountExpiry = calculateExpiryDate(account.accountOpen, account.productPeriod);
        return { ...account, accountExpiry }; // accountExpiry 필드를 추가
      });

      setAccounts(updatedAccounts);
    } catch (error) {
      console.error('데이터를 가져오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchData(); // 컴포넌트가 처음 렌더링될 때 데이터 가져오기
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="total-account-container">
      <h5>(고객명)님 | 총 잔액: {(accounts.reduce((sum, acc) => sum + (acc.accountBalance || 0), 0)).toLocaleString()}원</h5>

      <div className="total-account-section">
        <h6>전체 계좌 ({accounts.length} 계좌)</h6>
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
            {accounts.map((account) => (
              <tr key={account.accountNumber}>
                <td><Link to={`/account/detail/${account.accountNumber}`}>{account.accountNumber}</Link></td>
                <td>{account.productName}</td> {/* productName 정상적으로 사용 */}
                <td>{formatDate(account.accountOpen)}</td>
                <td>{formatDate(account.accountExpiry)}</td> {/* 만기일 계산 후 표시 */}
                <td>{(account.accountBalance || 0).toLocaleString()}원</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Total;
