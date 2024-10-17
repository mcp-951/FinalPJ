import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Footer from '../../util/Footer'; // Footer 컴포넌트 임포트
import euFlag from './free-icon-european-union-206593.png'; // 유로 깃발 이미지 임포트

const ExchangeRate = () => {
    const [exchangeRates, setExchangeRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('buy'); // 'buy' 또는 'sell'
    
    // API 호출
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
                const KRW_JPY = ratesJPY['KRW'] * 100; // 엔화는 100 곱해서 출력
                const KRW_CNY = ratesCNY['KRW'];
                const KRW_GBP = ratesGBP['KRW'];
                const KRW_EUR = ratesEUR['KRW'];

                const filteredRates = [
                    { cur_unit: 'USD', deal_bas_r: KRW_USD, bkpr: KRW_USD * 1.02, tts: KRW_USD * 0.98, flag: 'US', symbol: '$' },
                    { cur_unit: 'JPY', deal_bas_r: KRW_JPY, bkpr: KRW_JPY * 1.02, tts: KRW_JPY * 0.98, flag: 'JP', symbol: '¥' },
                    { cur_unit: 'CNY', deal_bas_r: KRW_CNY, bkpr: KRW_CNY * 1.02, tts: KRW_CNY * 0.98, flag: 'CN', symbol: '元' },
                    { cur_unit: 'GBP', deal_bas_r: KRW_GBP, bkpr: KRW_GBP * 1.02, tts: KRW_GBP * 0.98, flag: 'GB', symbol: '£' },
                    { cur_unit: 'EUR', deal_bas_r: KRW_EUR, bkpr: KRW_EUR * 1.02, tts: KRW_EUR * 0.98, flag: euFlag, symbol: '€' } // 유로는 로컬 이미지 사용
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
        <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px' }}>실시간 환율</h2>
            {loading ? (
                <p style={{ fontSize: '18px' }}>로딩 중...</p>
            ) : (
                <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                    <select
                        onChange={(e) => setActiveTab(e.target.value)}
                        style={{ position: 'absolute', top: '-30px', right: 0, fontSize: '18px' ,width: '10%'}}
                    >
                        <option value="buy">살 때</option>
                        <option value="sell">팔 때</option>
                    </select>
                    <table border="1" style={{ margin: '20px auto', width: '100%', fontSize: '30px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#66b2b2', color: 'white', fontSize: '30px' }}>
                                <th>국가</th>
                                <th>통화</th>
                                <th>현재 환율 (원)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exchangeRates.map((rate) => (
                                <tr key={rate.cur_unit}>
                                    <td style={{ backgroundColor: '#f2f2f2' }}>
                                        <img 
                                            src={rate.flag === euFlag ? euFlag : `https://flagsapi.com/${rate.flag}/flat/64.png`} 
                                            alt={`${rate.cur_unit} flag`} 
                                            style={{ width: '80px', height: '60px' }} // 국기 크기 키움
                                        />
                                    </td>
                                    <td>
                                        {rate.cur_unit} <span style={{ fontSize: '24px' }}>{rate.symbol}</span>
                                    </td>
                                    <td>{(activeTab === 'buy' ? rate.bkpr : rate.tts).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '100px' }}>
                <Link to="/detail-rate">
                    <button style={{ fontSize: '20px', backgroundColor: '#66b2b2', color: 'white', borderRadius: '10px', padding: '10px 70px' }}>국가별 환율</button>
                </Link>
                <Link to="/exchange">
                    <button style={{ fontSize: '20px', backgroundColor: '#66b2b2', color: 'white', borderRadius: '10px', padding: '10px 70px' }}>환전 신청</button>
                </Link>
                <Link to="/exchangeList">
                    <button style={{ fontSize: '20px', backgroundColor: '#66b2b2', color: 'white', borderRadius: '10px', padding: '10px 70px' }}>환전 내역</button>
                </Link>
            </div>

            <div style={{ width: '100%', marginTop: '200px' }}>
                <Footer />
            </div>
        </div>
    );
};

export default ExchangeRate;