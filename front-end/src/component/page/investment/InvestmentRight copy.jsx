import React, { useEffect, useState } from 'react';
import '../../../resource/css/investment/InvestmentRight.css'
import axios from "axios";

function InvestmentRight(){
    const [data, setData] = useState([]);
    useEffect(() => {
        // Spring Boot에서 데이터 가져오기
        axios.get('http://localhost:8080/uram/list')
          .then(response => {
            // 데이터를 상태에 직접 저장
            setData(response.data);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      }, []);
    

    return(
        <div className="StockRightBar">
            <table>
                <thead>
                    <tr className="tableHead">
                        <th className="colName">종목명</th>
                        <th className="colPrice">가격</th>
                        <th className="colIncrease">증감률</th>
                        <th className="colTotalPrice">총시가</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((coin) => (
                        <tr key={coin.coinNo}>
                        <td className="dataColName">
                            <a>{coin.coinName}</a>
                            <a>{coin.coinNick}</a>
                        </td>
                        <td className="dataColPrice">
                            <a>${coin.coinPrice}</a>
                        </td>
                        <td className="dataColIncrease">
                            <a>{coin.coinIncrease}%</a>
                        </td>
                        <td className="dataColTotalPrice">
                            <a>
                                {coin.coinTotalPrice}
                            </a>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default InvestmentRight;