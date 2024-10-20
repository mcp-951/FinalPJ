import React, { useState } from "react";
import { Link } from 'react-router-dom'; // Link 사용
import '../../../resource/css/util/Dropdown_Menu.css';

function AccountDrop() {
  const [isDropdownVisible, setDropdownVisible] = useState(true); // 드롭다운 표시 상태 관리
  const userNo = localStorage.getItem("userNo"); // localStorage에서 userNo 가져오기

  const handleLinkClick = () => {
    setDropdownVisible(false); // 링크 클릭 시 드롭다운을 닫음
  };

  return (
    isDropdownVisible && ( // 드롭다운이 표시되는 경우에만 렌더링
      <div className='dropdow_menu'>
        <div className="dropdown_menu_div">
          <div className="dropdown_menu_1">
            <ul className="dropdown-content">
              <h4>계좌조회</h4>
              <li className="small-text">
                <a href={`/accounts`} onClick={handleLinkClick}>전체계좌조회</a>
              </li>
            </ul>
          </div>
          <div className="dropdown_menu_2">
            <ul>
              <h4>계좌관리</h4>
              {/* 계좌 번호 없이 purpose만 전달 */}
              <li className="small-text">
                <Link to={`/account/password-check`} state={{ purpose: 'password-change' }} onClick={handleLinkClick}>
                  비밀번호 변경
                </Link>
              </li>
              <li className="small-text">
                <Link to={`/account/password-check`} state={{ purpose: 'close-account' }} onClick={handleLinkClick}>
                  계좌해지
                </Link>
              </li>
              <li className="small-text">
                <Link to={`/account/password-check`} state={{ purpose: 'limit-inquiry' }} onClick={handleLinkClick}>
                  이체한도 조회
                </Link>
              </li>
            </ul>
          </div>
          <div className="dropdown_menu_3">
            <ul>
              <h4>이체</h4>
              <li className="small-text">
                <a href="/account/transfer" onClick={handleLinkClick}>이체</a>
              </li>
            </ul>
          </div>
          <div className="dropdown_menu_last">
            <ul>
              <h4>자동이체</h4>
              <li className="small-text">
                <a href='/auto-transfer/register' onClick={handleLinkClick}>자동이체 등록</a>
              </li>
              <li className="small-text">
                <a href='/auto-transfer/list' onClick={handleLinkClick}>자동이체 조회</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  );
}

export default AccountDrop;
