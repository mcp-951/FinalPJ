import React, { useEffect } from "react";
import Carouesl_Main from './Carousel';
import RightMenu from './RightMenu';
import Middlebar from './Middlebar';
import BottomNoticeBoard from './BottomNoticeBoard';
import BottomNewsBoard from './BottomNewsBoard';
import Footer from '../util/Footer';

function Main() {
    // 토큰과 userNo를 localStorage에서 가져오기
    const token = localStorage.getItem("token");
    const userNo = localStorage.getItem("userNo");

    useEffect(() => {
        if (token && userNo) {
            console.log("유효한 토큰과 userNo가 있습니다:");
            console.log("토큰:", token); 
            console.log("User No:", userNo);
        } else {
            console.log("토큰 또는 유저 번호가 없습니다.");
        }
    }, [token, userNo]);

    return (
        <div className='main'>
            <div>
                <div className='Carouesl_Main'>
                    <Carouesl_Main />
                    <RightMenu />
                </div>
            </div>
            <div className='Menu_bar'>
                <Middlebar />
            </div>
            <div className='Board_main'>
                {/* 필요한 경우 공지사항과 뉴스 보드를 사용 */}
                {/* <BottomNoticeBoard />
                <BottomNewsBoard /> */}
            </div>
            <Footer />
            
            {/* 토큰과 userNo 출력 */}
            {token ? <p>토큰: {token}</p> : <p>로그인이 필요합니다.</p>}
            {userNo ? <p>유저 번호: {userNo}</p> : <p>유저 번호를 찾을 수 없습니다.</p>}
        </div>
    );
}

export default Main;
