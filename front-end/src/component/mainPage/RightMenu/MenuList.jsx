import React from "react";

function MenuList({src, title}){

    return(
        <div>
            <a>
            <img 
                className="MenuIMG"
                width='100px'
                src={src}
                alt=""
            />
            <p>
                {title}
            </p>
            </a>
        </div>
    );
}

export default MenuList;