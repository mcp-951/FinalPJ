import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../../../resource/css/admin/TaxList.css'; // CSS 파일 추가

const TaxInsert = () => {
  const [tax, setTax] = useState({
    fee1: 0,
    fee2: 0,
    fee3: 0,
    basicFee1: 0,
    basicFee2: 0,
    basicFee3: 0,
    taxDeadLine: '',
    taxWriteDate: '',
    taxState: 'N', // 기본값을 'N'으로 설정
    taxCategory: 'water', // 기본값을 수도로 설정
    userNo: '', // userNo로 변경
  });
  
  const [userIds, setUserIds] = useState([]); // 사용자 ID 목록 저장
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // 토큰 가져오기

  const categories = [
    { value: 'water', label: '수도' },
    { value: 'electro', label: '전기' }
  ]; // 선택 가능한 카테고리 목록

  const feeNames = {
    water: ['상수도 요금', '하수도 요금', '지하수 요금'],
    electro: ['세대전기료', '공동전기료', 'TV수신료']
  };

  // "ROLE_USER" 유저들의 userId 가져오기
  useEffect(() => {
    axios.get('http://localhost:8081/tax/users/role-user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      setUserIds(response.data); // userId 목록을 상태에 저장
    })
    .catch(error => console.error('Error fetching userIds:', error));
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTax({ ...tax, [name]: value });
  };

  // 사용자 선택 시 userId를 기반으로 userNo 가져오기
  const handleUserChange = (e) => {
    const selectedUserId = e.target.value;
    axios.get(`http://localhost:8081/tax/userNo/${selectedUserId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const userNo = response.data; // userNo 가져오기
      setTax({ ...tax, userNo }); // userNo 상태에 저장
    })
    .catch(error => console.error('Error fetching userNo:', error));
  };

  // 총 납부금액 계산 (사용요금과 기본요금의 합)
  const totalFee = parseFloat(tax.fee1) + parseFloat(tax.fee2) + parseFloat(tax.fee3);
  const totalBasicFee = parseFloat(tax.basicFee1) + parseFloat(tax.basicFee2) + parseFloat(tax.basicFee3);
  const totalAmount = totalFee + totalBasicFee;

  const handleSubmit = (e) => {
    e.preventDefault();

    // 서버로 전송할 tax 객체에 총 납부금액 추가
    const taxData = { ...tax, totalAmount, totalFee, totalBasicFee };

    axios.post('http://localhost:8081/tax/insert', taxData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      navigate('/taxList'); // 삽입 완료 후 세금 목록으로 이동
    })
    .catch((error) => console.error('Error inserting tax:', error));
  };

  return (
    <form onSubmit={handleSubmit} className="tax-insert-form">
      {/* 사용자 선택 및 납부기한 선택 부분 */}
      <div className="form-group">
        <label>사용자 선택: 
          <select name="userId" onChange={handleUserChange} className="input-field">
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
            className="input-field"
          />
        </label>

        {/* 세금 종류 선택 */}
        <label>세금 종류: 
          <select name="taxCategory" value={tax.taxCategory} onChange={handleChange} className="input-field">
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* 관리번호 및 납부금액 표시 부분 */}
      <div className="summary-table">
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
              <td>{totalAmount.toLocaleString()} 원</td> {/* 계산된 총 납부 금액 */}
            </tr>
          </tbody>
        </table>
      </div>

      {/* 사용요금 및 기본요금 입력 부분 */}
      <div className="fee-table">
        <table className="table-bordered">
          <thead>
            <tr>
              <th>요금내역</th>
              <th>사용요금</th>
              <th>기본요금</th>
              <th>납부금액</th> {/* 정산액을 제거하고 납부금액만 남김 */}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{feeNames[tax.taxCategory][0]}</td>
              <td><input type="number" name="fee1" value={tax.fee1} onChange={handleChange} className="input-field" /></td>
              <td><input type="number" name="basicFee1" value={tax.basicFee1} onChange={handleChange} className="input-field" /></td>
              <td>{(parseFloat(tax.fee1) + parseFloat(tax.basicFee1)).toLocaleString()}</td> {/* 납부금액 계산 */}
            </tr>
            <tr>
              <td>{feeNames[tax.taxCategory][1]}</td>
              <td><input type="number" name="fee2" value={tax.fee2} onChange={handleChange} className="input-field" /></td>
              <td><input type="number" name="basicFee2" value={tax.basicFee2} onChange={handleChange} className="input-field" /></td>
              <td>{(parseFloat(tax.fee2) + parseFloat(tax.basicFee2)).toLocaleString()}</td> {/* 납부금액 계산 */}
            </tr>
            <tr>
              <td>{feeNames[tax.taxCategory][2]}</td>
              <td><input type="number" name="fee3" value={tax.fee3} onChange={handleChange} className="input-field" /></td>
              <td><input type="number" name="basicFee3" value={tax.basicFee3} onChange={handleChange} className="input-field" /></td>
              <td>{(parseFloat(tax.fee3) + parseFloat(tax.basicFee3)).toLocaleString()}</td> {/* 납부금액 계산 */}
            </tr>
            <tr>
              <td>총 고지액</td>
              <td>{totalFee.toLocaleString()}</td>
              <td>{totalBasicFee.toLocaleString()}</td>
              <td>{totalAmount.toLocaleString()}</td> {/* 총 납부금액 */}
            </tr>
          </tbody>
        </table>
      </div>

      <button type="submit" className="submit-button">생성</button>
      <button type="button" className="cancel-button" onClick={() => navigate('/taxList')}>취소</button>
    </form>
  );
};

export default TaxInsert;
