import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar'; // 사이드바 추가
import '../../../../resource/css/admin/SavingsProduct.css'; // CSS 파일 추가

const ADLoanProduct = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);  // 대출 상품 목록 상태 관리
  const [searchField, setSearchField] = useState('전체');  // 검색 필드 상태 관리
  const [searchTerm, setSearchTerm] = useState('');  // 검색어 상태 관리
  const [displayCount, setDisplayCount] = useState(10);  // 페이지당 표시할 상품 수 상태 관리
  const token = localStorage.getItem("token");

  // 대출 상품 목록 불러오기
  const fetchLoans = () => {
    axios.get('http://localhost:8081/admin/loans', {
      headers: {
        'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
      }
    })
    .then((response) => {
      setLoans(response.data);  // 불러온 데이터를 loans 상태로 설정
    })
    .catch((error) => {
      console.error('대출 상품 목록을 불러오는 중 오류 발생:', error);
    });
  };

  // 페이지가 처음 로드될 때 대출 상품 목록을 가져옴
  useEffect(() => {
    fetchLoans();
  }, []);

  // 수정 버튼 클릭 시 수정 페이지로 이동
  const handleEdit = (loan) => {
    navigate('/admin/adEditLoanProduct', { state: { loan } }); // 상품 정보를 상태로 전달하여 수정 페이지로 이동
  };

  // 삭제 버튼 클릭 시 loanState를 'Closed'로 변경
  const handleDelete = async (loanNo) => {
    try {
      await axios.put(`http://localhost:8081/admin/deleteLoan/${loanNo}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('해당 대출 상품이 삭제되었습니다.');
      fetchLoans(); // 삭제 후 대출 상품 목록 다시 불러오기
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
      alert('삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 등록 버튼 클릭 시 RegisterLoanProduct 페이지로 이동
  const handleRegister = () => {
    navigate('/admin/adRegisterLoanProduct');
  };

  // 검색 및 필터링 로직
  const filteredList = loans.filter(loan => {
    if (searchField === '상품명') {
      return loan.loanProductTitle.toLowerCase().includes(searchTerm.toLowerCase()); // 상품명에서 검색
    } else if (searchField === '최대 한도') {
      return loan.loanMaxLimit.toString().includes(searchTerm); // 최대 한도에서 검색
    } else if (searchField === '최소 한도') {
      return loan.loanMinLimit.toString().includes(searchTerm); // 최소 한도에서 검색
    } else if (searchField === '최소 금리') {
      return loan.minInterestRate.toString().includes(searchTerm); // 최소 금리에서 검색
    }
    return true;  // 전체를 선택한 경우 필터링 없이 전체 목록 반환
  }).slice(0, displayCount);  // 표시 개수만큼 잘라내기

  return (
    <div className="app-container">
      <Sidebar /> {/* 사이드바 추가 */}
      <div className="alog-main-content">
        <div className="loan-product-container">
          <h2>대출 상품 관리</h2>
          <div className="search-controls">
            <div className="search-bar">
              <select value={searchField} onChange={(e) => setSearchField(e.target.value)}>
                <option value="전체">전체</option>
                <option value="상품명">상품명</option>
                <option value="최대 한도">최대 한도</option>
                <option value="최소 한도">최소 한도</option>
                <option value="최소 금리">최소 금리</option>
              </select>
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button>검색</button>
            </div>
            <button onClick={handleRegister}>등록</button>
          </div>

          <table className="product-table">
            <thead>
              <tr>
                <th>노출순서</th>
                <th>상품명</th>
                <th>최대 한도</th>
                <th>최소 한도</th>
                <th>최대 기간</th>
                <th>최소 기간</th>
                <th>최소 금리</th>
                <th>최대 금리</th>
                <th>중도 상환 수수료</th>
                <th>최소 신용등급</th>
                <th>상태</th>
                <th>수정</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((loan, index) => (
                <tr key={loan.loanProductNo}>
                  <td>{index + 1}</td>
                  <td>{loan.loanProductTitle}</td>
                  <td>{loan.loanMaxLimit}</td>
                  <td>{loan.loanMinLimit}</td>
                  <td>{loan.loanMaxTern}</td>
                  <td>{loan.loanMinTern}</td>
                  <td>{loan.minInterestRate}</td>
                  <td>{loan.maxInterestRate}</td>
                  <td>{loan.earlyRepaymentFee}</td>
                  <td>{loan.minCreditScore}</td>
                  <td>{loan.viewPoint}</td>
                  <td><button onClick={() => handleEdit(loan)}>수정</button></td>
                  <td><button onClick={() => handleDelete(loan.loanProductNo)}>삭제</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ADLoanProduct;
