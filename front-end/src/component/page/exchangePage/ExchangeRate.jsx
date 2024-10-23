import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Footer from '../../util/Footer';
import '../../../resource/css/exchange/ExchangeRate.css'; 
import euFlag from './free-icon-european-union-206593.png';

const ExchangeRate = () => {
    const [exchangeRates, setExchangeRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('buy'); // 'buy' 또는 'sell'

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
                    { cur_unit: 'USD', deal_bas_r: KRW_USD, bkpr: KRW_USD * 1.02, tts: KRW_USD * 0.98, flag: 'US', symbol: '$' },
                    { cur_unit: 'JPY', deal_bas_r: KRW_JPY, bkpr: KRW_JPY * 1.02, tts: KRW_JPY * 0.98, flag: 'JP', symbol: '¥' },
                    { cur_unit: 'CNY', deal_bas_r: KRW_CNY, bkpr: KRW_CNY * 1.02, tts: KRW_CNY * 0.98, flag: 'CN', symbol: '元' },
                    { cur_unit: 'GBP', deal_bas_r: KRW_GBP, bkpr: KRW_GBP * 1.02, tts: KRW_GBP * 0.98, flag: 'GB', symbol: '£' },
                    { cur_unit: 'EUR', deal_bas_r: KRW_EUR, bkpr: KRW_EUR * 1.02, tts: KRW_EUR * 0.98, flag: euFlag, symbol: '€' }
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
        <div className="ExchangeRate-container">
            <h2 className="ExchangeRate-title">실시간 환율</h2>
            {loading ? (
                <p className="ExchangeRate-loading">로딩 중...</p>
            ) : (
                <div>
                    <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                        <select
                            onChange={(e) => setActiveTab(e.target.value)}
                            className="ExchangeRate-dropdown"
                        >
                            <option value="buy">살 때</option>
                            <option value="sell">팔 때</option>
                        </select>
                        <table className="ExchangeRate-table">
                            <thead>
                                <tr>
                                    <th>국가</th>
                                    <th>통화</th>
                                    <th>현재 환율 (원)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exchangeRates.map((rate) => (
                                    <tr key={rate.cur_unit}>
                                        <td>
                                            <img 
                                                src={rate.flag === euFlag ? euFlag : `https://flagsapi.com/${rate.flag}/flat/64.png`} 
                                                alt={`${rate.cur_unit} flag`} 
                                            />
                                        </td>
                                        <td>
                                            {rate.cur_unit} <span>{rate.symbol}</span>
                                        </td>
                                        <td>{(activeTab === 'buy' ? rate.bkpr : rate.tts).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="ExchangeRate-buttons">
                <Link to="/detail-rate">
                    <button className="ExchangeRate-button">국가별 환율</button>
                </Link>
                <Link to="/exchange">
                    <button className="ExchangeRate-button">환전 신청</button>
                </Link>
                <Link to="/exchangeList">
                    <button className="ExchangeRate-button">환전 내역</button>
                </Link>
            </div>

            <div className="ExchangeRate-footer">
                <Footer />
            </div>
        </div>
    );
};

export default ExchangeRate;
