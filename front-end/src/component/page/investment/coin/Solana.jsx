import React, {useState, useEffect} from "react";
import {LineChart, Line, XAxis, YAxis,ResponsiveContainer} from 'recharts';
import '../../../../resource/css/investment/StockMain.css'

function Solana(){
    const [stockData, setStockData] = useState([]);
    const [stockPrice, setStockPrice] = useState(null);
  
    useEffect(() => {
      const fetchBitcoinData = async () => {
        const url = 'https://api.binance.com/api/v3/klines?symbol=SOLUSDT&interval=1d&limit=30';
        try {
          const response = await fetch(url);
          const data = await response.json();
  
          // 30일치 데이터 형식화
          const formattedData = data.map(item => ({
            date: new Date(item[0]).toLocaleDateString(), // 캔들스틱 시작 시간 (Unix timestamp를 날짜로 변환)
            price: parseFloat(item[4]), // 종가
          }));
  
          console.log("30일치 데이터:", formattedData);
          setStockData(formattedData);
  
          // 현재 비트코인 가격 가져오기 (마지막 캔들스틱의 종가)
          const currentPrice = formattedData[formattedData.length - 1].price;
          setStockPrice(currentPrice);
        } catch (error) {
          console.log("Error fetching Bitcoin data:", error);
        }
      };
  
      fetchBitcoinData();
    }, []);

    return(
    <div className="Stock_kospi">
        <div>
            <h5>Solana</h5>
            <h5>${stockPrice}</h5>
        </div>
        <ResponsiveContainer width={200} height={150}>
            <LineChart data={stockData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="date" tick={false} stroke="transparent" />
                <YAxis domain={[120, 165]} ticks={null} orientation="left" tick={false} stroke="transparent"/>
                <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false}/>
            </LineChart>
        </ResponsiveContainer>
    </div>
    );
}

export default Solana;
