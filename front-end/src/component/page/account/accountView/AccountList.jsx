import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../../../resource/css/account/accountView/AccountList.css';
import Modal from './Modal';
import { FaEllipsisV } from 'react-icons/fa';

const AccountList = ({ type }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const navigate = useNavigate();

  const accounts = [
    { number: '123-456-789', name: '예금계좌', type: '예금', balance: '100,000원' },
    { number: '234-567-890', name: '적금계좌', type: '적금', balance: '100,000원' },
    { number: '345-678-901', name: '대출계좌', type: '대출', balance: '200,000원' }
  ];

  const filteredAccounts = accounts.filter(account => account.type === type);

  const handleMoreClick = (account) => {
    setSelectedAccount(account); // 계좌 객체를 저장
    setShowModal(true);
  };

  const handleTransferClick = (accountNumber) => {
    navigate(`/account/transfer?accountNumber=${accountNumber}`);
  };

  return (
    <div>
      <h5>{type} 계좌 조회 | 총 잔액: {filteredAccounts.reduce((acc, account) => acc + parseInt(account.balance.replace(/[^0-9]/g, '')), 0).toLocaleString()}원</h5>
      <div className="account-list-container">
        {filteredAccounts.length > 0 ? (
          filteredAccounts.map((account) => (
            <div className="account-list-box" key={account.number}>
              <div className="list-more-icon" onClick={() => handleMoreClick(account)}>
                <FaEllipsisV />
              </div>

              <div className="account-list-number-section">
                <Link to={`/account/detail/${account.number}`} className="account-list-number">
                  <span>계좌번호: {account.number} | 계좌명: {account.name}</span>
                </Link>
                <div className="account-list-balance">잔액: {account.balance}</div>
              </div>

              {/* 대출 계좌가 아닌 경우에만 버튼 표시 */}
              {account.type !== '대출' && (
                <div className="account-list-buttons">
                  <Link to={`/account/detail/${account.number}`}>
                    <button className="list-detail-button">상세</button>
                  </Link>
                  <button className="list-transfer-button" onClick={() => handleTransferClick(account.number)}>이체</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>해당하는 계좌가 없습니다.</p>
        )}
      </div>

      {/* Modal에 선택된 계좌의 정보를 전달 */}
      {selectedAccount && (
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          account={selectedAccount} // 선택된 계좌 정보 전달
        />
      )}
    </div>
  );
};

export default AccountList;
