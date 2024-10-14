import React from "react";

function CarouselImg({ src, alt }) {
    return (
        <img
            className="d-block w-100"
            src={src}
            alt={alt} 
        />
    );
}

export default CarouselImg;