import React from "react";
import Carouesl_Main from './Carousel';
import Middlebar from './Middlebar';
import BottomNewsBoard from './BottomNewsBoard';

function Main() {
    return (
        <div className='main'>
            <div>
                <div className='Carouesl_Main'>
                    <Carouesl_Main />
                </div>
            </div>

            <div className='Menu_bar'>
                <Middlebar />
            </div>
            <div className='Board_main'>
                {/* 필요한 경우 공지사항과 뉴스 보드를 사용 */}
                {/* <BottomNoticeBoard />*/
                <BottomNewsBoard /> }
            </div>
        </div>
    );
}

export default Main;
