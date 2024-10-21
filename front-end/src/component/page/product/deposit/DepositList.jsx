import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from 'component/ApiService'; // API 서비스 임포트
import '../../../../resource/css/product/DepositList.css';

// 상품 항목 컴포넌트 (DepositItem)
const DepositItem = ({ depositNo, depositName, depositMinimumRate, depositMaximumRate, depositMinimumDate, depositMaximumDate, depositMinimumAmount, depositMaximumAmount, depositContent, depositCharacteristic, depositCategory, depositState }) => {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    // 세션에 상품 정보 저장
    sessionStorage.setItem(
      'selectedDeposit',
      JSON.stringify({ depositNo, depositName, depositMinimumRate, depositMaximumRate, depositMinimumDate, depositMaximumDate, depositMinimumAmount, depositMaximumAmount, depositContent, depositCharacteristic, depositCategory, depositState })
    );

    // 상품 이름에 "입출금"이 포함된 경우 다른 페이지로 이동
    if (depositName.includes("입출금")) {
      navigate('/ReceivedPaidMain');
    } else {
      navigate('/DepositMain');
    }
  };

  return (
    <div className="deposit-item">
      <div className="deposit-text">
        <div>{depositName}</div>
        <div>afsdfads{depositCategory}</div>
        <div>{depositContent}</div>
        <div>최대 {depositMaximumDate}개월</div>
        <div>최대 {depositMaximumRate}%</div>
      </div>
      <div className="buttons">
        <button onClick={handleDetailClick}>상세보기</button>
        <button onClick={handleDetailClick}>가입하기</button>
      </div>
    </div>
  );
};

// 상품 리스트 컴포넌트 (DepositList)
const DepositList = ({ deposits }) => (
  <div className="deposit-list">
    {deposits.map((deposit, index) => (
      <DepositItem
        key={index}
        depositNo={deposit.depositNo}
        depositName={deposit.depositName}
        depositMinimumRate={deposit.depositMinimumRate}
        depositMaximumRate={deposit.depositMaximumRate}
        depositMinimumDate={deposit.depositMinimumDate}
        depositMaximumDate={deposit.depositMaximumDate}
        depositMinimumAmount={deposit.depositMinimumAmount}
        depositMaximumAmount={deposit.depositMaximumAmount}
        depositContent={deposit.depositContent}
        depositCharacteristic={deposit.depositCharacteristic}
        depositCategory={deposit.depositCategory}
      />
    ))}
  </div>
);

// 메인 컴포넌트 (DepositList1)
const DepositList1 = () => {
  const [deposits, setDeposits] = useState([]);  // 상품 데이터를 저장하는 state
  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지
  const [totalPages, setTotalPages] = useState(0);  // 총 페이지 수
  const depositsPerPage = 8;  // 페이지당 상품 개수

  useEffect(() => {
    // API를 호출하여 적금 상품 데이터 가져오기
    ApiService.fetchDepositProductsPaged(currentPage - 1, depositsPerPage)
      .then(response => {
        console.log('API Response:', response.data);  // 콘솔에 응답 출력
        setDeposits(response.data.content);  // 상품 데이터 설정
        setTotalPages(response.data.totalPages);  // 총 페이지 수 설정
      })
      .catch(error => {
        console.error('Error fetching deposit products:', error);
      });
  }, [currentPage]);  // currentPage가 변경될 때마다 API 호출

  const handlePageChange = (page) => {
    setCurrentPage(page);  // 페이지 변경
  };

  return (
    <div className="app">
      <h1>상품 리스트</h1>
      <DepositList deposits={deposits} />
      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
    </div>
  );
};

// 페이지네이션 컴포넌트 (Pagination)
const Pagination = ({ totalPages, currentPage, onPageChange }) => (
  <div className="pagination">
    {[...Array(totalPages)].map((_, index) => (
      <button
        key={index}
        className={currentPage === index + 1 ? 'active' : ''}
        onClick={() => onPageChange(index + 1)}
        disabled={currentPage === index + 1}  // 현재 페이지는 비활성화
      >
        {index + 1}
      </button>
    ))}
  </div>
);

export default DepositList1;
