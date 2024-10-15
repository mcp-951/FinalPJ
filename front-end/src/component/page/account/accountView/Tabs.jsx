import React from 'react';

const Tabs = ({ selectedTab, onSelectTab }) => (
  <div className="tab-menu">
    <button
      className={selectedTab === "전체" ? "active" : ""}
      onClick={() => onSelectTab("전체")}
    >
      전체
    </button>
    <button
      className={selectedTab === "예금" ? "active" : ""}
      onClick={() => onSelectTab("예금")}
    >
      예금
    </button>
    <button
      className={selectedTab === "적금" ? "active" : ""}
      onClick={() => onSelectTab("적금")}
    >
      적금
    </button>
    <button
      className={selectedTab === "대출" ? "active" : ""}
      onClick={() => onSelectTab("대출")}
    >
      대출
    </button>
  </div>
);

export default Tabs;
