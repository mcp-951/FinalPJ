import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../../../resource/css/admin/Sidebar.css';

const Sidebar = () => {
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [showFinancialDropdown, setShowFinancialDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showExchangeDropdown, setShowExchangeDropdown] = useState(false);
  const [showInquiryDropdown, setShowInquiryDropdown] = useState(false); // 문의 관리 드롭다운

  return (
    <div className="sidebar">
      <h2>관리자 페이지</h2>

      <div className="middle-menu">
        <ul>
          <li
            onMouseEnter={() => setShowMemberDropdown(true)}
            onMouseLeave={() => setShowMemberDropdown(false)}
          >
            회원 관리
            {showMemberDropdown && (
              <ul className="dropdown">
                <li>
                  <NavLink to="/memberList">회원 리스트</NavLink>
                </li>
                <li>
                  <NavLink to="/retiredMember">탈퇴 회원</NavLink>
                </li>
              </ul>
            )}
          </li>

          <li
            onMouseEnter={() => setShowFinancialDropdown(true)}
            onMouseLeave={() => setShowFinancialDropdown(false)}
          >
            금융상품 관리
            {showFinancialDropdown && (
              <ul className="dropdown">
                <li>
                  <NavLink to="/admin/financialProduct">전체</NavLink>
                </li>
                <li>
                  <NavLink to="/admin/savingsProduct">예금상품 관리</NavLink>
                </li>
                <li>
                  <NavLink to="/admin/depositProduct">적금상품 관리</NavLink>
                </li>
                <li>
                  <NavLink to="/admin/loanProduct">대출상품 관리</NavLink>
                </li>
              </ul>
            )}
          </li>

          <li
            onMouseEnter={() => setShowAccountDropdown(true)}
            onMouseLeave={() => setShowAccountDropdown(false)}
          >
            계좌 관리
            {showAccountDropdown && (
              <ul className="dropdown">
                <li>
                  <NavLink to="/admin/transactionHistory">거래 현황</NavLink>
                </li>
                <li>
                  <NavLink to="/admin/accountClosure">계좌 해지 관리</NavLink>
                </li>
              </ul>
            )}
          </li>

          <li
            onMouseEnter={() => setShowExchangeDropdown(true)}
            onMouseLeave={() => setShowExchangeDropdown(false)}
          >
            환전 관리
            {showExchangeDropdown && (
              <ul className="dropdown">
                <li>
                  <NavLink to="/exchangeHistory">환전 현황</NavLink>
                </li>
                <li>
                  <NavLink to="/exchangeLocation">수령 지점</NavLink>
                </li>
              </ul>
            )}
          </li>

          <li
            onMouseEnter={() => setShowAccountDropdown(true)}
            onMouseLeave={() => setShowAccountDropdown(false)}
          >
            공과금 관리
            {showAccountDropdown && (
              <ul className="dropdown">
                <li>
                  <NavLink to="/taxInsert">청구서 작성</NavLink>
                </li>
                <li>
                  <NavLink to="/taxList">납부 현황</NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* 문의 관리 추가 */}
          <li
            onMouseEnter={() => setShowInquiryDropdown(true)}
            onMouseLeave={() => setShowInquiryDropdown(false)}
          >
            문의 관리
            {showInquiryDropdown && (
              <ul className="dropdown">
                <li>
                  <NavLink to="/admin/support/inquiries">문의글 리스트</NavLink>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>

      <div className="admin-manage">
        <NavLink to="/adminList">관리자 관리</NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
