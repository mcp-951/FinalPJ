import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../resource/css/admin/DepositProduct.css';

const DepositProduct = () => {
  const navigate = useNavigate();

  const depositList = [
    { id: 1, type: '정기 적금', productName: '대표 정기적금', interestRate: '연 3.6%', period: '1~36개월', amount: '50만원 이상' },
    { id: 2, type: '정기 적금', productName: '정기적금A', interestRate: '연 3.2%', period: '1~24개월', amount: '30만원 이상' },
    { id: 3, type: '정기 적금', productName: '정기적금B', interestRate: '연 3.4%', period: '1~12개월', amount: '20만원 이상' },
  ];

  const handleEdit = (product) => {
    navigate('/editDepositProduct', { state: { product } });
  };

  return (
    <div className="deposit-product-container">
      <h2>적금 상품 관리</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>노출순서</th>
            <th>분류</th>
            <th>상품명</th>
            <th>금리</th>
            <th>기간</th>
            <th>금액</th>
            <th>수정</th>
          </tr>
        </thead>
        <tbody>
          {depositList.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>{product.type}</td>
              <td>{product.productName}</td>
              <td>{product.interestRate}</td>
              <td>{product.period}</td>
              <td>{product.amount}</td>
              <td><button onClick={() => handleEdit(product)}>수정</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepositProduct;
