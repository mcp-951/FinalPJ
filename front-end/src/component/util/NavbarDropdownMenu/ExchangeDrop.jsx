import React from "react";
import '../../../resource/css/util/Dropdown_Menu.css';

function ExchangeDrop(){
    return(
        <div className='dropdow_menu'>
            <div className="dropdown_menu_div">
                <div className="dropdown_menu_1">
                    <ul>
                        <h4>환율</h4>
                        <li><a href="exchange-rate">실시간 환율</a></li>
                    </ul>
                </div>
                <div className="dropdown_menu_last">
                    <ul>
                        <h4>환전</h4>
                        <li><a href="exchange">환전 신청</a></li>
                        <li><a href="exchangeList">환전 내역</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ExchangeDrop;