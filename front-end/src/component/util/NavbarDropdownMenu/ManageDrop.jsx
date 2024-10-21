import React from "react";
import '../../../resource/css/util/Dropdown_Menu.css';

function ManageDrop(){
    return(
        <div className='dropdow_menu'>
            <div className="dropdown_menu_div">
                <div className="dropdown_menu_1">
                    <ul>
                        <h4>현황</h4>
                        <li><a href="/myAsset">자산현황</a></li>
                    </ul>
                </div>
                <div className="dropdown_menu_last">
                    <ul>
                        <h4>분석</h4>
                        <li><a href="/asset-calendar">자산캘린더 </a></li>
                        <li><a href="/AssetsAnalysis">자산분석</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ManageDrop;