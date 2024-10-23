import React, { useEffect, useState } from "react";
import axios from "axios";
import Carouesl_Main from './Carousel';
import Middlebar from './Middlebar';
import BottomNewsBoard from './BottomNewsBoard';
import ChatBotButton from './ChatBotButton';
import ExchangeRateChart from '../page/exchangePage/ExchangeRateChart'; // 차트 컴포넌트 추가

function Main() {
    const [exchangeRates, setExchangeRates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const responseUSD = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
                const responseJPY = await axios.get('https://api.exchangerate-api.com/v4/latest/JPY');
                const responseCNY = await axios.get('https://api.exchangerate-api.com/v4/latest/CNY');
                const responseGBP = await axios.get('https://api.exchangerate-api.com/v4/latest/GBP');
                const responseEUR = await axios.get('https://api.exchangerate-api.com/v4/latest/EUR');

                const ratesUSD = responseUSD.data.rates;
                const ratesJPY = responseJPY.data.rates;
                const ratesCNY = responseCNY.data.rates;
                const ratesGBP = responseGBP.data.rates;
                const ratesEUR = responseEUR.data.rates;

                const KRW_USD = ratesUSD['KRW'];
                const KRW_JPY = ratesJPY['KRW'] * 100;
                const KRW_CNY = ratesCNY['KRW'];
                const KRW_GBP = ratesGBP['KRW'];
                const KRW_EUR = ratesEUR['KRW'];

                const filteredRates = [
                    { cur_unit: 'USD', deal_bas_r: KRW_USD },
                    { cur_unit: 'JPY', deal_bas_r: KRW_JPY },
                    { cur_unit: 'CNY', deal_bas_r: KRW_CNY },
                    { cur_unit: 'GBP', deal_bas_r: KRW_GBP },
                    { cur_unit: 'EUR', deal_bas_r: KRW_EUR }
                ];
                setExchangeRates(filteredRates);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
                setLoading(false);
            }
        };

        fetchExchangeRates();
    }, []);

    return (
        <div className='main'>
            <div className="MainPage-container">
                <div className='Carouesl_Main'>
                    <Carouesl_Main />
                </div>
                <div className='ExchangeRateSection'>
                    {/* 데이터를 ExchangeRateChart에 전달 */}
                    {loading ? (
                        <p>환율 데이터를 불러오는 중...</p>
                    ) : (
                        <ExchangeRateChart exchangeRates={exchangeRates} />
                    )}
                </div>
            </div>

            <div className='Menu_bar'>
                <Middlebar />
            </div>

            <div className='Board_main'>
                <BottomNewsBoard />
                <ChatBotButton />
            </div>
        </div>
    );
}

export default Main;
