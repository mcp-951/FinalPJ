import React from 'react';
import { useLocation } from 'react-router-dom';

const ExchangeResult = () => {
    const location = useLocation();
    const {date, branch} = location.state || {}; // 빈 객체를 기본값으로 설정

    return (
        <div>
            <h1>신청이 완료되었습니다</h1>
           
            {date && branch && <p>{date}에 {branch}에 방문 해주세요.</p>}
        </div>
    );
};

export default ExchangeResult;
