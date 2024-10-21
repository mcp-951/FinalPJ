import React, { useState, useEffect } from 'react';

function getNewAccount() {
    return(
        <div className="getAccount">
            <div className="img"><img src="resource/img/newbie.jpg" /></div>
            <div className="DepositProduct-search-controls">
            <div className="DepositProduct-search-bar">
              <select>
                <option value="전체">전체</option>
                <option value="분류">분류</option>
                <option value="상품명">상품명</option>
                <option value="금리">금리</option>
                <option value="금액">금액</option>
              </select>
              <input type="text" placeholder="검색어를 입력하세요" />
              <button>검색</button>
            </div>
            <button onClick={handleRegister}>등록</button>
          </div>
        </div>
        );
}

export default getNewAccount;