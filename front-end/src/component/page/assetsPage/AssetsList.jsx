import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../../resource/css/assets/AssetsList.css';
import Footer from 'component/util/Footer';

const AssetsList = () => {
  const [showDepositAccounts, setShowDepositAccounts] = useState(true);
  const [showSavingAccounts, setShowSavingAccounts] = useState(true);
  const [showForeignAccounts, setShowForeignAccounts] = useState(true);
  const [copiedAccount, setCopiedAccount] = useState(null);

  const toggleDepositAccounts = () => setShowDepositAccounts(!showDepositAccounts);
  const toggleSavingAccounts = () => setShowSavingAccounts(!showSavingAccounts);
  const toggleForeignAccounts = () => setShowForeignAccounts(!showForeignAccounts);

  const handleCopy = (accountNumber) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedAccount(accountNumber);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const depositAccounts = [
    { type: '입출금통장', bank: 'URAM BANK', balance: '100,000 원', accountNumber: '110-456-789' },
    { type: '월급통장', bank: 'URAM BANK', balance: '3,000,000 원', accountNumber: '110-654-321' },
    { type: '주식통장', bank: 'URAM BANK', balance: '20,000 원', accountNumber: '110-789-123' },
  ];

  const savingAccounts = [
    { type: '예금통장', bank: 'URAM BANK', balance: '500,000 원', accountNumber: '110-654-987' },
    { type: '적금통장', bank: 'URAM BANK', balance: '300,000 원', accountNumber: '110-321-987' },
  ];

  const foreignAccounts = [
    { type: '외환통장', bank: 'URAM BANK', balance: '1,000 USD', accountNumber: '110-222-333' },
  ];

  return (
    <div className="assets-list">
      <h1 className="title">자산 보유 현황</h1>
      <div className="account-section">
        <div className="section-header" onClick={toggleDepositAccounts}>
          <span className="section-title">입출금 계좌</span>
          <span className="toggle-icon">{showDepositAccounts ? '▼' : '▲'}</span>
        </div>
        {showDepositAccounts && (
          <div className="account-list">
            {depositAccounts.map((account, index) => (
              <div key={index} className="account-item">
                <span className="account-icon">📒</span>
                <span className="account-info">{account.bank} {account.type}</span>
                <span className="account-number">{account.accountNumber}</span>
                <button className="copy-button" onClick={() => handleCopy(account.accountNumber)}>복사</button>
                {copiedAccount === account.accountNumber && <span className="copied-text">복사되었습니다</span>}
                <span className="account-balance">{account.balance}</span>
                <Link to={`/account/${account.accountNumber}`} className="detail-button">상세</Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="account-section">
        <div className="section-header" onClick={toggleSavingAccounts}>
          <span className="section-title">저축 계좌</span>
          <span className="toggle-icon">{showSavingAccounts ? '▼' : '▲'}</span>
        </div>
        {showSavingAccounts && (
          <div className="account-list">
            {savingAccounts.map((account, index) => (
              <div key={index} className="account-item">
                <span className="account-icon">📒</span>
                <span className="account-info">{account.bank} {account.type}</span>
                <span className="account-number">{account.accountNumber}</span>
                <button className="copy-button" onClick={() => handleCopy(account.accountNumber)}>복사</button>
                {copiedAccount === account.accountNumber && <span className="copied-text">복사되었습니다</span>}
                <span className="account-balance">{account.balance}</span>
                <Link to={`/account/${account.accountNumber}`} className="detail-button">상세</Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="account-section">
        <div className="section-header" onClick={toggleForeignAccounts}>
          <span className="section-title">외환 계좌</span>
          <span className="toggle-icon">{showForeignAccounts ? '▼' : '▲'}</span>
        </div>
        {showForeignAccounts && (
          <div className="account-list">
            {foreignAccounts.map((account, index) => (
              <div key={index} className="account-item">
                <span className="account-icon">📒</span>
                <span className="account-info">{account.bank} {account.type}</span>
                <span className="account-number">{account.accountNumber}</span>
                <button className="copy-button" onClick={() => handleCopy(account.accountNumber)}>복사</button>
                {copiedAccount === account.accountNumber && <span className="copied-text">복사되었습니다</span>}
                <span className="account-balance">{account.balance}</span>
                <Link to={`/account/${account.accountNumber}`} className="detail-button">상세</Link> 
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="button-container">
        <Link to="/AssetsAnalysis" className="button">자산 분석</Link>
        <Link to="/asset-calendar" className="button">뒤로</Link>
      </div>

      <Footer />
    </div>
  );
};

export default AssetsList;