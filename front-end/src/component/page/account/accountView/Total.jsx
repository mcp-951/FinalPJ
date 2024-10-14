import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 추가
import axios from 'axios';
import '../../../../resource/css/account/accountView/Total.css';

const Total = () => {
  const [accounts, setAccounts] = useState([]); // 계좌 목록을 저장할 상태
  const [userName, setUserName] = useState(''); // 사용자 이름을 저장할 상태
  const token = localStorage.getItem("token"); // localStorage에서 token 가져오기
  const userNo = localStorage.getItem("userNo"); // localStorage에서 userNo 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 추가

  // 로그인 여부 확인
  useEffect(() => {
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login'); // 로그인 페이지로 리다이렉트
    }
  }, [token, navigate]);

  // 계좌 정보 및 사용자 이름을 가져오는 함수
  const fetchData = async () => {
    try {
      // 전체 계좌와 사용자 이름을 함께 가져오는 API 호출
      const response = await axios.get(`http://localhost:8081/uram/users/${userNo}/accounts`, {
        headers: {
          'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
        }
      });

      // API 응답에서 사용자 이름과 계좌 정보를 가져옴
      const { userName, accounts } = response.data;

      // 중복 계좌 제거 (계좌번호 기준으로)
      const uniqueAccounts = accounts.filter((account, index, self) =>
        index === self.findIndex((acc) => acc.accountNumber === account.accountNumber)
      );

      setUserName(userName); // 사용자 이름 설정
      setAccounts(uniqueAccounts); // 계좌 목록 설정
    } catch (error) {
      console.error('데이터를 가져오는 중 오류 발생:', error);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 데이터 가져오기
  useEffect(() => {
    if (userNo && token) {
      fetchData(); // userName과 계좌 데이터 가져오기
    } else {
      console.error('userNo 또는 token이 없습니다.');
    }
  }, [userNo, token]);

  // 날짜를 포맷하는 함수
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="total-account-container">
      <h5>{userName}님 | 총 잔액: {(accounts.reduce((sum, acc) => sum + (acc.accountBalance || 0), 0)).toLocaleString()}원</h5>

      <div className="total-account-section">
        <h6>전체 계좌 ({accounts.length} 계좌)</h6>
        <table className="total-account-table">
          <thead>
            <tr>
              <th>계좌번호</th>
              <th>예금명</th> {/* productName 대신 deposit 테이블의 depositName 사용 */}
              <th>개설일</th>
              <th>만기일</th>
              <th>잔액</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.accountNumber}>
                <td><Link to={`/account/detail/${account.accountNumber}`}>{account.accountNumber}</Link></td>
                <td>{account.depositName}</td> {/* deposit 테이블의 depositName 사용 */}
                <td>{formatDate(account.accountOpen)}</td>
                <td>{formatDate(account.accountClose)}</td> {/* accountClose 필드 사용 */}
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
