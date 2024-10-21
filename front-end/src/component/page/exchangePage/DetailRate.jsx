import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../../util/Footer'; // Footer 컴포넌트 임포트
import euFlag from './free-icon-european-union-206593.png'; // 유로 깃발 이미지 임포트
import '../../../resource/css/exchange/DetailRate.css'; // CSS 파일 임포트

const DetailRate = () => {
    const [exchangeRates, setExchangeRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('buy');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const navigate = useNavigate();

    // 국가별 통화 정보 정의
    const currencyData = {
        AED: { name: '아랍에미리트 디르함', flag: 'AE', symbol: 'د.إ' },
        ALL: { name: '알바니아 렉', flag: 'AL', symbol: 'L' },
        AMD: { name: '아르메니아 드람', flag: 'AM', symbol: '֏' },
        AOA: { name: '앙골라 콴자', flag: 'AO', symbol: 'Kz' },
        ARS: { name: '아르헨티나 페소', flag: 'AR', symbol: '$' },
        AUD: { name: '호주 달러', flag: 'AU', symbol: 'A$' },
        AZN: { name: '아제르바이잔 마나트', flag: 'AZ', symbol: '₼' },
        BAM: { name: '보스니아-헤르체고비나 마르크', flag: 'BA', symbol: 'KM' },
        BDT: { name: '방글라데시 타카', flag: 'BD', symbol: '৳' },
        BGN: { name: '불가리아 레프', flag: 'BG', symbol: 'лв' },
        BHD: { name: '바레인 디나르', flag: 'BH', symbol: 'ب.د' },
        BND: { name: '브루나이 달러', flag: 'BN', symbol: 'B$' },
        BRL: { name: '브라질 레알', flag: 'BR', symbol: 'R$' },
        BSD: { name: '바하마 달러', flag: 'BS', symbol: '$' },
        CAD: { name: '캐나다 달러', flag: 'CA', symbol: 'C$' },
        CHF: { name: '스위스 프랑', flag: 'CH', symbol: 'CHF' },
        CLP: { name: '칠레 페소', flag: 'CL', symbol: '$' },
        CNY: { name: '중국 위안', flag: 'CN', symbol: '元' },
        COP: { name: '콜롬비아 페소', flag: 'CO', symbol: '$' },
        CRC: { name: '코스타리카 콜론', flag: 'CR', symbol: '₡' },
        CUP: { name: '쿠바 페소', flag: 'CU', symbol: '₱' },
        CZK: { name: '체코 코루나', flag: 'CZ', symbol: 'Kč' },
        DKK: { name: '덴마크 크로네', flag: 'DK', symbol: 'kr' },
        DOP: { name: '도미니카 페소', flag: 'DO', symbol: 'RD$' },
        DZD: { name: '알제리 디나르', flag: 'DZ', symbol: 'دج' },
        EGP: { name: '이집트 파운드', flag: 'EG', symbol: '£' },
        ETB: { name: '에티오피아 비르', flag: 'ET', symbol: 'Br' },
        EUR: { name: '유로', flag: euFlag, symbol: '€' }, // 유로는 로컬 이미지 사용
        GBP: { name: '영국 파운드', flag: 'GB', symbol: '£' },
        GEL: { name: '조지아 라리', flag: 'GE', symbol: '₾' },
        GHS: { name: '가나 세디', flag: 'GH', symbol: '₵' },
        HKD: { name: '홍콩 달러', flag: 'HK', symbol: 'HK$' },
        HUF: { name: '헝가리 포린트', flag: 'HU', symbol: 'Ft' },
        IDR: { name: '인도네시아 루피아', flag: 'ID', symbol: 'Rp' },
        INR: { name: '인도 루피', flag: 'IN', symbol: '₹' },
        ISK: { name: '아이슬란드 크로나', flag: 'IS', symbol: 'kr' },
        JPY: { name: '일본 엔화', flag: 'JP', symbol: '¥' },
        USD: { name: '미국 달러', flag: 'US', symbol: '$' },
        VND: { name: '베트남 동', flag: 'VN', symbol: '₫' }
        // ... (다른 국가들도 동일하게 추가)
    };

    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const currencies = Object.keys(currencyData);
                const requests = currencies.map(cur => axios.get(`https://api.exchangerate-api.com/v4/latest/${cur}`));

                const responses = await Promise.all(requests);
                const filteredRates = responses.map((response, index) => {
                    const rates = response.data.rates;
                    const KRW = rates['KRW'];
                    const cur_unit = currencies[index];
                    const currency = currencyData[cur_unit] || {};

                    const adjustedKRW = cur_unit === 'JPY' ? KRW * 100 : KRW;

                    return {
                        cur_unit,
                        name: currency.name || cur_unit,
                        deal_bas_r: adjustedKRW,
                        bkpr: adjustedKRW * 1.02,
                        tts: adjustedKRW * 0.98,
                        flag: cur_unit === 'EUR' ? euFlag : `https://flagsapi.com/${currency.flag}/flat/64.png`,
                        symbol: currency.symbol || ''
                    };
                });

                setExchangeRates(filteredRates);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
                setLoading(false);
            }
        };

        fetchExchangeRates();
    }, []);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = exchangeRates.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="DetailRate-container">
            <h2 className="DetailRate-title">국가별 환율 정보</h2>
            {loading ? (
                <p className="DetailRate-loading">로딩 중...</p>
            ) : (
                <div className="DetailRate-table-wrapper">
                    <select
                        onChange={(e) => setActiveTab(e.target.value)}
                        className="DetailRate-dropdown"
                    >
                        <option value="buy">살 때</option>
                        <option value="sell">팔 때</option>
                    </select>
                    <table className="DetailRate-table">
                        <thead>
                            <tr>
                                <th>국가</th>
                                <th>통화</th>
                                <th>기호</th>
                                <th>이름</th>
                                <th>현재 환율 (원)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((rate) => (
                                <tr key={rate.cur_unit}>
                                    <td>
                                        <img 
                                            src={rate.flag} 
                                            alt={`${rate.cur_unit} flag`} 
                                        />
                                    </td>
                                    <td>{rate.cur_unit}</td>
                                    <td>{rate.symbol}</td>
                                    <td>{rate.name}</td>
                                    <td>{(activeTab === 'buy' ? rate.bkpr : rate.tts).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="DetailRate-pagination">
                        {Array.from({ length: Math.ceil(exchangeRates.length / itemsPerPage) }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={currentPage === index + 1 ? 'active' : ''}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <button
                onClick={() => navigate('/exchange-rate')}
                className="DetailRate-backButton"
            >
                뒤로
            </button>

            <div className="DetailRate-footer">
                <Footer />
            </div>
        </div>
    );
};

export default DetailRate;
