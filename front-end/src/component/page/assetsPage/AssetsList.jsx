import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../../resource/css/assets/AssetsList.css';
import Footer from '../../util/Footer';
import {jwtDecode} from 'jwt-decode'; // Corrected import statement
import axios from 'axios';

const AssetsList = () => {
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const userId = decoded.username; // JWT 토큰에서 userId를 가져옴
  const [userNo, setUserNo] = useState(null);
  const [accounts, setAccounts] = useState([]); // Account 정보를 저장할 상태
  const [products, setProducts] = useState({}); // Product 정보를 저장할 상태 (productNo를 key로 사용)
  const [copiedAccount, setCopiedAccount] = useState(null);

  useEffect(() => {
    const fetchUserNoAndAccounts = async () => {
      try {
        // 1. userNo 가져오기
        const userNoResponse = await axios.get(`http://localhost:8081/exchange/list/${userId}`);
        const userNo = userNoResponse.data;
        console.log("UserNo: ", userNo); // userNo 출력
        setUserNo(userNo);

        // 2. userNo로 account 정보 가져오기
        const accountsResponse = await axios.get(`http://localhost:8081/exchange/account/${userNo}`);
        const accountsData = accountsResponse.data;
        console.log("Accounts: ", accountsData); // account 정보 출력
        setAccounts(accountsData);

        // 3. productNo에 맞는 product 정보 가져오기
        const productNos = accountsData.map(account => account.productNo);
        console.log("ProductNos: ", productNos); // productNo 출력
        const productRequests = productNos.map(productNo => 
          axios.get(`http://localhost:8081/myAsset/${productNo}`) // product 정보 요청
        );
        const productResponses = await Promise.all(productRequests);
        const productsData = {};
        productResponses.forEach((res, index) => {
          productsData[productNos[index]] = res.data;
        });
        setProducts(productsData); // product 정보 상태에 저장
        console.log("Products: ", productsData); // product 정보 출력
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
    <div className="assets-list">
      <h1 className="title">자산 보유 현황</h1>

      {/* 입출금 계좌 */}
      <div className="account-section">
        <div className="section-header">
          <span className="section-title">입출금 계좌</span>
        </div>
        <div className="account-list">
          {accounts.map((account, index) => (
            products[account.productNo]?.productCategory === '입출금통장' && (
              <div key={index} className="account-item">
                <span className="account-icon">📒</span>
                <span className="account-info">
                  {/* Product 정보 표시 */}
                  {products[account.productNo]?.productName || '상품명 없음'} ({products[account.productNo]?.productCategory || '카테고리 없음'})
                </span>
                <span className="account-number">계좌 번호: {account.accountNumber}</span>
                <span className="account-balance">잔액: {account.accountLimit} 원</span> {/* accountBalance 추가 */}
                <button className="copy-button" onClick={() => handleCopy(account.accountNumber)}>복사</button>
                {copiedAccount === account.accountNumber && <span className="copied-text">복사되었습니다</span>}
                <Link to={`/account/${account.accountNumber}`} className="detail-button">상세</Link>
              </div>
            )
          ))}
        </div>
      </div>

      {/* 저축 계좌 */}
      <div className="account-section">
        <div className="section-header">
          <span className="section-title">저축 계좌</span>
        </div>
        <div className="account-list">
          {accounts.map((account, index) => (
            products[account.productNo]?.productCategory === '저축통장' && (
              <div key={index} className="account-item">
                <span className="account-icon">📒</span>
                <span className="account-info">
                  {products[account.productNo]?.productName || '상품명 없음'} ({products[account.productNo]?.productCategory || '카테고리 없음'})
                </span>
                <span className="account-number">{account.accountNumber}</span>
                <span className="account-balance">{account.accountLimit} 원</span> {/* accountBalance 추가 */}
                <button className="copy-button" onClick={() => handleCopy(account.accountNumber)}>복사</button>
                {copiedAccount === account.accountNumber && <span className="copied-text">복사되었습니다</span>}
                <Link to={`/account/${account.accountNumber}`} className="detail-button">상세</Link>
              </div>
            )
          ))}
        </div>
      </div>

      {/* 외환 계좌 */}
      <div className="account-section">
        <div className="section-header">
          <span className="section-title">외환 계좌</span>
        </div>
        <div className="account-list">
          {accounts.map((account, index) => (
            products[account.productNo]?.productCategory === '외환통장' && (
              <div key={index} className="account-item">
                <span className="account-icon">📒</span>
                <span className="account-info">
                  {products[account.productNo]?.productName || '상품명 없음'} ({products[account.productNo]?.productCategory || '카테고리 없음'})
                </span>
                <span className="account-number">{account.accountNumber}</span>
                <span className="account-balance">{account.accountLimit} 원</span> {/* accountBalance 추가 */}
                <button className="copy-button" onClick={() => handleCopy(account.accountNumber)}>복사</button>
                {copiedAccount === account.accountNumber && <span className="copied-text">복사되었습니다</span>}
                <Link to={`/account/${account.accountNumber}`} className="detail-button">상세</Link>
              </div>
            )
          ))}
        </div>
      </div>

      <div className="button-container">
       
        <Link to="/asset-calendar" className="button">자산 캘린더</Link>
      </div>

      <Footer />
    </div>
  );
};

export default AssetsList;
