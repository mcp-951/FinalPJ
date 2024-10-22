import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../../../resource/css/admin/AdTaxInsert.css'; // CSS 파일 추가
import Sidebar from '../Sidebar'; // 사이드바 추가

const AdTaxInsert = () => {
  const [tax, setTax] = useState({
    fee1: 0,
    fee2: 0,
    fee3: 0,
    basicFee1: 0,
    basicFee2: 0,
    basicFee3: 0,
    taxDeadLine: '',
    taxWriteDate: '',
    taxState: 'N',
    taxCategory: 'water',
    userNo: '',
  });

  const [userIds, setUserIds] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const categories = [
    { value: 'water', label: '수도' },
    { value: 'electro', label: '전기' }
  ];

  const feeNames = {
    water: ['상수도 요금', '하수도 요금', '지하수 요금'],
    electro: ['세대전기료', '공동전기료', 'TV수신료']
  };

  useEffect(() => {
    axios.get('http://localhost:8081/tax/users/role-user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      setUserIds(response.data);
    })
    .catch(error => console.error('Error fetching userIds:', error));
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTax({ ...tax, [name]: value });
  };

  const handleUserChange = (e) => {
    const selectedUserId = e.target.value;
    axios.get(`http://localhost:8081/tax/userNo/${selectedUserId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const userNo = response.data;
      setTax({ ...tax, userNo });
    })
    .catch(error => console.error('Error fetching userNo:', error));
  };

  const totalFee = parseFloat(tax.fee1) + parseFloat(tax.fee2) + parseFloat(tax.fee3);
  const totalBasicFee = parseFloat(tax.basicFee1) + parseFloat(tax.basicFee2) + parseFloat(tax.basicFee3);
  const totalAmount = totalFee + totalBasicFee;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!tax.userNo) {
      alert('사용자를 선택해주세요.');
      return;
    }

    if (!tax.taxDeadLine) {
      alert('납부기한을 선택해주세요.');
      return;
    }

    const today = new Date();
    const selectedDate = new Date(tax.taxDeadLine);
    if (selectedDate < today) {
      alert('지난 날짜는 납부기한으로 설정할 수 없습니다.');
      return;
    }

    if (parseFloat(tax.fee1) <= 0 || parseFloat(tax.fee2) <= 0 || parseFloat(tax.fee3) <= 0 ||
        parseFloat(tax.basicFee1) <= 0 || parseFloat(tax.basicFee2) <= 0 || parseFloat(tax.basicFee3) <= 0) {
      alert('요금과 기본요금은 1 이상의 값을 입력해야 합니다.');
      return;
    }

    const taxData = { ...tax, totalAmount, totalFee, totalBasicFee };

    axios.post('http://localhost:8081/tax/insert', taxData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      navigate('/adTaxList');
    })
    .catch((error) => console.error('Error inserting tax:', error));
  };

  return (
    <div className="AdTaxInsert-page-container"> {/* 전체 페이지 컨테이너 */}
      <Sidebar className="AdTaxInsert-sidebar" /> {/* 사이드바 추가 */}
      <div className="AdTaxInsert-content"> {/* 콘텐츠 영역 */}
        <form onSubmit={handleSubmit} className="AdTaxInsert-form">
          <h1 className="AdTaxInsert-title">청구서 작성</h1>

          {/* 테이블을 폼 상단에 배치 */}
          <div className="AdTaxInsert-summary-table">
            <table className="table-bordered">
              <thead>
                <tr>
                  <th>관리번호</th>
                  <th>납부기한</th>
                  <th>납부금액</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>-</td>
                  <td>~ {tax.taxDeadLine}</td>
                  <td>{totalAmount.toLocaleString()} 원</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 사용요금 및 기본요금 입력 부분 */}
          <div className="AdTaxInsert-fee-table">
            <table className="table-bordered">
              <thead>
                <tr>
                  <th>요금내역</th>
                  <th>사용요금</th>
                  <th>기본요금</th>
                  <th>납부금액</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{feeNames[tax.taxCategory][0]}</td>
                  <td><input type="number" name="fee1" value={tax.fee1} onChange={handleChange} className="AdTaxInsert-input-field" /></td>
                  <td><input type="number" name="basicFee1" value={tax.basicFee1} onChange={handleChange} className="AdTaxInsert-input-field" /></td>
                  <td>{(parseFloat(tax.fee1) + parseFloat(tax.basicFee1)).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>{feeNames[tax.taxCategory][1]}</td>
                  <td><input type="number" name="fee2" value={tax.fee2} onChange={handleChange} className="AdTaxInsert-input-field" /></td>
                  <td><input type="number" name="basicFee2" value={tax.basicFee2} onChange={handleChange} className="AdTaxInsert-input-field" /></td>
                  <td>{(parseFloat(tax.fee2) + parseFloat(tax.basicFee2)).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>{feeNames[tax.taxCategory][2]}</td>
                  <td><input type="number" name="fee3" value={tax.fee3} onChange={handleChange} className="AdTaxInsert-input-field" /></td>
                  <td><input type="number" name="basicFee3" value={tax.basicFee3} onChange={handleChange} className="AdTaxInsert-input-field" /></td>
                  <td>{(parseFloat(tax.fee3) + parseFloat(tax.basicFee3)).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>총 고지액</td>
                  <td>{totalFee.toLocaleString()}</td>
                  <td>{totalBasicFee.toLocaleString()}</td>
                  <td>{totalAmount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="AdTaxInsert-form-group">
            <label>사용자 선택: 
              <select name="userId" onChange={handleUserChange} className="AdTaxInsert-input-field">
                <option value="">사용자 선택</option>
                {userIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </label>
            <label>납부기한: 
              <input
                name="taxDeadLine"
                type="date"
                value={tax.taxDeadLine}
                onChange={handleChange}
                className="AdTaxInsert-input-field"
              />
            </label>
            <label>세금 종류: 
              <select name="taxCategory" value={tax.taxCategory} onChange={handleChange} className="AdTaxInsert-input-field">
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button type="submit" className="AdTaxInsert-submit-button">생성</button>
          <button type="button" className="AdTaxInsert-cancel-button" onClick={() => navigate(-1)}>취소</button>
        </form>
      </div>
    </div>
  );
};

export default AdTaxInsert;
