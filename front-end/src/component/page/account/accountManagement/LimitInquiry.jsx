import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../resource/css/account/accountManagement/LimitInquiry.css'; // 스타일 적용

const LimitInquiry = ({ accountNumber }) => {
  const navigate = useNavigate();

  // 이체한도 변경으로 이동
  const handleLimitChange = () => {
    navigate(`/account/${accountNumber}/limit-change`);
  };

  return (
    <div className="limit-inquiry-container">
      <h2>이체한도 조회</h2>
      <table>
        <tbody>
          <tr>
            <th>1일 이체한도</th>
            <td>10,000,000원</td>
          </tr>
          <tr>
            <th>1회 이체한도</th>
            <td>5,000,000원</td>
          </tr>
        </tbody>
      </table>
      <button onClick={handleLimitChange} className="limit-change-button">
        이체한도 변경
      </button>
    </div>
  );
};

export default LimitInquiry;
