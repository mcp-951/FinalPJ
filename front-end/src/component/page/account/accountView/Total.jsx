import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../../resource/css/account/accountView/Total.css';

const Total = () => {
  const [accounts, setAccounts] = useState([]); // 계좌 목록을 저장할 상태
  const [userName, setUserName] = useState(''); // 사용자 이름을 저장할 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const itemsPerPage = 3; // 페이지당 계좌 수
  const token = localStorage.getItem("token")?.trim();
  const userNo = localStorage.getItem("userNo");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/uram/accounts`, {
        headers: {
          'Authorization': `Bearer ${token.trim()}`
        }
      });

      const { userName, accounts } = response.data;

      const uniqueAccounts = accounts.filter((account, index, self) =>
        index === self.findIndex((acc) => acc.accountNumber === account.accountNumber)
      );

      if (uniqueAccounts.length === 0) {
        alert('등록된 계좌가 없습니다. 계좌 생성페이지로 이동합니다.');
        navigate('/deposit-list');
      } else {
        setUserName(userName);
        setAccounts(uniqueAccounts);
      }
    } catch (error) {
      alert('등록된 계좌가 없습니다. 계좌 생성페이지로 이동합니다.');
      navigate('/deposit-list');
      console.error('데이터를 가져오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    if (userNo && token) {
      fetchData();
    } else {
      console.error('userNo 또는 token이 없습니다.');
      navigate('/login');
    }
  }, [userNo, token]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // 페이지네이션을 위한 계산
  const totalPages = Math.ceil(accounts.length / itemsPerPage);
  const currentItems = accounts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="total-account-container">
      <h5 className="header-text">{userName}님 | 총 잔액: {(accounts.reduce((sum, acc) => sum + (acc.accountBalance || 0), 0)).toLocaleString()}원</h5>

      <div className="total-account-section">
        <h6 className="sub-header-text">전체 계좌 ({accounts.length} 계좌)</h6>
        <div className="account-card-container">
          {currentItems.map((account) => (
            <div className="account-card" key={account.accountNumber}>
              <h3 className="account-number"><Link to={`/account/detail/${account.accountNumber}`}>{account.accountNumber}</Link></h3>
              <p className="deposit-name">{account.depositName}</p>
              <p className="open-date">개설일: {formatDate(account.accountOpen)}</p>
              <p className="close-date">만기일: {formatDate(account.accountClose)}</p>
              <p className="balance">잔액: {(account.accountBalance || 0).toLocaleString()}원</p>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>이전</button>
          <span>{currentPage} / {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>다음</button>
        </div>
      </div>
    </div>
  );

};

export default Total;
