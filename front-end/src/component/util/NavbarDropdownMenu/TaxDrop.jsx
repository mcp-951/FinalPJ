import React from "react";
import '../../../resource/css/util/Dropdown_Menu.css';

function TaxDrop(){
    return(
        <div className='dropdow_menu'>
            <div className="dropdown_menu_div">
                <div className="dropdown_menu_1">
                    <ul>
                        <h4>공과금</h4>
                        <li><a href="/tax/elec">공과금 납부</a></li>
                        <li><a href="/tax/History">이용 내역</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default TaxDrop;