import React from "react";
import '../../../resource/css/util/Dropdown_Menu.css';
import localStorage from 'localStorage';


function AccountDrop(){
    const userNo = localStorage.getItem("userNo"); // localStorage에서 userNo 가져오기

    return(
        <div className='dropdow_menu'>
            <div className="dropdown_menu_div">
                <div className="dropdown_menu_1">
                    <ul className="dropdown-content">
                        <h4>계좌조회</h4>
                        <li className="small-text">
                            <a href={`/accounts`}>전체계좌조회</a>
                        </li>
                        {/* <li className="small-text"><a href='/transfer/other'>해지계좌조회</a></li> */}
                    </ul>
                </div>
                <div className="dropdown_menu_2">
                    <ul>
                        <h4>계좌관리</h4>
                        {/* 계좌 번호 없이 purpose만 전달 */}
                        <li className="small-text">
                            <a href={`/account/password-check?purpose=password-change`}>비밀번호 변경</a>
                        </li>
                        <li className="small-text">
                            <a href={`/account/password-check?purpose=close-account`}>계좌해지</a>
                        </li>
                        <li className="small-text">
                            <a href={`/account/password-check?purpose=limit-inquiry`}>이체한도 조회</a>
                        </li>
                    </ul>
                </div>
                <div className="dropdown_menu_3">
                    <ul>
                        <h4>이체</h4>
                        <li className="small-text"><a href="/account/transfer">이체</a></li>
                    </ul>
                </div>
                <div className="dropdown_menu_last">
                    <ul>
                        <h4>자동이체</h4>
                        <li className="small-text"><a href='/auto-transfer/register'>자동이체 등록</a></li> {/* 등록 페이지 경로 추가 */}
                        <li className="small-text"><a href='/auto-transfer/list'>자동이체 조회</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default AccountDrop;