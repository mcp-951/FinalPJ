import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../../ApiService';
import '../../../../resource/css/product/AccessionE.css';

const DepositChap3 = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    productName: '', // 적금 상품명
    depositNo: '', // 적금 번호
    depositAccountNumber: '', // 적금 계좌번호 추가
    depositPassword: '' // 적금 비밀번호 추가
  });

  useEffect(() => {
    // sessionStorage에서 모든 값들을 가져와서 상태에 저장
    const storedProductName = sessionStorage.getItem('productName'); // 적금 상품명
    const storedDepositNo = sessionStorage.getItem('depositNo'); // 수정된 키 이름
    const storedDepositAccountNumber = sessionStorage.getItem('generatedDepositAccountNumber'); // 적금 계좌번호
    const storedDepositPassword = sessionStorage.getItem('depositPassword'); // 적금 계좌 비밀번호

    setData({
      productName: storedProductName || '', // 적금 상품명
      depositNo: storedDepositNo || '', // 수정된 키 이름으로 가져온 depositNo
      depositAccountNumber: storedDepositAccountNumber || '', // 적금 계좌번호 추가
      depositPassword: storedDepositPassword || '' // 적금 계좌 비밀번호 추가
    });
  }, []);

  const handleCompleteClick = async () => {
    const token = localStorage.getItem('token');
    const userNo = localStorage.getItem('userNo');
  
    if (token && userNo) {
      const depositData = {
        
        depositNo: data.depositNo,  // depositNo를 올바르게 전달
        depositAccountNumber: data.depositAccountNumber,
        depositPW: data.depositPassword  // depositPW로 맞춤
      };
  
      ApiService.saveDepJoin(depositData, token)
        .then((response) => {
          alert('가입이 완료되었습니다!');
          navigate('/'); // 홈으로 이동
        })
        .catch((error) => {
          console.error('DepositJoin 저장 실패:', error.response?.data || error.message);
          alert('가입에 실패하였습니다. 다시 시도해주세요.');
        });
    } else {
      alert('가입에 실패하였습니다. 로그인이 필요합니다.');
    }
  };
  // 비밀번호 처리 함수
  const maskPassword = (password) => {
    if (!password || password.length === 0) {
      return ''; // password가 없으면 빈 문자열 반환
    }
    if (password.length >= 2) {
      return password.substring(0, 2) + '**'; // 앞 2자리만 보여주고 나머지는 ** 처리
    }
    return password; // 비밀번호가 2자리 미만일 경우 그대로 반환
  };

  return (
    <div className="confirm-container">
      <h2>가입 확인 페이지</h2>
      <table className="confirm-table">
        <tbody>
          <tr>
            <td className="label-cell">상품명</td>
            <td>{data.productName}</td>
          </tr>
          <tr>
            <td className="label-cell">적금계좌번호</td>
            <td>{data.depositAccountNumber}</td> {/* 적금 계좌번호 출력 */}
          </tr>
          <tr>
            <td className="label-cell">적금계좌비밀번호</td>
            <td>{maskPassword(data.depositPassword)}</td> {/* 앞 2자리만 보여주고 나머지는 ** 처리 */}
          </tr>
        </tbody>
      </table>
      <div className="button-group">
        <a href="/DepositChapO1">
          <button className="prev-button">이전</button>
        </a>
        <button className="complete-button" onClick={handleCompleteClick}>완료</button>
      </div>
    </div>
  );
};

export default DepositChap3;
