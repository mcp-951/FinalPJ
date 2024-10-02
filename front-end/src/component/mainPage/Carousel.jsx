import React from 'react';
import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import CarouselImg from './Carousel/CarouselImg'
import '../../resource/css/main/Carousel.css'

function Carouesl_Main() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  return (
    <div className='Carousel_div'>
      <div className='Carousel_Tab'>
      <Carousel activeIndex={index} onSelect={handleSelect}>
        <Carousel.Item>
        <CarouselImg
              src="https://via.placeholder.com/800x400?text=First+Slide"
              alt="First slide"
            />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <CarouselImg
              src="https://via.placeholder.com/800x400?text=Second+Slide"
              alt="Second slide"
          />
          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <CarouselImg
              src="https://via.placeholder.com/800x400?txt=Third+Slide"
              alt="Third slide"
          />
          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      </div>
    </div>
  );
}

export default Carouesl_Main;