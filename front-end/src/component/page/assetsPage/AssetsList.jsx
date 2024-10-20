import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../../resource/css/assets/AssetsList.css';
import Footer from '../../util/Footer';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AssetsList = () => {
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const userId = decoded.username;
  const [userNo, setUserNo] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [products, setProducts] = useState({});
  const [copiedAccount, setCopiedAccount] = useState(null);

  useEffect(() => {
    const fetchUserNoAndAccounts = async () => {
      try {
        const userNoResponse = await axios.get(`http://localhost:8081/exchange/list/${userId}`);
        const userNo = userNoResponse.data;
        setUserNo(userNo);

        const accountsResponse = await axios.get(`http://localhost:8081/exchange/account/${userNo}`);
        setAccounts(accountsResponse.data);

        const productNos = accountsResponse.data.map(account => account.productNo);
        const productRequests = productNos.map(productNo =>
          axios.get(`http://localhost:8081/myAsset/${productNo}`)
        );
        const productResponses = await Promise.all(productRequests);
        const productsData = {};
        productResponses.forEach((res, index) => {
          productsData[productNos[index]] = res.data;
        });
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (userId) {
      fetchUserNoAndAccounts();
    }
  }, [userId]);

  const handleCopy = (accountNumber) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedAccount(accountNumber);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  return (
    <div className="AssetsList-container">
      <h1 className="AssetsList-title">자산 보유 현황</h1>

      {/* 입출금 계좌 */}
      <div className="AssetsList-section">
        <h2 className="AssetsList-section-title">입출금 계좌</h2>
        <table className="AssetsList-table">
          <thead>
            <tr>
              <th>상품명</th>
              <th>계좌 번호</th>
              <th>잔액</th>
              <th>복사</th>
              <th>상세</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => (
              products[account.productNo]?.productCategory === '입출금통장' && (
                <tr key={index}>
                  <td>{products[account.productNo]?.productName || '상품명 없음'}</td>
                  <td>{account.accountNumber}</td>
                  <td>{account.accountLimit} 원</td>
                  <td>
                    <button className="AssetsList-copy-button" onClick={() => handleCopy(account.accountNumber)}>복사</button>
                    {copiedAccount === account.accountNumber && <span className="AssetsList-copied-text">복사되었습니다</span>}
                  </td>
                  <td>
                    <Link to={`/account/${account.accountNumber}`} className="AssetsList-detail-button">상세</Link>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      {/* 저축 계좌 */}
      <div className="AssetsList-section">
        <h2 className="AssetsList-section-title">저축 계좌</h2>
        <table className="AssetsList-table">
          <thead>
            <tr>
              <th>상품명</th>
              <th>계좌 번호</th>
              <th>잔액</th>
              <th>복사</th>
              <th>상세</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => (
              products[account.productNo]?.productCategory === '저축통장' && (
                <tr key={index}>
                  <td>{products[account.productNo]?.productName || '상품명 없음'}</td>
                  <td>{account.accountNumber}</td>
                  <td>{account.accountLimit} 원</td>
                  <td>
                    <button className="AssetsList-copy-button" onClick={() => handleCopy(account.accountNumber)}>복사</button>
                    {copiedAccount === account.accountNumber && <span className="AssetsList-copied-text">복사되었습니다</span>}
                  </td>
                  <td>
                    <Link to={`/account/${account.accountNumber}`} className="AssetsList-detail-button">상세</Link>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      {/* 외환 계좌 */}
      <div className="AssetsList-section">
        <h2 className="AssetsList-section-title">외환 계좌</h2>
        <table className="AssetsList-table">
          <thead>
            <tr>
              <th>상품명</th>
              <th>계좌 번호</th>
              <th>잔액</th>
              <th>복사</th>
              <th>상세</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => (
              products[account.productNo]?.productCategory === '외환통장' && (
                <tr key={index}>
                  <td>{products[account.productNo]?.productName || '상품명 없음'}</td>
                  <td>{account.accountNumber}</td>
                  <td>{account.accountLimit} 원</td>
                  <td>
                    <button className="AssetsList-copy-button" onClick={() => handleCopy(account.accountNumber)}>복사</button>
                    {copiedAccount === account.accountNumber && <span className="AssetsList-copied-text">복사되었습니다</span>}
                  </td>
                  <td>
                    <Link to={`/account/${account.accountNumber}`} className="AssetsList-detail-button">상세</Link>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      <div className="AssetsList-button-container">
        <Link to="/AssetsAnalysis" className="AssetsList-button">자산 분석</Link>
        <Link to="/asset-calendar" className="AssetsList-button">자산 캘린더</Link>
      </div>

      <Footer />
    </div>
  );
};

export default AssetsList;
