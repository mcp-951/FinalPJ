import'../../../resource/css/investment/InvestmentMain.css'
import React, { useEffect, useState } from 'react';
import SamsungStock from './stock/SamsungStock';
import LGelectroStock from './stock/LGelectroStock';
import SKhinicks from './stock/SKhinicks';
import NaverStock from './stock/NaverStock';
import Bitcoin from './coin/Bitcoin';
import Ehereum from './coin/Ehereum';
import Ripple from './coin/Ripple';
import Solana from './coin/Solana';
import StockList from './stock/StockList';

function InvestmentMain(){

  const [prices, setPrices] = useState({});
  const coins = [
      { name: '비트코인', symbol: 'BTCUSDT' },
      { name: '이더리움', symbol: 'ETHUSDT' },
      { name: '솔라나', symbol: 'SOLUSDT' },
      { name: '리플', symbol: 'XRPUSDT' },
  ];

  useEffect(() => {
    // WebSocket 연결 설정
    const socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker/ethusdt@ticker/solusdt@ticker/xrpusdt@ticker');

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const symbol = data.s; // 거래 쌍 이름
        const currentPrice = data.c; // 현재 가격

        // 실시간 가격 상태 업데이트
        setPrices(prevPrices => ({
            ...prevPrices,
            [symbol]: currentPrice,
        }));
    };
    // 컴포넌트 언마운트 시 WebSocket 연결 종료
    return () => {
        socket.close();
    };    
    }, []);

    return (
        <div className="investConteiner">
          <div className="Content">
            {/* 주식바 시작. */}
            <div className="StockBar">
              <div className="StockBarTitle">
                <h4>주가지수</h4>
                <a href="/">+ 더보기</a>
              </div>
              <SamsungStock />
              <LGelectroStock />
              <SKhinicks />
              <NaverStock />
            </div>
            {/* 주식바 끝. */}
            {/* 코인바 시작됩니다. */}
            <div className="CoinBar">
              <div className="CoinBarTitle">
                <h4>코인동향</h4>
                <a href="/">+ 더보기</a>
              </div>
              <Bitcoin />
              <Ehereum />
              <Solana />
              <Ripple />
            </div>
            {/* 코인바 끝. */}
            <div className='Stock_List'>
              <StockList />
            </div>
          </div>
        </div>
    );
}

export default InvestmentMain;