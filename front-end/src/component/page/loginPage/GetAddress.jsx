import React from 'react';
import DaumPostcode from 'react-daum-postcode';

function getAddress() {
    const handleComplete = (data) => {
        // 부모 창으로 메시지 전달
        window.opener.postMessage({ address: data.address }, window.location.origin);
        window.close(); // 팝업 닫기
    };

    return (
        <div>
            <DaumPostcode onComplete={handleComplete} />
            <button onClick={() => window.close()}>닫기</button>
        </div>
    );
}

export default getAddress;