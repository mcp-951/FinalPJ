import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RedirectPage() {
    const navigate = useNavigate();

    useEffect(() => {
        // URL에서 code 파라미터 추출
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (code) {
            // 부모 창에 code 전달
            window.opener.postMessage({ code }, window.location.origin);

            // 팝업 닫기
            window.close();
        } else {
            console.error('카카오 로그인 코드가 없습니다.');
            navigate('/'); // 코드가 없으면 메인 페이지로 리다이렉트
        }
    }, [navigate]);

    return (
        <div>
            <h2>카카오 로그인 처리 중...</h2>
        </div>
    );
}

export default RedirectPage;