import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../resource/css/admin/SavingsProduct.css';

const SavingsProduct = () => {
  const navigate = useNavigate();

  const savingsList = [
    { id: 1, type: '정기 예금', productName: '대표 정기예금', interestRate: '연 4.0%', period: '1~36개월', amount: '1백만원 이상' },
    { id: 2, type: '정기 예금', productName: '정기예금A', interestRate: '연 3.5%', period: '1~24개월', amount: '5백만원 이상' },
    { id: 3, type: '정기 예금', productName: '정기예금B', interestRate: '연 3.8%', period: '1~12개월', amount: '3백만원 이상' },
  ];

  const handleEdit = (product) => {
    navigate('/editSavingsProduct', { state: { product } });
  };

  return (
    <div className="savings-product-container">
      <h2>예금 상품 관리</h2>
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
          {savingsList.map((product, index) => (
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

export default SavingsProduct;
