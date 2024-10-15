import React from "react";
import {LineChart, Line, XAxis, YAxis,ResponsiveContainer} from 'recharts';
import '../../../resource/css/investment/StockMain.css'

function StockMain(props){

    const socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');

    socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const price = data.c;
    };
    const stockData = [
        { date: '1월', price: 300 },
        { date: '2월', price: 300 },
        { date: '3월', price: 300 },
        { date: '4월', price: 300 },
        { date: '5월', price: 300},
        { date: '6월', price: 300 },
        { date: '7월', price: 200 },
        { date: '8월', price: 300},
        { date: '9월', price: 300},
    ];

    return(
    <div className="Stock_kospi">
        <div>
            <h5>{props.title}</h5>
            <h5>{props.price}</h5>
        </div>
        <ResponsiveContainer width={200} height={150}>
            <LineChart data={stockData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="date" tick={false} stroke="transparent" />
                <YAxis domain={[100, 400]} ticks={[140, 180, 220, 260, 300, 340, 380, 400]} orientation="left" tick={false} stroke="transparent"/>
                <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false}/>
            </LineChart>
        </ResponsiveContainer>
    </div>
    );
}

export default StockMain;
