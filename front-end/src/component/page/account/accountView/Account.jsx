import React, { useState } from "react";
import '../../../../resource/css/account/accountView/Account.css';
import Total from './Total';
import AccountList from './AccountList';
import Tabs from './Tabs'; // 고정된 상단 탭 컴포넌트

function Account() {
  const [selectedTab, setSelectedTab] = useState("전체");
  const userNo = localStorage.getItem("userNo"); // localStorage에서 userNo 가져오기

  const renderContent = () => {
    switch (selectedTab) {
      case "전체":
        return <Total userNo={userNo} />; // userNo를 Total 컴포넌트에 전달
      case "예금":
        return <AccountList type="예금" userNo={userNo} />; // userNo를 AccountList에 전달
      case "적금":
        return <AccountList type="적금" userNo={userNo} />; // userNo를 AccountList에 전달
      default:
        return <Total userNo={userNo} />; // 기본적으로 userNo를 Total 컴포넌트에 전달
    }
  };

  return (
    <div className="Account-container">
      <h1>계좌 조회</h1>
      {/* 상단 탭 고정 */}
      <div className="Account-tabs">
        <button 
          className={selectedTab === "전체" ? "active" : ""} 
          onClick={() => setSelectedTab("전체")}
        >
          전체
        </button>
        <button 
          className={selectedTab === "예금" ? "active" : ""} 
          onClick={() => setSelectedTab("예금")}
        >
          예금
        </button>
        <button 
          className={selectedTab === "적금" ? "active" : ""} 
          onClick={() => setSelectedTab("적금")}
        >
          적금
        </button>
      </div>
      {/* 탭에 따라 내용 바뀜 */}
      <div className="Account-info">
        {renderContent()}
      </div>
    </div>
  );
}

export default Account;
