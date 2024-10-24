import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../../../resource/css/admin/Sidebar.css';

const Sidebar = () => {
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [showFinancialDropdown, setShowFinancialDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showBillsDropdown, setShowBillsDropdown] = useState(false);
  const [showInquiryDropdown, setShowInquiryDropdown] = useState(false);

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
                  <NavLink to="/adMemberList">회원 리스트</NavLink>
                </li>
                <li>
                  <NavLink to="/adRetiredMember">탈퇴 회원</NavLink>
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
                  <NavLink to="/admin/adFinancialProduct">전체</NavLink>
                </li>
                <li>
                  <NavLink to="/admin/adSavingsProduct">적금상품 관리</NavLink>
                </li>
                <li>
                  <NavLink to="/admin/adDepositProduct">예금상품 관리</NavLink>
                </li>
                <li>
                  <NavLink to="/admin/adLoanProduct">대출상품 관리</NavLink>
                </li>
              </ul>
            )}
          </li>

          <li
            onMouseEnter={() => setShowFinancialDropdown(true)}
            onMouseLeave={() => setShowFinancialDropdown(false)}
          >
            대출가입현황
            {showFinancialDropdown && (
              <ul className="dropdown">
                <li>
                  <NavLink to="/admin/adLoanJoinList">대출가입현황</NavLink>
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
                  <NavLink to="/admin/adTransactionHistory">거래 로그</NavLink>
                </li>
                <li>
                  <NavLink to="/admin/adAccount">정상 계좌</NavLink>
                </li>
                <li>
                  <NavLink to="/admin/adAccountStop">정지 계좌</NavLink>
                </li>
                <li>
                  <NavLink to="/admin/adAccountClosure">해지 계좌</NavLink>
                </li>
              </ul>
            )}
          </li>

          <li
            onMouseEnter={() => setShowBillsDropdown(true)}
            onMouseLeave={() => setShowBillsDropdown(false)}
          >
            공과금 관리
            {showBillsDropdown && (
              <ul className="dropdown">
                <li>
                  <NavLink to="/adTaxInsert">청구서 작성</NavLink>
                </li>
                <li>
                  <NavLink to="/adTaxList">납부 현황</NavLink>
                </li>
              </ul>
            )}
          </li>

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
    </div>
  );
};

export default Sidebar;
