import React from "react";
import {LineChart, Line, XAxis, YAxis,ResponsiveContainer} from 'recharts';
import '../../../resource/css/investment/StockMain.css'

function StockMain(props){
    const stockData = [
        { date: '1월', price: props.p1 },
        { date: '2월', price: props.p2 },
        { date: '3월', price: props.p3 },
        { date: '4월', price: props.p4 },
        { date: '5월', price: props.p5},
        { date: '6월', price: props.p6 },
        { date: '7월', price: props.p7 },
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
                <YAxis domain={[2500, 2900]} ticks={[2550, 2600, 2650, 2700, 2750, 2800, 2850, 2900]} orientation="left" tick={false} stroke="transparent"/>
                <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false}/>
            </LineChart>
        </ResponsiveContainer>
    </div>
    );
}

export default StockMain;
