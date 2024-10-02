import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../resource/css/admin/LoanProduct.css';

const LoanProduct = () => {
  const navigate = useNavigate();

  const loanList = [
    { id: 1, type: '직장인 대출', productName: '직장인 누구나', interestRate: '연 3.0%', period: '최장 10년', amount: '최고 3억원' },
    { id: 2, type: '직장인 대출', productName: '직장인 특급', interestRate: '연 2.8%', period: '최장 8년', amount: '최고 2억원' },
    { id: 3, type: '직장인 대출', productName: '직장인 보통', interestRate: '연 3.2%', period: '최장 5년', amount: '최고 1억원' },
  ];

  const handleEdit = (product) => {
    navigate('/editLoanProduct', { state: { product } });
  };

  return (
    <div className="loan-product-container">
      <h2>대출 상품 관리</h2>
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
          {loanList.map((product, index) => (
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

export default LoanProduct;
