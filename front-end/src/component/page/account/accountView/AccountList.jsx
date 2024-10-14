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
        // 기존 데이터 초기화
        setAccounts([]);
        setError(null);

        let depositCategory = 0;
        if (type === '예금') {
          depositCategory = 1; // 예금의 depositCategory 값
        } else if (type === '적금') {
          depositCategory = 3; // 적금의 depositCategory 값
        } else if (type === '외환') {
          depositCategory = 2; // 외환 depositCategory 값
        }

        const response = await axios.get(`http://localhost:8081/uram/category/${depositCategory}`, {
          headers: {
            'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
          }
        });

        // 응답 데이터에서 계좌 목록을 추출
        const accountList = response.data;

        // 중복 계좌 제거 (accountNumber 기준으로)
        const uniqueAccounts = accountList.filter((account, index, self) =>
          index === self.findIndex((acc) => acc.accountNumber === account.accountNumber)
        );

        setAccounts(uniqueAccounts); // 중복 제거된 계좌 목록 설정
      } catch (error) {
        setError('데이터를 가져오는 중 오류가 발생했습니다.');
        setAccounts([]); // 오류 발생 시 빈 배열로 설정
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
