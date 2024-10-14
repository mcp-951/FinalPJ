import React from "react";

function InvestmentDrop(){
    return(
        <div className='dropdow_menu'>
            <div className="dropdown_menu_div">
                <div className="dropdown_menu_1">
                    <ul>
                        <h4>주식현황</h4>
                        <li><a href="/investment">주식메인</a></li>
                    </ul>
                </div>
                <div className="dropdown_menu_last">
                    <ul>
                        <h4>코인현황</h4>
                        <li><a href="/investment">코인메인</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default InvestmentDrop;