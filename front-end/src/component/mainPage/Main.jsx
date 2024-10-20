import React from "react";
import Carouesl_Main from './Carousel';
import Middlebar from './Middlebar';
import BottomNewsBoard from './BottomNewsBoard';
import ChatBotButton from './ChatBotButton';  // 챗봇 버튼 import

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
                <BottomNewsBoard />
            </div>

            {/* 챗봇 버튼 추가 */}
            <div className='ChatBotButton'>
                <ChatBotButton />
            </div>
        </div>
    );
}

export default Main;
