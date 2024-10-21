import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../../../resource/css/admin/TaxList.css'; // CSS 파일 추가

const AdTaxList = () => {
  const [taxes, setTaxes] = useState([]);
  const [filteredTaxes, setFilteredTaxes] = useState([]); // 필터링된 세금 목록
  const [userNames, setUserNames] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(''); // 선택한 세금 종류
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // 토큰 가져오기

  // 세금 리스트 가져오기
  useEffect(() => {
    axios.get('http://localhost:8081/tax/list', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      const reversedData = response.data.reverse(); // 역순 정렬
      setTaxes(reversedData);
      setFilteredTaxes(reversedData);

      // 각 세금의 userNo를 사용하여 userName 가져오기
      reversedData.forEach(tax => {
        axios.get(`http://localhost:8081/tax/name/${tax.userNo}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(userResponse => {
          setUserNames(prevUserNames => ({
            ...prevUserNames,
            [tax.userNo]: userResponse.data, // userName 저장
          }));
        })
        .catch(error => console.error('Error fetching userName:', error));
      });
    })
    .catch(error => console.error('Error fetching tax data:', error));
  }, [token]);

  // 필터링 로직 (세금 종류 기반 필터링)
  useEffect(() => {
    let filteredData = taxes;

    if (selectedCategory) {
      filteredData = filteredData.filter(tax => tax.taxCategory === selectedCategory);
    }

    setFilteredTaxes(filteredData);
    setCurrentPage(1); // 필터링 시 첫 페이지로 이동
  }, [selectedCategory, taxes]);

  const handleEdit = (taxNo, taxCategory) => {
    navigate(`/adTaxEdit/${taxNo}`, { state: { taxCategory } }); // 세금 종류를 state로 넘김
  };

  const handleInsert = () => {
    navigate('/adTaxInsert'); // 공과금 생성 페이지로 이동
  };

  const totalPages = Math.ceil(filteredTaxes.length / itemsPerPage);
  const currentTaxes = filteredTaxes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="tax-list-container">
      <h1 className="tax-list-title">공과금 리스트</h1>

      {/* 세금 종류 셀렉트 박스 */}
      <div className="filter-container" style={{ marginBottom: '20px' }}>
        <label>세금 종류: </label>
        <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory} className="filter-select">
          <option value="">모든 세금</option>
          <option value="water">수도</option>
          <option value="electro">전기</option>
        </select>
      </div>

      <table className="tax-table">
        <thead>
          <tr className="tax-table-header">
            <th>No</th>
            <th>회원명</th>
            <th>관리번호</th>
            <th>납부기한</th>
            <th>납부금액</th>
            <th>명세서 발급일</th>
            <th>납부여부</th>
            <th>세금 종류</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {currentTaxes.map((tax, index) => {
            const totalFee = tax.fee1 + tax.fee2 + tax.fee3;
            const totalBasicFee = tax.basicFee1 + tax.basicFee2 + tax.basicFee3;
            const paymentAmount = totalFee + totalBasicFee;

            // No 번호를 역순으로 표시
            const no = filteredTaxes.length - ((currentPage - 1) * itemsPerPage + index);

            return (
              <tr key={tax.taxNo} className="tax-table-row">
                <td>{no}</td> {/* No를 역순으로 출력 */}
                <td>{userNames[tax.userNo] || '로딩 중...'}</td>
                <td>{tax.taxNo}</td>
                <td>{tax.taxDeadLine}</td>
                <td>{paymentAmount.toLocaleString()} 원</td>
                <td>{tax.taxWriteDate}</td>
                <td>{tax.taxState ? tax.taxState : '미납'}</td>
                <td>{tax.taxCategory}</td>
                <td>
                  <button className="edit-button" onClick={() => handleEdit(tax.taxNo, tax.taxCategory)}>
                    상세
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={currentPage === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* 공과금 생성 버튼 */}
      <div className="create-button-container">
        <button className="create-button" onClick={handleInsert}>
          공과금 생성
        </button>
      </div>
    </div>
  );
};

export default AdTaxList;
