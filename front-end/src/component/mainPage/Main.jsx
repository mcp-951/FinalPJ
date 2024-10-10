import React from "react";
import Carouesl_Main from './Carousel';
import RightMenu from'./RightMenu';
import Middlebar from './Middlebar';
import BottomNewsBoard from './BottomNewsBoard';
import Footer from '../util/Footer';

function Main() {
    return (
        <div className = 'main'>
        <div>
            <div className='Carouesl_Main'>
                <Carouesl_Main/>
                <RightMenu/>
            </div>
        </div>
        <div className='Menu_bar'>
            <Middlebar />
        </div>
        <div className='Board_main'>
            <BottomNewsBoard/>
        </div>
        <Footer/>
        </div>
    );
}

export default Main;