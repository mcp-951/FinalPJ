import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from '../../../../ApiService';
import '../../../../resource/css/account/accountView/AccountList.css';
import Modal from './Modal';
import { FaEllipsisV } from 'react-icons/fa';
import axios from 'axios';
import localStorage from 'localStorage';

const AccountList = ({ type }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]); // 서버에서 가져온 데이터를 저장
  const [error, setError] = useState(null); // 에러 상태 추가
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8081/uram/account",{
            headers: {
                'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
            }
        })
        setAccounts(response.data); 
      } catch (error) {
        setError('데이터를 가져오는 중 오류가 발생했습니다.');
      }
    };

    fetchData(); 
  }, []);

  const filteredAccounts = accounts.filter(account => {
    if (type === '예금') {
      return account.productName.includes('예금');
    } else if (type === '적금') {
      return account.productName.includes('적금');
    } else if (type === '대출') {
      return account.productName.includes('대출');
    } else {
      return false;
    }
  });

  const handleMoreClick = (account) => {
    setSelectedAccount(account);
    setShowModal(true);
  };

  const handleTransferClick = (accountNumber) => {
    navigate(`/account/transfer?accountNumber=${accountNumber}`);
  };

  return (
    <div>
      <h5>{type} 계좌 조회 | 총 잔액: {filteredAccounts.reduce((acc, account) => acc + account.accountBalance, 0).toLocaleString()}원</h5>
      <div className="account-list-container">
        {error ? (
          <p>{error}</p>
        ) : filteredAccounts.length > 0 ? (
          filteredAccounts.map((account) => (
            <div className="account-list-box" key={account.accountNumber}>
              <div className="list-more-icon" onClick={() => handleMoreClick(account)}>
                <FaEllipsisV />
              </div>

              <div className="account-list-number-section">
                <Link to={`/account/detail/${account.accountNumber}`} className="account-list-number">
                  <span>계좌번호: {account.accountNumber} | 계좌명: {account.productName}</span>
                </Link>
                <div className="account-list-balance">잔액: {account.accountBalance.toLocaleString()}원</div>
              </div>

              {account.productName.includes('대출') === false && (
                <div className="account-list-buttons">
                  <Link to={`/account/detail/${account.accountNumber}`}>
                    <button className="list-detail-button">상세</button>
                  </Link>
                  <button className="list-transfer-button" onClick={() => handleTransferClick(account.accountNumber)}>이체</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>해당하는 계좌가 없습니다.</p>
        )}
      </div>

      {selectedAccount && (
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          account={selectedAccount} 
        />
      )}
    </div>
  );
};

export default AccountList;
