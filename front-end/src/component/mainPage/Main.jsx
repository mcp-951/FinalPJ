import React, { useEffect } from "react";
import Carouesl_Main from './Carousel';
import RightMenu from './RightMenu';
import Middlebar from './Middlebar';
import BottomNewsBoard from './BottomNewsBoard';
import Footer from '../util/Footer';
import ChatBotButton from './ChatBotButton';

function Main() {
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
                {/* <BottomNoticeBoard />*/
                <BottomNewsBoard /> }
            </div>
            <ChatBotButton />
            <Footer />
        </div>
    );
}

export default Main;
