import React, { useEffect } from "react";
import Carouesl_Main from './Carousel';
import RightMenu from './RightMenu';
import Middlebar from './Middlebar';
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
<<<<<<< HEAD
            <div className='Menu_bar'>
                <Middlebar />
            </div>
            <div className='Board_main'>
                {/* 필요한 경우 공지사항과 뉴스 보드를 사용 */}
                {/* <BottomNoticeBoard />*/
                <BottomNewsBoard /> }
            </div>
            <Footer />
=======
        </div>
        <div className='Menu_bar'>
            <Middlebar />
        </div>
        <div className='Board_main'>
            <BottomNewsBoard/>
        </div>
        <Footer/>
>>>>>>> 50b13222d0394431ef705665178103e286840219
        </div>
    );
}

export default Main;
