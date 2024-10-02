import React, { useState } from "react";
import '../../../../resource/css/account/accountView/Account.css'
import Total from './Total';
import AccountList from './AccountList';
import Tabs from './Tabs'; // 고정된 상단 탭 컴포넌트

function Account() {
  const [selectedTab, setSelectedTab] = useState("전체");

  const renderContent = () => {
    switch (selectedTab) {
      case "전체":
        return <Total />;
      case "예금":
        return <AccountList type="예금" />;
      case "적금":
        return <AccountList type="적금" />;
      case "대출":
        return <AccountList type="대출" />;
      default:
        return <Total />;
    }
  };

  return (
    <div className="account-container">
      <h1>계좌 조회</h1>
      {/* 상단 탭 고정 */}
      <Tabs selectedTab={selectedTab} onSelectTab={setSelectedTab} />
      {/* 탭에 따라 내용 바뀜 */}
      <div className="account-info">
        {renderContent()}
      </div>
    </div>
  );
}

export default Account;
