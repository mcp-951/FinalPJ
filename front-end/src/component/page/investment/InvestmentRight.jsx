import React, { useEffect, useState } from 'react';
import '../../../resource/css/investment/InvestmentRight.css';

function InvestmentRight() {
    const [prices, setPrices] = useState({}); // 실시간 가격 상태

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
        <div className="StockRightBar">
            <table>
                <thead>
                    <tr className="tableHead">
                        <th className="colName">종목명</th>
                        <th className="colPrice">현재 가격</th>
                        <th className="colIncrease">증감률</th>
                        <th className="colTotalPrice">총시가</th>
                    </tr>
                </thead>
                <tbody>
                    {coins.map((coin) => (
                        <tr key={coin.symbol}>
                            <td className="dataColName">
                                <a>{coin.name}</a>
                                <a>{coin.symbol}</a>
                            </td>
                            <td className="dataColPrice">
                                <a>${(prices[coin.symbol] ? parseFloat(prices[coin.symbol]).toFixed(4) : 'Loading...')}</a>
                            </td>
                            <td className="dataColIncrease">
                                <a>%</a> {/* 증감률은 추가적으로 구현 가능 */}
                            </td>
                            <td className="dataColTotalPrice">
                                <a></a> {/* 총시가는 추가적으로 구현 가능 */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default InvestmentRight;