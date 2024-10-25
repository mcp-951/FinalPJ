import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../../resource/css/admin/AdminList.css';
import Sidebar from '../Sidebar';

const AdminList = () => {
  const [users, setUsers] = useState([]); // 사용자 목록 상태
  const [loans, setLoans] = useState([]); // 대출 목록 상태
  const [products, setProducts] = useState([]); // 상품 목록 상태
  const token = localStorage.getItem('token'); // 인증 토큰 가져오기

  useEffect(() => {
    console.log("JWT Token: ", token);
    axios.get('http://localhost:8081/admin/getUserAndLoanData', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then((response) => {
        setUsers(response.data.users);
        setLoans(response.data.loans);
        setProducts(response.data.product); // product 데이터를 배열로 설정
    })
    .catch((error) => {
        console.error('데이터를 불러오는 중 오류 발생:', error);
    });
  }, []);

  // userNo로 사용자 ID와 이름을 찾는 함수
  const findUserById = (userNo) => {
    const user = users.find(u => u.userNo === userNo);
    return user ? { userId: user.userId, name: user.name } : { userId: '', name: '' };
  };

  // loanProductNo로 loanProductTitle을 찾는 함수
  const findProductTitle = (loanProductNo) => {
    const product = products.find(p => p.loanProductNo === loanProductNo);
    return product ? product.loanProductTitle : '';
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="main-content">
        <div className="admin-list-wrapper">
          <h2 className="admin-list-title">대출 리스트</h2>

          {/* 대출 목록 테이블 */}
          <table className="admin-table loan-table">
            <thead>
              <tr>
                <th>대출번호</th>
                <th>사용자 ID</th>
                <th>사용자 이름</th>
                <th>대출 가입일</th>
                <th>상환 방식</th>
                <th>대출 상품명</th>
                <th>대출 금액</th>
                <th>대출 이자</th>
                <th>이자율</th>
                <th>대출 기간</th>
                <th>상환 금액</th>
                <th>상환 이자</th>
                <th>대출 상태</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan, index) => {
                const user = findUserById(loan.userNo); // loan.userNo로 해당 user 찾기
                const productTitle = findProductTitle(loan.loanProductNo); // loanProductNo로 해당 productTitle 찾기
                return (
                  <tr key={index}>
                    <td>{loan.loanNo}</td>
                    <td>{user.userId}</td>
                    <td>{user.name}</td>
                    <td>{loan.loanJoinDate}</td>
                    <td>{loan.repaymentType}</td>
                    <td>{productTitle}</td>
                    <td>{loan.loanAmount}</td>
                    <td>{loan.loanInterest}</td>
                    <td>{loan.interestRate}</td>
                    <td>{loan.loanTern}</td>
                    <td>{loan.repaymentAmount}</td>
                    <td>{loan.repaymentInterest}</td>
                    <td>{loan.loanStatus}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminList;
