import React, { useState, useEffect } from "react";
import '../../../../resource/css/investment/StockList.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from "react-bootstrap";

function StockList() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const symbols = ['BTCUSDT', 'ETHUSDT', 'XRPUSDT', 'SOLUSDT', 'PEPEUSDT', 'DOGEUSDT', 'SHIBUSDT'];

        // 현재 가격을 가져오는 API 호출
        const currentPricePromises = symbols.map(symbol => 
          fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`).then(response => response.json())
        );

        const currentPrices = await Promise.all(currentPricePromises);

        // 24시간 가격 변동 정보를 가져오는 API 호출
        const coinDataPromises = symbols.map(symbol => 
          fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`).then(response => response.json())
        );

        const coinData = await Promise.all(coinDataPromises);

        // 필요한 데이터 가공
        const formattedCoins = coinData.map((coin, index) => ({
          number: index + 1,
          name: coin.symbol.replace('USDT', ''),
          currentPrice: currentPrices[index].price, // 현재 가격
          high: coin.highPrice,
          low: coin.lowPrice,
          prevClose: coin.prevClosePrice,
          volume: parseFloat(coin.volume).toFixed(0), // 거래량 소수점 없이
        }));

        setCoins(formattedCoins);
      } catch (error) {
        console.error("Error fetching data from Binance API:", error);
      }
    };

    fetchCoins();
  }, []);

  const formatPrice = (price) => {
    const numericPrice = parseFloat(price);
    return numericPrice > 10 ? numericPrice.toFixed(1) : numericPrice.toFixed(4);
  };

  return (
    <div className='chartTable'>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>번호</th>
            <th>이름</th>
            <th>현재가격</th>
            <th>고가</th>
            <th>저가</th>
            <th>전일종가</th>
            <th>거래량</th>
          </tr>
        </thead>
        <tbody>
          {coins.map(coin => (
            <tr key={coin.number}>
              <td>{coin.number}</td>
              <td>{coin.name}</td>
              <td>{formatPrice(coin.currentPrice)}</td> {/* 현재가격 표시 */}
              <td>{formatPrice(coin.high)}</td>
              <td>{formatPrice(coin.low)}</td>
              <td>{formatPrice(coin.prevClose)}</td>
              <td>{coin.volume}</td> {/* 거래량은 소수점 없이 표시 */}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default StockList;