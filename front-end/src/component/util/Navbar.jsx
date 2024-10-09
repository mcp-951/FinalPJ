import '../../resource/css/util/Navbar.css'
import React, {useState} from "react";
import { FaSearch } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineLogin } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import AccountDrop from './NavbarDropdownMenu/AccountDrop';
import ProductDrop from './NavbarDropdownMenu/ProductDrop';
import ExchangeDrop from './NavbarDropdownMenu/ExchangeDrop';
import TaxDrop from './NavbarDropdownMenu/TaxDrop';
import ManageDrop from './NavbarDropdownMenu/ManageDrop';
import InvestmentDrop from './NavbarDropdownMenu/InvestmentDrop';


function Navbar(){
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        console.log(token);
        localStorage.clear();
        window.location.reload();
    };
    const [menuOpen, setMenuOpen] = useState(false);

    const handleDropdown = (menu) => {
        setMenuOpen(menuOpen === menu ? null : menu);
    };
    return(
        <>
        <div className="navbar_header">
            <div className="nav_logo"><a href='/'><img src="/images/main/logo2.png" /></a></div>
            <div className='nav_menu'>
                <ul>
                    <li onClick={() => handleDropdown('account')}><div>계좌</div></li>
                    <li onClick={()=> handleDropdown('product')}><div>금융상품</div></li>
                    <li onClick={()=> handleDropdown('exchange')}><div>외환</div></li>
                    <li onClick={()=> handleDropdown('tax')}><div>공과금</div></li>
                    <li onClick={()=> handleDropdown('manage')}><div>자산관리</div></li>
                    <li onClick={()=> handleDropdown('investment')}><div>투자</div></li>
                </ul>
            </div>
            <div className='nav_iconMenu'>
                <button><div className="nav_search"><FaSearch className='nav_search_icon'/></div></button>
                <button><div className="nav_allMenu"><GiHamburgerMenu className='nav_toggle_icon'/></div></button>
                {token ? (<button onClick={handleLogout}><div className="nav_logout"><CiLogout className="nav_logout_icon"/></div></button>)
                 : (<button><div className="nav_login" ><a href='/login'><MdOutlineLogin className='nav_login_icon' /></a></div></button>)}
                
            </div>
        </div>
        {menuOpen === 'account' && (<AccountDrop/>)}
        {menuOpen === 'product' && (<ProductDrop/>)}
        {menuOpen === 'exchange' &&(<ExchangeDrop/>)}
        {menuOpen === 'tax' &&(<TaxDrop/>)}
        {menuOpen === 'manage' &&(<ManageDrop/>)}
        {menuOpen === 'investment' &&(<InvestmentDrop/>)}
        </>
    );


}

export default Navbar;