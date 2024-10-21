import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../../../../resource/css/admin/TaxEdit.css'; // CSS 파일 추가

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
    axios.get(`http://localhost:8081/tax/select/${taxNo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      setTax(response.data);

      // 세금 데이터의 userNo를 사용해 사용자 이름 가져오기
      axios.get(`http://localhost:8081/tax/name/${response.data.userNo}`, {
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

    // 입력값이 0인 경우 확인
    if (tax.fee1 === 0 || tax.fee2 === 0 || tax.fee3 === 0 || 
        tax.basicFee1 === 0 || tax.basicFee2 === 0 || tax.basicFee3 === 0) {
      alert('사용요금 및 기본요금은 0일 수 없습니다. 값을 입력해주세요.');
      return; // 검증에 실패하면 제출하지 않음
    }

    // 총 납부금액 계산 (사용요금과 기본요금의 합)
    const totalFee = tax.fee1 + tax.fee2 + tax.fee3;
    const totalBasicFee = tax.basicFee1 + tax.basicFee2 + tax.basicFee3;

    // tax 객체에 총 납부금액 포함하여 서버로 전송
    const updatedTax = { 
      ...tax, 
      totalFee: totalFee, // 사용요금 합계 추가
      totalBasicFee: totalBasicFee // 기본요금 합계 추가
    };

    axios.put(`http://localhost:8081/tax/edit/${taxNo}`, updatedTax, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      navigate('/adTaxList'); // 업데이트 후 리스트로 돌아가기
    })
    .catch(error => console.error('Error updating tax:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numValue = Number(value);

    // 입력된 값으로 상태 업데이트 (0은 허용됨)
    setTax(prevTax => ({ ...prevTax, [name]: numValue }));
  };

  const totalFee = tax.fee1 + tax.fee2 + tax.fee3;
  const totalBasicFee = tax.basicFee1 + tax.basicFee2 + tax.basicFee3;

  // 세금 종류에 따른 요금 내역 이름 변경
  const feeLabels = tax.taxCategory === 'electro' 
    ? ['세대전기료', '공동전기료', 'TV수신료'] 
    : ['상수도 요금', '하수도 요금', '지하수 요금'];

  return (
    <form className="tax-edit-form" onSubmit={handleSubmit}>
      <h1 className="tax-edit-title">공과금 상세</h1>

      {/* 위의 관리번호, 납부기간, 납부자명, 납부금액 정보 */}
      <div className="summary-table">
        <table className="table-bordered">
          <thead>
            <tr>
              <th>관리번호</th>
              <th>납부기간</th>
              <th>납부자명</th>
              <th>세금 종류</th> {/* 세금 종류 추가 */}
              <th>납부금액</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{taxNo}</td>
              <td>{tax.taxDeadLine}</td>
              <td>{tax.userName}</td> {/* 유저 이름 표시 */}
              <td>{tax.taxCategory}</td> {/* 세금 종류 표시 */}
              <td>{totalFee + totalBasicFee}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 아래 요금 내역 테이블 */}
      <div className="fee-table">
        <table className="table-bordered">
          <thead>
            <tr>
              <th>요금 내역</th>
              <th>사용요금</th>
              <th>기본요금</th>
              <th>납부금액</th> {/* 납부금액 열만 남김 */}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{feeLabels[0]}</td> {/* 첫 번째 행 이름 */}
              <td>
                <input
                  type="number"
                  name="fee1"
                  value={tax.fee1}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="basicFee1"
                  value={tax.basicFee1}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </td>
              <td>{tax.fee1 + tax.basicFee1}</td> {/* 납부금액 계산 */}
            </tr>
            <tr>
              <td>{feeLabels[1]}</td> {/* 두 번째 행 이름 */}
              <td>
                <input
                  type="number"
                  name="fee2"
                  value={tax.fee2}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="basicFee2"
                  value={tax.basicFee2}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </td>
              <td>{tax.fee2 + tax.basicFee2}</td> {/* 납부금액 계산 */}
            </tr>
            <tr>
              <td>{feeLabels[2]}</td> {/* 세 번째 행 이름 */}
              <td>
                <input
                  type="number"
                  name="fee3"
                  value={tax.fee3}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="basicFee3"
                  value={tax.basicFee3}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </td>
              <td>{tax.fee3 + tax.basicFee3}</td> {/* 납부금액 계산 */}
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

      <button type="submit" className="edit-button">수정</button>
      <button type="button" className="return-button" onClick={() => navigate('/adTaxList')}>돌아가기</button>
    </form>
  );
};

export default AdTaxEdit;
