import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './css/ProductMain.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // react-icons에서 아이콘 임포트
import Footer from '../util/Footer'; // Footer 컴포넌트 임포트

// 상품 데이터
const productGroups = [
  [
    {
      title: "URAM 국민 일반예금",
      description: "높은 이율과 안전한 예금",
      maxAmount: "최대 1억원",
      badge: "예금 상품",
      link: "/products/saving1"
    },
    {
      title: "URAM 국민 장기예금",
      description: "장기 예금으로 안정적인 이자 수익",
      maxAmount: "최대 2억원",
      badge: "예금 상품",
      link: "/products/saving2"
    },
    {
      title: "URAM 국민 단기예금",
      description: "단기간 예치 가능",
      maxAmount: "최대 5천만원",
      badge: "예금 상품",
      link: "/products/saving3"
    }
  ],
  [
    {
      title: "URAM 국민 정기적금",
      description: "정기 적립으로 목돈 마련",
      maxAmount: "최대 1천만원",
      badge: "적금 상품",
      link: "/products/deposit1"
    },
    {
      title: "URAM 국민 자유적금",
      description: "자유롭게 적립 가능한 적금",
      maxAmount: "최대 2천만원",
      badge: "적금 상품",
      link: "/products/deposit2"
    },
    {
      title: "URAM 국민 고금리적금",
      description: "높은 금리로 적립 가능",
      maxAmount: "최대 5천만원",
      badge: "적금 상품",
      link: "/products/deposit3"
    }
  ],
  [
    {
      title: "URAM 국민 직장인 신용대출",
      description: "직장인을 위한 맞춤형 신용대출",
      maxAmount: "최대 3천만원",
      badge: "대출 상품",
      link: "/products/loan1"
    },
    {
      title: "URAM 국민 주택담보대출",
      description: "주택을 담보로 한 대출",
      maxAmount: "최대 5억원",
      badge: "대출 상품",
      link: "/products/loan2"
    },
    {
      title: "URAM 국민 자동차 대출",
      description: "신차 구입을 위한 대출",
      maxAmount: "최대 1천만원",
      badge: "대출 상품",
      link: "/products/loan3"
    }
  ]
];

// 커스텀 이전 버튼
function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", left: "10px", zIndex: "1" }} // 왼쪽에 위치
      onClick={onClick}
    >
      <FaArrowLeft size={30} /> {/* 아이콘 추가 */}
    </div>
  );
}

// 커스텀 다음 버튼
function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", right: "10px", zIndex: "1" }} // 오른쪽에 위치
      onClick={onClick}
    >
      <FaArrowRight size={30} /> {/* 아이콘 추가 */}
    </div>
  );
}

function FinancialProductsMain() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // 한 번에 한 페이지의 상품 그룹을 표시 (세로로 3개)
    slidesToScroll: 1, // 1개씩 스크롤
    autoplay: true, // 자동 재생 활성화
    autoplaySpeed: 4000, // 3초마다 자동 전환
    nextArrow: <NextArrow />, // 커스텀 다음 버튼
    prevArrow: <PrevArrow />, // 커스텀 이전 버튼
  };

  return (
    <div className="financial-products-main">
      {/* 슬라이더 */}
      <br /><br /><br /><br />
      <div className="slider-container">
        <h2>URAM 고객님이 선택한 BEST 인기상품</h2>
        <p>가장 많이 사랑받은 인기상품입니다.</p>
        <Slider {...settings}>
          {productGroups.map((group, index) => (
            <div key={index} className="product-slide-group">
              <div className="product-slide-container">
                {group.map((product, idx) => (
                  <div key={idx} className="product-slide">
                    <div className="badge">{product.badge}</div>
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                    <h4>최고 {product.maxAmount}</h4>
                    {/* 상품 클릭 시 href를 사용하여 이동 */}
                    <a href='/DepositMain' className="product-link">자세히 보기</a>
                  </div>
                ))}
              </div>
              {/* 각 페이지에 맞는 "더보기" 버튼 */}
              {index === 0 && <a href="/savings-products" className="view-savings-btn">예금 상품 더보기</a>}
              {index === 1 && <a href="/loan-products" className="view-savings-btn">적금 상품 더보기</a>}
              {index === 2 && <a href="/loan-products" className="view-savings-btn">대출 상품 더보기</a>}
              <br /><br />
            </div>
          ))}
        </Slider>
      </div>
      <br /><br /><br /><br /><br />
      {/* 하단 상품 검색 및 추천 */}
      <div className="bottom-section">
        <div className="search">
          <p>상품검색</p>
          <input type="text" placeholder="검색어를 입력하세요." />
        </div>
      </div>
      <Footer /> {/* 페이지 하단에 푸터 추가 */}
    </div>
  );
}

export default FinancialProductsMain;
