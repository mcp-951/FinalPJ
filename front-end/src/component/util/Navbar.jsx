import '../../resource/css/util/Navbar.css';
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineLogin } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import SearchBar from './searchBar/SearchBar';  // SearchBar 경로 확인 후 추가

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    };

    const [searchOpen, setSearchOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null); // 드롭다운 활성화 상태 관리

    const handleSearchBar = () => {
        setSearchOpen(!searchOpen);
    };

    const toggleDropdown = (menu) => {
        if (activeDropdown === menu) {
            setActiveDropdown(null); // 같은 메뉴 클릭 시 닫힘
        } else {
            setActiveDropdown(menu); // 해당 메뉴 열림
        }
    };

    const moveInvestment = () => {
        navigate('/investment');
    };

    const navMyPage = () => {
        navigate('/mypage');
    };

    return (
        <>
            {!searchOpen ? (
                <div className="navbar_header">
                    <div className="nav_logo">
                        <a href='/'><img src="/images/main/logo2.png" alt="로고" /></a>
                    </div>
                    <div className='nav_menu'>
                        <ul>
                            <li 
                                onMouseEnter={() => setActiveDropdown('account')}
                                onMouseLeave={() => activeDropdown !== 'account' && setActiveDropdown(null)} // 다른 메뉴 클릭 시에만 닫기
                                onClick={() => toggleDropdown('account')} // 클릭 시 고정
                            >
                                <div>계좌</div>
                                {(activeDropdown === 'account') && (
                                    <div className="dropdown_menu show">
                                        <div className="dropdown_menu_div">
                                            <ul>
                                                <li><a href="/accounts">전체계좌조회</a></li>
                                                <li><a href="/account/password-check?purpose=password-change">비밀번호 변경</a></li>
                                                <li><a href="/account/password-check?purpose=close-account">계좌해지</a></li>
                                                <li><a href="/account/password-check?purpose=limit-inquiry">이체한도 조회</a></li>
                                                <li><a href="/account/transfer">이체</a></li>
                                                <li><a href='/auto-transfer/register'>자동이체 등록</a></li>
                                                <li><a href='/auto-transfer/list'>자동이체 조회</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </li>
                            <li 
                                onMouseEnter={() => setActiveDropdown('finance')}
                                onMouseLeave={() => activeDropdown !== 'finance' && setActiveDropdown(null)}
                                onClick={() => toggleDropdown('finance')}
                            >
                                <div>금융상품</div>
                                {(activeDropdown === 'finance') && (
                                    <div className="dropdown_menu show">
                                        <div className="dropdown_menu_div">
                                            <ul>
                                                <li><a href='/deposit-list'>예금상품 리스트</a></li>
                                                <li><a href='/DepositMain'>예금상품 메인</a></li>
                                                <li><a href='/saving-list'>적금상품 리스트</a></li>
                                                <li><a href='/saving-main'>적금상품 메인</a></li>
                                                <li><a href='/LoanList'>대출상품 리스트</a></li>
                                                <li><a href='/Repayment'>중도상환</a></li>
                                                <li><a href='/Calculatior'>대출 이자계산기</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </li>
                            <li 
                                onMouseEnter={() => setActiveDropdown('exchange')}
                                onMouseLeave={() => activeDropdown !== 'exchange' && setActiveDropdown(null)}
                                onClick={() => toggleDropdown('exchange')}
                            >
                                <div>외환</div>
                                {(activeDropdown === 'exchange') && (
                                    <div className="dropdown_menu show">
                                        <div className="dropdown_menu_div">
                                            <ul>
                                                <li><a href="/exchange-rate">실시간 환율</a></li>
                                                <li><a href="/exchange">환전 신청</a></li>
                                                <li><a href="/exchangeList">환전 내역</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </li>
                            <li 
                                onMouseEnter={() => setActiveDropdown('tax')}
                                onMouseLeave={() => activeDropdown !== 'tax' && setActiveDropdown(null)}
                                onClick={() => toggleDropdown('tax')}
                            >
                                <div>공과금</div>
                                {(activeDropdown === 'tax') && (
                                    <div className="dropdown_menu show">
                                        <div className="dropdown_menu_div">
                                            <ul>
                                                <li><a href="/tax/elec">공과금 납부</a></li>
                                                <li><a href="/tax/History">이용 내역</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </li>
                            <li 
                                onMouseEnter={() => setActiveDropdown('asset')}
                                onMouseLeave={() => activeDropdown !== 'asset' && setActiveDropdown(null)}
                                onClick={() => toggleDropdown('asset')}
                            >
                                <div>자산관리</div>
                                {(activeDropdown === 'asset') && (
                                    <div className="dropdown_menu show">
                                        <div className="dropdown_menu_div">
                                            <ul>
                                                <li><a href="/myAsset">자산현황</a></li>
                                                <li><a href="/asset-calendar">자산캘린더</a></li>
                                                <li><a href="/AssetsAnalysis">자산분석</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </li>
                            <li onClick={moveInvestment}>
                                <div>투자</div>
                            </li>
                        </ul>
                    </div>
                    <div className='nav_iconMenu'>
                        <button onClick={handleSearchBar}><div className="nav_search"><FaSearch className='nav_search_icon' /></div></button>
                        <button><div className="nav_allMenu"><GiHamburgerMenu className='nav_toggle_icon' /></div></button>
                        {token ? (
                            <>
                                <button onClick={navMyPage}><div className="nav_logout">마이페이지</div></button>
                                <button onClick={handleLogout}><div className="nav_logout"><CiLogout className="nav_logout_icon" /></div></button>
                            </>
                        ) : (
                            <button><div className="nav_login"><a href='/login'><MdOutlineLogin className='nav_login_icon' /></a></div></button>
                        )}
                    </div>
                </div>
            ) : (
                <div className='SearchBar_div'>
                    <button onClick={handleSearchBar}><IoCloseSharp /></button>
                    <SearchBar onSearch={handleSearchBar} />
                </div>
            )}
        </>
    );
}

export default Navbar;
