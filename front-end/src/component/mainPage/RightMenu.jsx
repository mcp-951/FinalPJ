import React from "react";
import MenuList from "./RightMenu/MenuList"
import '../../resource/css/main/RightMenu.css'

function RightMenu(){
    return (
        <dvi className="RightMenu_div">
            <div className="RightMenu_img">
                <MenuList src="/images/main/utility_bills.png" title="공과금"/>
                <MenuList src="/images/main/exchange_rate.png" title="환율"/>
                <MenuList src="/images/main/deposit.png" title="예금"/>
                <MenuList src="/images/main/comunity.png" title="커뮤니티"/>
                <MenuList src="/images/main/foreign_country.png" title="외환"/>
                <MenuList src="/images/main/inquiry.png" title="문의"/>
            </div>
        </dvi>
    );
}export default RightMenu;