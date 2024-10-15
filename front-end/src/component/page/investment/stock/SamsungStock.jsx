import React, {useState, useEffect} from "react";
import {LineChart, Line, XAxis, YAxis,ResponsiveContainer} from 'recharts';
import '../../../../resource/css/investment/StockMain.css'

function SamsungStock(){
    const min = 165;
    const max = 200;
    const [tickData, setTickData] = useState([]); 

    const symbol = 'AAPL';
    const apiKey = 'cs7b19pr01qtqcar1m0gcs7b19pr01qtqcar1m10';
    const [stockData, setStockData] = useState([]);

    useEffect(() =>{
        const tick = () =>{
            const a = [];
            for(let i = min; i <= max; i++){
                a.push(i);
            }
            setTickData(a);
        }
        tick();
    }, [])



    useEffect(() => {
        const fetchStockData = async () =>{
            const now = Math.floor(Date.now() / 1000);
            const lastWeek = now - 7 * 24 * 60 * 60; // 7일 전의 UNIX 타임스탬프

            const url = `https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=D&from=${lastWeek}&to=${now}&token=${apiKey}`;

            try{
                const response = await fetch(url);
                const data = await response.json();
                console.log(data);

                if (data && data.o) { // 'o'는 개장가 데이터를 포함하는 배열입니다.
                    const formattedData = data.o.map((openPrice, index) => {
                        const date = new Date(data.t[index] * 1000); // UNIX 타임스탬프를 Date 객체로 변환
                        const month = date.toLocaleString('default', { month: 'long' }); // 월 이름을 가져옵니다.
                        
                        return {
                            date: month, // '1월', '2월' 등의 문자열로 저장
                            price: openPrice.toFixed(2), // 소수점 2자리로 포맷
                        };
                    });

                    // 최근 7일 데이터를 setStockData에 저장
                    setStockData(formattedData);
                } else {
                    console.error('No data returned');
                }

            } catch (error) {
                console.log(error);
            }
        };
        fetchStockData();
    }, [apiKey])
    

    return(
    <div className="Stock_kospi">
        <div>
            <h5>삼성전자</h5>
            <h5>₩300</h5>
        </div>
        <ResponsiveContainer width={200} height={150}>
            <LineChart data={stockData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="date" tick={false} stroke="transparent" />
                <YAxis domain={[{min}, {max}]} ticks={{tickData}} orientation="left" tick={false} stroke="transparent"/>
                <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false}/>
            </LineChart>
        </ResponsiveContainer>
    </div>
    );
}

export default SamsungStock;
