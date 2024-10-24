import React, { useEffect, useState } from "react";
import axios from "axios";
import ExchangeRateTable from '../page/exchange/ExchangeRateTable'; // 테이블 컴포넌트 import
import '../../../resource/css/exchange/ExchangeRateTable.css'; // CSS 파일 import

function Main() {
    const [exchangeRates, setExchangeRates] = useState([]);

    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
                const rates = response.data.rates;
                setExchangeRates([
                    { deal_bas_r: rates.KRW },
                    { deal_bas_r: rates.JPY * 100 },
                    { deal_bas_r: rates.CNY },
                    { deal_bas_r: rates.GBP },
                    { deal_bas_r: rates.EUR }
                ]);
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
            }
        };

        fetchExchangeRates();
    }, []);

    return (
        <div className="MainPage">
            <h1>메인 페이지</h1>
            <ExchangeRateTable exchangeRates={exchangeRates} />
        </div>
    );
}

export default Main;
