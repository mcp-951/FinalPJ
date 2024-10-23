import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar'; 
import '../../../../resource/css/admin/AdTaxList.css'; 

const AdTaxList = () => {
  const [taxes, setTaxes] = useState([]);
  const [filteredTaxes, setFilteredTaxes] = useState([]); 
  const [userNames, setUserNames] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:8081/tax/list', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      const reversedData = response.data.reverse(); 
      setTaxes(reversedData);
      setFilteredTaxes(reversedData);

      reversedData.forEach(tax => {
        axios.get(`http://localhost:8081/tax/name/${tax.userNo}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(userResponse => {
          setUserNames(prevUserNames => ({
            ...prevUserNames,
            [tax.userNo]: userResponse.data, 
          }));
        })
        .catch(error => console.error('Error fetching userName:', error));
      });
    })
    .catch(error => console.error('Error fetching tax data:', error));
  }, [token]);

  useEffect(() => {
    let filteredData = taxes;

    if (selectedCategory) {
      filteredData = filteredData.filter(tax => tax.taxCategory === selectedCategory);
    }

    setFilteredTaxes(filteredData);
    setCurrentPage(1); 
  }, [selectedCategory, taxes]);

  const handleEdit = (taxNo, taxCategory) => {
    navigate(`/adTaxEdit/${taxNo}`, { state: { taxCategory } }); 
  };

  const handleInsert = () => {
    navigate('/adTaxInsert'); 
  };

  const totalPages = Math.ceil(filteredTaxes.length / itemsPerPage);
  const currentTaxes = filteredTaxes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="AdTaxList-page-container">
      <Sidebar className="AdTaxList-sidebar" /> 
      <div className="AdTaxList-container"> 
        <h1 className="AdTaxList-title">공과금 리스트</h1>

        <div className="AdTaxList-filter-container">
          <label>세금 종류: </label>
          <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory} className="AdTaxList-filter-select">
            <option value="">모든 세금</option>
            <option value="water">수도</option>
            <option value="electro">전기</option>
          </select>
        </div>

        <table className="AdTaxList-table">
          <thead>
            <tr>
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

              const no = filteredTaxes.length - ((currentPage - 1) * itemsPerPage + index);

              return (
                <tr key={tax.taxNo}>
                  <td>{no}</td> 
                  <td>{userNames[tax.userNo] || '로딩 중...'}</td>
                  <td>{tax.taxNo}</td>
                  <td>{tax.taxDeadLine}</td>
                  <td>{paymentAmount.toLocaleString()} 원</td>
                  <td>{tax.taxWriteDate}</td>
                  <td>{tax.taxState ? tax.taxState : '미납'}</td>
                  <td>{tax.taxCategory === 'water'? '수도세':'전기세'}</td>
                  <td>
                    <button className="AdTaxList-edit-button" onClick={() => handleEdit(tax.taxNo, tax.taxCategory)}>
                      상세
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="AdTaxList-pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            이전
          </button>
          <span className="AdTaxList-page-info">{currentPage} / {totalPages}</span> {/* 페이지 정보 추가 */}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            다음
          </button>
        </div>

        <div className="AdTaxList-create-button-container-right">
          <button className="AdTaxList-create-button" onClick={handleInsert}>
            공과금 생성
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdTaxList;
