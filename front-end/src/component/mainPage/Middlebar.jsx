import React from "react";
import '../../resource/css/main/Middlebar.css'

function Middlebar() {
    return (
        <div className='Middlebar_menu'>
            <ul>
                <li><a href="/users/:userNo/accounts">계좌조회</a></li>
                <li><a href="/exchange-rate">환율조회</a></li>
                <li><a href="/deposit-list">상품둘러보기</a></li>
                <li><a href="/account/transfer">이체</a></li>
            </ul>
        </div>
    );
}

export default Middlebar;
