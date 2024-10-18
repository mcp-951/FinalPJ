import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import '../../resource/css/Carousel.css';
import product1 from '../../resource/img/a.jpg';  // 첫 번째 금융상품 이미지
import product2 from '../../resource/img/b.jpg';  // 두 번째 금융상품 이미지
import product3 from '../../resource/img/c.jpg';  // 세 번째 금융상품 이미지

function Carousel_Main() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <div className='Carousel_div'>
      <div className='Carousel_Tab'>
        <Carousel activeIndex={index} onSelect={handleSelect}>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={product1}
              alt="주택청약종합저축"
              style={{ maxHeight: '540px', objectFit: 'cover' }}
            />
            <Carousel.Caption style={{ color: 'black', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '5px' }}>
              <h3>내 집 마련의 시작</h3>
              <p>주택청약종합저축</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
              className="d-block w-100"
              src={product2}
              alt="URAM 내맘대로 적금"
              style={{ maxHeight: '540px', objectFit: 'cover' }}
            />
            <Carousel.Caption style={{ color: 'black', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '5px' }}>
              <h3>누구나 쉽게 우대받는 DIY</h3>
              <p>URAM 내맘대로 적금</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
              className="d-block w-100"
              src={product3}
              alt="URAM 직장인든든 신용대출"
              style={{ maxHeight: '540px', objectFit: 'cover' }}
            />
            <Carousel.Caption style={{ color: 'black', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '5px' }}>
              <h3>직장인이라면</h3>
              <p>URAM 직장인든든 신용대출</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
    </div>
  );
}

export default Carousel_Main;
