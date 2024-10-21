import React from "react";
import '../../../resource/css/util/Dropdown_Menu.css'; // CSS 불러오기

function AccountDrop() {
    const userNo = localStorage.getItem("userNo"); // localStorage에서 userNo 가져오기

    return (
        <div className='dropdown_menu_div'> {/* 클래스 이름 일치 */}
            <ul>
                <h4>계좌조회</h4>
                <li>
                    <a href={`/users/${userNo}/accounts`}>전체계좌조회</a>
                </li>
            </ul>
            <ul>
                <h4>계좌관리</h4>
                <li>
                    <a href={`/account/password-check?purpose=password-change`}>비밀번호 변경</a>
                </li>
                <li>
                    <a href={`/account/password-check?purpose=close-account`}>계좌해지</a>
                </li>
                <li>
                    <a href={`/account/password-check?purpose=limit-inquiry`}>이체한도 조회</a>
                </li>
            </ul>
            <ul>
                <h4>이체</h4>
                <li><a href="/account/transfer">이체</a></li>
            </ul>
            <ul>
                <h4>자동이체</h4>
                <li><a href='/auto-transfer/register'>자동이체 등록</a></li>
                <li><a href='/auto-transfer/list'>자동이체 조회</a></li>
            </ul>
        </div>
    );
}

export default AccountDrop;
