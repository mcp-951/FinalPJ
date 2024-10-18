import React, { useState } from 'react';
import '../../../../resource/css/admin/ExchangePickupLocation.css';

const ExchangePickupLocation = () => {
  const [locations] = useState([
    { id: 1, branch: '인천점', address: '인천광역시', status: '운영중' },
    { id: 2, branch: '김포점', address: '서울특별시', status: '운영중' }
    // 추가할 수 있음
  ]);

  return (
    <div className="exchange-pickup-container">
      <h2>수령 지점 관리</h2>

      <table className="location-table">
        <thead>
          <tr>
            <th>No</th>
            <th>지점명</th>
            <th>주소</th>
            <th>상태</th>
            <th>수정</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location, index) => (
            <tr key={location.id}>
              <td>{index + 1}</td>
              <td>{location.branch}</td>
              <td>{location.address}</td>
              <td>{location.status}</td>
              <td><button>수정</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExchangePickupLocation;
