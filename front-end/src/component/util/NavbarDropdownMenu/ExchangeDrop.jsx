import React from "react";
import '../../../resource/css/util/Dropdown_Menu.css';
import { Link } from 'react-router-dom';

function ExchangeDrop({ closeDropdown }) {
    return (
        <div className='dropdow_menu'>
            <div className="dropdown_menu_div">
                <div className="dropdown_menu_1">
                    <ul>
                        <h4>환율</h4>
                        <li>
                            <Link to="/exchange-rate" onClick={closeDropdown}>실시간 환율</Link>
                        </li>
                    </ul>
                </div>
                <div className="dropdown_menu_last">
                    <ul>
                        <h4>환전</h4>
                        <li>
                            <Link to="/exchange" onClick={closeDropdown}>환전 신청</Link>
                        </li>
                        <li>
                            <Link to="/exchangeList" onClick={closeDropdown}>환전 내역</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ExchangeDrop;