import React from 'react';
import DaumPostcode from 'react-daum-postcode';
import '../../../resource/css/getAddress.css';

function getAddress() {
    const handleComplete = (data) => {
        // 부모 창으로 메시지 전달
        window.opener.postMessage({ address: data.address }, window.location.origin);
        window.close(); // 팝업 닫기
    };

    return (
        <div className="getAddress-container">
            <div className="getAddress-header">
                <h2>주소 검색</h2>
                <button className="getAddress-close" onClick={() => window.close()}>닫기</button>
            </div>
            <DaumPostcode className="getAddress-postcode" onComplete={handleComplete} />
        </div>
    );
}

export default getAddress;
