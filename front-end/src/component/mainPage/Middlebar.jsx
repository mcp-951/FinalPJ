import React from "react";
import '../../resource/css/main/Middlebar.css'

function Middlebar(){
    return(
        <div className='Middlebar_menu'>
            <ul>
                <li><a>계좌조회</a></li>
                <li><a>환율조회</a></li>
                <li><a>예적금</a></li>
                <li><a>주식정보</a></li>
                <li><a>자산현황</a></li>
            </ul>
        </div>
    );
}

export default Middlebar;