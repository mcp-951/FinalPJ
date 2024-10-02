import React from "react";

function TaxDrop(){
    return(
        <div className='dropdow_menu'>
            <div className="dropdown_menu_div">
                <div className="dropdown_menu_1">
                    <ul>
                        <h4>전기세</h4>
                        <li><a href="/tax/elec">공과금 납부</a></li>
                        <li><a href="#">이용 내역</a></li>
                    </ul>
                </div>
                <div className="dropdown_menu_last">
                    <ul>
                        <h4>수도세</h4>
                        <li><a href="/tax/water">공과금 납부</a></li>
                        <li><a href="#">이용 내역</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default TaxDrop;