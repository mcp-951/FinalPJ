import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../resource/css/admin/FinancialProduct.css';

const FinancialProduct = () => {
  const navigate = useNavigate();

  const productList = [
    { id: 1, type: '예금', productName: '대표 정기예금', interestRate: '연 4.0%', period: '1~36개월', amount: '1백만원 이상' },
    { id: 2, type: '적금', productName: '정기적금A', interestRate: '연 3.5%', period: '1~24개월', amount: '30만원 이상' },
    { id: 3, type: '대출', productName: '직장인 대출A', interestRate: '연 2.9%', period: '최대 5년', amount: '최대 5천만원' },
  ];

  // 수정 버튼 클릭 시 해당 상품에 맞는 수정 페이지로 이동
  const handleEdit = (product) => {
    if (product.type === '예금') {
      navigate('/editSavingsProduct', { state: { product } });
    } else if (product.type === '적금') {
      navigate('/editDepositProduct', { state: { product } });
    } else if (product.type === '대출') {
      navigate('/editLoanProduct', { state: { product } });
    }
  };

  return (
    <div className="financial-product-container">
      <h2>금융상품 관리</h2>
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
          {productList.map((product, index) => (
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

export default FinancialProduct;
