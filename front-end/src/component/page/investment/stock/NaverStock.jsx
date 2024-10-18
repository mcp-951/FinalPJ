import React, {useState, useEffect} from "react";
import {LineChart, Line, XAxis, YAxis,ResponsiveContainer} from 'recharts';
import '../../../../resource/css/investment/StockMain.css'

function NaverStock(){
    const [stockPrice, setStockPrice] = useState(null);
    const [stockData, setStockData] = useState([]);


    console.log(stockData);

    useEffect(() => {
        const fetchStockData = async () => {
            const url = 'https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo?serviceKey=tqRVFQ9BDH11cOzb19t6hpP%2BPSNNHtuCCNf5lLN5GHa%2FqkZoPdzXx247yVaeI%2B67eSxufozQlXK0v%2Fcs%2FYdZXA%3D%3D&numOfRows=60&resultType=json&itmsNm=NAVER';
            try {
              const response = await fetch(url);
              const data = await response.json();
              const items = data.response.body.items.item;

              if (items.length > 0) {
                const recentClosingPrice = items[0].clpr;
                setStockPrice(recentClosingPrice);
              }
      
              // basDt와 clpr 값을 추출하여 새로운 배열 생성
              const formattedData = items.map(item => ({
                data: item.basDt,
                price: item.clpr,
              })).reverse();
              
              console.log(formattedData);
              setStockData(formattedData);
            } catch (error) {
              console.log(error);
            }
          };
          fetchStockData();
        }, []);
    

    return(
    <div className="Stock_kospi">
        <div>
            <h5>Naver</h5>
            <h5>₩{stockPrice}</h5>
        </div>
        <ResponsiveContainer width={200} height={150}>
            <LineChart data={stockData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="date" tick={false} stroke="transparent" />
                <YAxis domain={[140000, 190000]} ticks={null} orientation="left" tick={false} stroke="transparent"/>
                <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false}/>
            </LineChart>
        </ResponsiveContainer>
    </div>
    );
}

export default NaverStock;
