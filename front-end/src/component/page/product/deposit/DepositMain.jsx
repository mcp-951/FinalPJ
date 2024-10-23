import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 가져오기
import 'resource/css/product/DepositMain.css';

const DepositMain = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [depositData, setDepositData] = useState(null);

  useEffect(() => {
    // sessionStorage에서 저장된 상품 정보를 불러오기
    const storedDeposit = sessionStorage.getItem('selectedDeposit');
    if (storedDeposit) {
      setDepositData(JSON.parse(storedDeposit)); // JSON 데이터를 객체로 변환 후 저장
    }
  }, []);

  const goToDepositList = () => {
    navigate('/DepositList'); // DepositList로 이동
  };

  const goToDepositTermination = () => {
    // 토큰 확인
    const token = localStorage.getItem('token');
    if (!token) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate('/login'); // 토큰이 없으면 로그인 페이지로 이동
      return;
    }
    // 토큰이 있는 경우만 다음 페이지로 이동
    if (depositData) {
      navigate('/DepositTerms', { state: { depositCategory: depositData.depositCategory } });
    }
  };

  return (
    <div className="loan-product-detail">
      {/* 상단 섹션 */}
      <div className="loan-header">
        <div className="loan-title-section">
          <h2>{depositData ? depositData.depositName : 'Loading...'}</h2>
          <p>{depositData ? depositData.depositContent : '상품 정보를 불러오는 중입니다...'}</p>
        </div>
        <div className="loan-details">
          {depositData ? (
            <div className="loan-info">
              <div className="loan-info-item">
                <p>기간</p>
                <p>{depositData.depositMinimumDate} ~ {depositData.depositMaximumDate}개월</p>
              </div>
              <div className="loan-info-item">
                <p>이자율</p>
                <p>{depositData.depositMinimumRate}% ~ {depositData.depositMaximumRate}%</p>
              </div>
              <div className="loan-info-item">
                <p>가입금액</p>
                <p>{depositData.depositMinimumAmount*0.0001} ~ {depositData.depositMaximumAmount*0.0001}만원</p>
              </div>
            </div>
          ) : (
            <p>상품 정보를 불러오는 중입니다...</p>
          )}
        </div>
        <div className="loan-buttons">
          <button onClick={goToDepositList}>목록으로</button>
          <button onClick={goToDepositTermination}>가입하기</button>
        </div>
      </div>

      {/* 하단 설명 섹션 */}
      {depositData && (
        <div className="loan-description">
          <h3>상품 설명</h3>
          <table>
            <tbody>
              <tr>
                <th>상품특징</th>
                <td>{depositData.depositCharacteristic}</td>
              </tr>
              <tr>
                <th>가입대상</th>
                <td>우람은행 고객 누구나</td>
              </tr>
              <tr>
                <th>계약기간</th>
                <td>{depositData.depositMinimumDate}개월 ~ {depositData.depositMaximumDate}개월</td>
              </tr>
              <tr>
                <th>가입금액</th>
                <td>{depositData.depositMinimumAmount*0.0001}만원 ~ {depositData.depositMaximumAmount*0.0001}만원</td>
              </tr>
              <tr>
                <th>이율</th>
                <td>{depositData.depositMinimumRate}% ~ {depositData.depositMaximumRate}%</td>
              </tr>
              <tr>
                <th>만기시 수령방법</th>
                <td>만기일이 지난 후 10일 이내 영업점에서 수령가능</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DepositMain;
