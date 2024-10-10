import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../../../resource/css/product/ProductMain.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import ApiService from '../../ApiService'; // API 서비스 임포트

// 커스텀 이전 버튼
function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", left: "10px", zIndex: "1" }}
      onClick={onClick}
    >
      <FaArrowLeft size={30} />
    </div>
  );
}

// 커스텀 다음 버튼
function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", right: "10px", zIndex: "1" }}
      onClick={onClick}
    >
      <FaArrowRight size={30} />
    </div>
  );
}

function FinancialProductsMain() {
  const [savings, setSavings] = useState([]);   // 예금 상품
  const [deposits, setDeposits] = useState([]); // 적금 상품
  const [loans, setLoans] = useState([]);       // 대출 상품

  useEffect(() => {
    // 예금 상품 3개 가져오기
    ApiService.fetchSavingProducts()
      .then(response => {
        setSavings(response.data);
      })
      .catch(error => {
        console.error('Error fetching saving products:', error);
      });

    // 적금 상품 3개 가져오기
    ApiService.fetchDepositProducts()
      .then(response => {
        setDeposits(response.data);
      })
      .catch(error => {
        console.error('Error fetching deposit products:', error);
      });

    // 대출 상품 3개 가져오기
    ApiService.fetchLoanProducts()
      .then(response => {
        setLoans(response.data);
      })
      .catch(error => {
        console.error('Error fetching loan products:', error);
      });
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  const renderProductSlide = (products) => (
    <div className="product-slide-group">
      <div className="product-slide-container">
        {products.map((product, idx) => (
          <div key={idx} className="product-slide">
            <img src={product.productIMG} className="product-image" alt={product.productName} />
            <div className="badge">{product.productCategory}</div>
            <h3>{product.productName}</h3>
            <p>{product.productContent}</p>
            <h4>이율: {product.productRate}%</h4>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="financial-products-main">
      <br /><br /><br /><br />
      <div className="slider-container">
        <h2>KB 고객님이 선택한 BEST 상품</h2>
        <Slider {...settings}>
          {renderProductSlide(savings)}
          {renderProductSlide(deposits)}
          {renderProductSlide(loans)}
        </Slider>
      </div>
      <br /><br /><br /><br /><br />
      <div className="bottom-section">
        <div className="search">
          <p>상품검색</p>
          <input type="text" placeholder="검색어를 입력하세요." />
        </div>
      </div>
    </div>
  );
}

export default FinancialProductsMain;
