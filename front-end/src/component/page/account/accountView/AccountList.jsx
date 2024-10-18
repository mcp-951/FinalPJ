import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../../resource/css/account/accountView/AccountList.css';
import Modal from './Modal';
import { FaEllipsisV } from 'react-icons/fa';

const AccountList = ({ type }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]); // 서버에서 가져온 데이터를 저장
  const [error, setError] = useState(null); // 에러 상태 추가
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userNo = localStorage.getItem("userNo"); // localStorage에서 userNo 가져오기

  // 로그인 확인
  useEffect(() => {
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login'); // 로그인 페이지로 리다이렉트
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setAccounts([]);
        setError(null);
    
        let depositCategory = 0;
        if (type === '예금') {
          depositCategory = 1;
        } else if (type === '적금') {
          depositCategory = 3;
        }
    
        const response = await axios.get(`http://localhost:8081/uram/category/${depositCategory}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            userNo: userNo  // userNo를 쿼리 파라미터로 포함
          }
        });
    
        const accountList = response.data;

        // Set을 사용하여 중복된 계좌 번호 제거
        const uniqueAccounts = [];
        const seenAccounts = new Set();

        accountList.forEach(account => {
          if (!seenAccounts.has(account.accountNumber)) {
            uniqueAccounts.push(account);
            seenAccounts.add(account.accountNumber);
          }
        });

        setAccounts(uniqueAccounts);
      } catch (error) {
        console.error('계좌 불러오기 실패:', error);
        setError('등록된 계좌가 없습니다.');
        setAccounts([]);  // 오류 발생 시 빈 배열 설정
      }
    };
    
    // type이 변경될 때마다 fetchData 호출
    if (type && token && userNo) {
      fetchData();
    }
  }, [type, token, userNo]); // type이 변경될 때마다 데이터 다시 가져오기

  const handleMoreClick = (account) => {
    setSelectedAccount(account);
    setShowModal(true);
  };

  const handleTransferClick = (accountNumber) => {
    navigate('/account/transfer', {
      state: {
        accountNumber: accountNumber,
      }
    });
  };

  return (
    <div>
      <h5>{type} 계좌 조회 | 총 잔액: {accounts.reduce((acc, account) => acc + (account.accountBalance || 0), 0).toLocaleString()}원</h5>
      <div className="account-list-container">
        {error ? (
          <p>{error}</p>
        ) : accounts.length > 0 ? (
          accounts.map((account) => (
            <div className="account-list-box" key={account.accountNumber}>
              <div className="list-more-icon" onClick={() => handleMoreClick(account)}>
                <FaEllipsisV />
              </div>

              <div className="account-list-number-section">
                <Link to={`/account/detail/${account.accountNumber}`} className="account-list-number">
                  <span>계좌번호: {account.accountNumber} | 계좌명: {account.depositName}</span>
                </Link>
                <div className="account-list-balance">잔액: {account.accountBalance.toLocaleString()}원</div>
              </div>

              <div className="account-list-buttons">
                <Link to={`/account/detail/${account.accountNumber}`}>
                  <button className="list-detail-button">상세</button>
                </Link>
                <button className="list-transfer-button" onClick={() => handleTransferClick(account.accountNumber)}>이체</button>
              </div>
            </div>
          ))
        ) : (
          <p>등록된 계좌가 없습니다.</p>
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
