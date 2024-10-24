import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../../../../resource/css/admin/AdTaxEdit.css'; // CSS 파일 추가
import Sidebar from '../Sidebar'; // 사이드바 추가

const AdTaxEdit = () => {
  const { taxNo } = useParams();
  const location = useLocation();
  const [tax, setTax] = useState({
    fee1: 0,
    fee2: 0,
    fee3: 0,
    basicFee1: 0,
    basicFee2: 0,
    basicFee3: 0,
    taxDeadLine: '',
    userId: '',
    userName: '', // 유저 이름 추가
    totalAmount: 0, // 총 고지액 추가
    taxCategory: location.state?.taxCategory || '수도', // state에서 세금 종류를 받아옴
  });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`http://13.125.114.85:8081/tax/select/${taxNo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      setTax(response.data);

      // 세금 데이터의 userNo를 사용해 사용자 이름 가져오기
      axios.get(`http://13.125.114.85:8081/tax/name/${response.data.userNo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(userResponse => {
        setTax(prevTax => ({
          ...prevTax,
          userName: userResponse.data // userName 데이터 설정
        }));
      })
      .catch(error => console.error('Error fetching user name:', error));
    })
    .catch(error => console.error('Error fetching tax data:', error));
  }, [taxNo, token]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (tax.fee1 === 0 || tax.fee2 === 0 || tax.fee3 === 0 || 
        tax.basicFee1 === 0 || tax.basicFee2 === 0 || tax.basicFee3 === 0) {
      alert('사용요금 및 기본요금은 0일 수 없습니다. 값을 입력해주세요.');
      return; 
    }

    const totalFee = tax.fee1 + tax.fee2 + tax.fee3;
    const totalBasicFee = tax.basicFee1 + tax.basicFee2 + tax.basicFee3;

    const updatedTax = { 
      ...tax, 
      totalFee: totalFee,
      totalBasicFee: totalBasicFee 
    };

    axios.put(`http://13.125.114.85:8081/tax/edit/${taxNo}`, updatedTax, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      navigate('/adTaxList'); 
    })
    .catch(error => console.error('Error updating tax:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numValue = Number(value);

    setTax(prevTax => ({ ...prevTax, [name]: numValue }));
  };

  const totalFee = tax.fee1 + tax.fee2 + tax.fee3;
  const totalBasicFee = tax.basicFee1 + tax.basicFee2 + tax.basicFee3;

  const feeLabels = tax.taxCategory === 'electro' 
    ? ['세대전기료', '공동전기료', 'TV수신료'] 
    : ['상수도 요금', '하수도 요금', '지하수 요금'];

  return (
    <div className="AdTaxEdit-container">
      <Sidebar /> {/* 사이드바 추가 */}
      <div className="AdTaxEdit-main-content">
        <form className="AdTaxEdit-form" onSubmit={handleSubmit}>
          <h1 className="AdTaxEdit-title">공과금 상세</h1>

          <div className="AdTaxEdit-summary-table">
            <table className="table-bordered">
              <thead>
                <tr>
                  <th>관리번호</th>
                  <th>납부기간</th>
                  <th>납부자명</th>
                  <th>세금 종류</th>
                  <th>납부금액</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{taxNo}</td>
                  <td>{tax.taxDeadLine}</td>
                  <td>{tax.userName}</td>
                  <td>{tax.taxCategory}</td>
                  <td>{totalFee + totalBasicFee}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="AdTaxEdit-fee-table">
            <table className="table-bordered">
              <thead>
                <tr>
                  <th>요금 내역</th>
                  <th>사용요금</th>
                  <th>기본요금</th>
                  <th>납부금액</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{feeLabels[0]}</td>
                  <td>
                    <input
                      type="number"
                      name="fee1"
                      value={tax.fee1}
                      onChange={handleInputChange}
                      className="AdTaxEdit-input-field"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="basicFee1"
                      value={tax.basicFee1}
                      onChange={handleInputChange}
                      className="AdTaxEdit-input-field"
                    />
                  </td>
                  <td>{tax.fee1 + tax.basicFee1}</td>
                </tr>
                <tr>
                  <td>{feeLabels[1]}</td>
                  <td>
                    <input
                      type="number"
                      name="fee2"
                      value={tax.fee2}
                      onChange={handleInputChange}
                      className="AdTaxEdit-input-field"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="basicFee2"
                      value={tax.basicFee2}
                      onChange={handleInputChange}
                      className="AdTaxEdit-input-field"
                    />
                  </td>
                  <td>{tax.fee2 + tax.basicFee2}</td>
                </tr>
                <tr>
                  <td>{feeLabels[2]}</td>
                  <td>
                    <input
                      type="number"
                      name="fee3"
                      value={tax.fee3}
                      onChange={handleInputChange}
                      className="AdTaxEdit-input-field"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="basicFee3"
                      value={tax.basicFee3}
                      onChange={handleInputChange}
                      className="AdTaxEdit-input-field"
                    />
                  </td>
                  <td>{tax.fee3 + tax.basicFee3}</td>
                </tr>
                <tr>
                  <td>총 고지액</td>
                  <td>{totalFee}</td>
                  <td>{totalBasicFee}</td>
                  <td>{totalFee + totalBasicFee}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <button type="submit" className="AdTaxEdit-edit-button">수정</button>
          <button type="button" className="AdTaxEdit-return-button" onClick={() => navigate('/adTaxList')}>돌아가기</button>
        </form>
      </div>
    </div>
  );
};

export default AdTaxEdit;
