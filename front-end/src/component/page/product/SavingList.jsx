import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../resource/css/product/SavingList.css'; // 적금 리스트 스타일 파일

// 적금 상품 항목 컴포넌트 (SavingItem)
const SavingItem = ({ title, description, rate }) => {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    // 세션에 적금 상품 정보 저장
    sessionStorage.setItem('selectedSaving', JSON.stringify({ title, description, rate }));
    // 상세 페이지로 이동 (적금 상세 페이지 경로 설정)
    navigate('/SavingMain');
  };

  return (
    <div className="saving-item">
      <h3>{title}</h3>
      <p>{description}</p>
      <strong>연 {rate}%</strong>
      <div className="buttons">
        <button onClick={handleDetailClick}>상세보기</button>
        <button onClick={handleDetailClick}>가입하기</button>
      </div>
    </div>
  );
};

// 적금 상품 리스트 컴포넌트 (SavingList)
const SavingList = ({ savings }) => (
  <div className="saving-list">
    {savings.map((saving, index) => (
      <SavingItem
        key={index}
        title={saving.title}
        description={saving.description}
        rate={saving.rate}
      />
    ))}
  </div>
);

// 적금 메인 컴포넌트 (SavingMain)
const SavingMain = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // 예시 적금 상품 데이터
  const savingsPerPage = 3;
  const savings = [
    { title: '장기적금', description: '장기간 고정 금리로 안정적 이자', rate: 3.5 },
    { title: '단기적금', description: '짧은 기간 높은 이율을 제공', rate: 2.8 },
    { title: '자유적립식 적금', description: '언제든 추가 납입 가능한 자유적립식 적금', rate: 3.0 },
    { title: '정기적금', description: '매월 일정 금액을 적립하는 적금 상품', rate: 2.7 },
    { title: '우대금리 적금', description: '특정 조건 충족 시 우대금리 제공', rate: 3.7 },
  ];

  // 페이지 계산
  const totalPages = Math.ceil(savings.length / savingsPerPage);
  const startIndex = (currentPage - 1) * savingsPerPage;
  const currentSavings = savings.slice(startIndex, startIndex + savingsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app">
      <h1>적금 상품 리스트</h1>
      <SavingList savings={currentSavings} />
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
      >
        {index + 1}
      </button>
    ))}
  </div>
);

export default SavingMain;
