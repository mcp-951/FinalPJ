import InvestmentRight from'./InvestmentRight';
import StockMain from "./StockMain";
import'../../../resource/css/investment/InvestmentMain.css'
import React, { useEffect, useState } from 'react';
function InvestmentMain(){
  const [prices, setPrices] = useState({});

  const coins = [
      { name: '비트코인', symbol: 'BTCUSDT' },
      { name: '이더리움', symbol: 'ETHUSDT' },
      { name: '솔라나', symbol: 'SOLUSDT' },
      { name: '리플', symbol: 'XRPUSDT' },
      // 추가 코인도 여기에 추가
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
              <StockMain title={"코스피"} price={"\\2581.3"} p1 ={0} p2 ={"2500"} p3 ={"2551"} p4 ={"2552"} p5 ={""} p6 ={""} p7 ={""}/>
              <StockMain title={"코스닥"} price={"\\781.3"} p1 ={"5000"} p2 ={"2000"} p3 ={"4000"} p4 ={"3000"} p5 ={"3500"} p6 ={"2000"} p7 ={"1500"}/>
              <StockMain title={"나스닥"} price={"$18,119.3"} p1 ={0} p2 ={""} p3 ={""} p4 ={""} p5 ={""} p6 ={""} p7 ={""}/>
              <StockMain title={"다우지수"} price={"$42,313.0"} p1 ={0} p2 ={""} p3 ={""} p4 ={""} p5 ={""} p6 ={""} p7 ={""}/>
            </div>
            {/* 주식바 끝. */}
            {/* 코인바 시작됩니다. */}
            <div className="CoinBar">
              <div className="CoinBarTitle">
                <h4>코인동향</h4>
                <a href="/">+ 더보기</a>
              </div>
              <StockMain 
                title={"비트코인"} 
                price={`$${prices['BTCUSDT'] ? parseFloat(prices['BTCUSDT']).toFixed(1) : 'Loading...'}`} 
                p1={0} p2={""} p3={""} p4={""} p5={""} p6={""} p7={""}
              />
              <StockMain 
                title={"이더리움"} 
                price={`$${prices['ETHUSDT'] ? parseFloat(prices['ETHUSDT']).toFixed(1) : 'Loading...'}`} 
                p1={0} p2={""} p3={""} p4={""} p5={""} p6={""} p7={""}
              />
              <StockMain 
                title={"솔라나"} 
                price={`$${prices['SOLUSDT'] ? parseFloat(prices['SOLUSDT']).toFixed(1) : 'Loading...'}`} 
                p1={0} p2={""} p3={""} p4={""} p5={""} p6={""} p7={""}
              />
              <StockMain 
                title={"리플"} 
                price={`$${prices['XRPUSDT'] ? parseFloat(prices['XRPUSDT']).toFixed(4) : 'Loading...'}`} 
                p1={0} p2={""} p3={""} p4={""} p5={""} p6={""} p7={""}
              />
            </div>
            {/* 코인바 끝. */}
          </div>
          <div className="RightList">
            <InvestmentRight />
          </div>
        </div>
    );
}

export default InvestmentMain;