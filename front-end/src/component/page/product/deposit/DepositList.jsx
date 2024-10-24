import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from 'component/ApiService'; // API 서비스 임포트
import '../../../../resource/css/product/DepositList.css'; // CSS 파일 경로

const DepositItem = ({ depositNo, depositName, depositMinimumRate, depositMaximumRate, depositMinimumDate, depositMaximumDate, depositMinimumAmount, depositMaximumAmount, depositContent, depositCharacteristic, depositCategory, depositState }) => {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    // 세션에 상품 정보 저장
    sessionStorage.setItem(
      'selectedDeposit',
      JSON.stringify({ depositNo, depositName, depositMinimumRate, depositMaximumRate, depositMinimumDate, depositMaximumDate, depositMinimumAmount, depositMaximumAmount, depositContent, depositCharacteristic, depositCategory, depositState })
    );
    navigate('/DepositMain');
};

  return (
    <div className="DepositList-item">
      <div className="DepositList-text">
        <h3>{depositName}</h3>
        <p>{depositContent}</p>
        <p>최대 {depositMaximumDate}개월</p>
        <p>최대 {depositMaximumRate}%</p>
      </div>
      <div className="DepositList-buttons">
        <button onClick={handleDetailClick} className="DepositList-detail-btn">상세보기</button>
        <button onClick={handleDetailClick} className="DepositList-join-btn">가입하기</button>
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


const DepositList1 = () => {
  const [deposits, setDeposits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const depositsPerPage = 4; // 페이지당 4개의 상품 표시

  useEffect(() => {
    ApiService.fetchDepositProductsPaged(currentPage - 1, depositsPerPage)
      .then(response => {
        setDeposits(response.data.content); // 현재 페이지의 상품 목록을 설정
        setTotalPages(response.data.totalPages); // 총 페이지 수 설정
      })
      .catch(error => {
        console.error('Error fetching deposit products:', error);
      });
  }, [currentPage]); // currentPage가 변경될 때마다 API를 다시 호출

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
    <div className="DepositList-main-container"> {/* 상위 컨테이너 */}
      <div className="DepositList-app">
        <h1 className="DepositList-title">⊙ URAM 예금＆적금 상품 ⊙</h1>
        <DepositList deposits={deposits} />
        <div className="DepositList-pagination">
          <button onClick={handlePreviousPage} disabled={currentPage === 1} className="DepositList-prev-next">
            이전
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages} className="DepositList-prev-next">
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositList1;
