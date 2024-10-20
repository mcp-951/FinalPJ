import React from "react";
import '../../../resource/css/util/Dropdown_Menu.css';

function ProductDrop(){
    return(
        <div className='dropdown_menu'>
            <div className="dropdown_menu_div">
                <div className="dropdown_menu_1">
                    <ul>
                        <li className="section-title">예금</li>
                        <li className="small-text"><a href='/deposit-list'>예금상품 리스트</a></li>
                        <li className="small-text"><a href='/DepositMain'>예금상품 메인</a></li>
                    </ul>
                </div>
                <div className="dropdown_menu_2">
                    <ul>
                        <li className="section-title">적금</li>
                        <li className="small-text"><a href='/saving-list'>적금상품 리스트</a></li>
                        <li className="small-text"><a href='/saving-main'>적금상품 메인</a></li>
                    </ul>
                </div>
                <div className="dropdown_menu_last">
                    <ul>
                        <li className="section-title">대출</li>
                        <li className="small-text"><a href='/LoanList'>대출상품 리스트</a></li>
                        <li className="small-text"><a href='/Repayment'>중도상환</a></li>
                        <li className="small-text"><a href='/Calculatior'>대출 이자계산기</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ProductDrop;