import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useHistory 훅 임포트
import Footer from '../../util/Footer'; // Footer 컴포넌트 임포트
import euFlag from './free-icon-european-union-206593.png'; // 유로 깃발 이미지 임포트

const DetailRate = () => {
    const [exchangeRates, setExchangeRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('buy'); // 'buy' 또는 'sell'
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const navigate = useNavigate(); // useHistory 훅 사용

    // API 호출
    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const currencies = [
                    'AED', 'ALL', 'AMD', 'AOA', 'ARS', 'AUD', 'AZN', 'BAM', 'BDT', 'BGN', 'BHD', 'BND', 'BRL', 'BSD', 
                    'CAD', 'CDF', 'CHF', 'CLP', 'CNY', 'COP', 'CRC', 'CUP', 'CZK', 'DKK', 'DOP', 'DZD', 'EGP', 'ETB', 
                    'EUR', 'GBP', 'GEL', 'GHS', 'GMD', 'GNF', 'GTQ', 'HKD', 'HRK', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 
                    'IRR', 'ISK', 'JPY', 'KHR', 'LAK', 'LKR', 'MAD', 'MNT', 'MXN', 'MYR', 'NGN', 'NOK', 'NZD', 'PEN', 
                    'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RUB', 'SAR', 'SEK', 'THB', 'TRY', 'TWD', 'USD', 'UYU', 'VND'
                ];
                const requests = currencies.map(cur => axios.get(`https://api.exchangerate-api.com/v4/latest/${cur}`));

                const responses = await Promise.all(requests);

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
                    CDF: { name: '콩고 프랑', flag: 'CD', symbol: 'FC' },
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
                    GMD: { name: '감비아 달라시', flag: 'GM', symbol: 'D' },
                    GNF: { name: '기니 프랑', flag: 'GN', symbol: 'FG' },
                    GTQ: { name: '과테말라 케찰', flag: 'GT', symbol: 'Q' },
                    HKD: { name: '홍콩 달러', flag: 'HK', symbol: 'HK$' },
                    HRK: { name: '크로아티아 쿠나', flag: 'HR', symbol: 'kn' },
                    HUF: { name: '헝가리 포린트', flag: 'HU', symbol: 'Ft' },
                    IDR: { name: '인도네시아 루피아', flag: 'ID', symbol: 'Rp' },
                    ILS: { name: '이스라엘 셰켈', flag: 'IL', symbol: '₪' },
                    INR: { name: '인도 루피', flag: 'IN', symbol: '₹' },
                    IQD: { name: '이라크 디나르', flag: 'IQ', symbol: 'ع.د' },
                    IRR: { name: '이란 리알', flag: 'IR', symbol: '﷼' },
                    ISK: { name: '아이슬란드 크로나', flag: 'IS', symbol: 'kr' },
                    JPY: { name: '일본 엔화', flag: 'JP', symbol: '¥' },
                    KHR: { name: '캄보디아 리엘', flag: 'KH', symbol: '៛' },
                    LAK: { name: '라오스 킵', flag: 'LA', symbol: '₭' },
                    LKR: { name: '스리랑카 루피', flag: 'LK', symbol: 'Rs' },
                    MAD: { name: '모로코 디르함', flag: 'MA', symbol: 'د.م.' },
                    MNT: { name: '몽골 투그릭', flag: 'MN', symbol: '₮' },
                    MXN: { name: '멕시코 페소', flag: 'MX', symbol: '$' },
                    MYR: { name: '말레이시아 링깃', flag: 'MY', symbol: 'RM' },
                    NGN: { name: '나이지리아 나이라', flag: 'NG', symbol: '₦' },
                    NOK: { name: '노르웨이 크로네', flag: 'NO', symbol: 'kr' },
                    NZD: { name: '뉴질랜드 달러', flag: 'NZ', symbol: 'NZ$' },
                    PEN: { name: '페루 솔', flag: 'PE', symbol: 'S/' },
                    PHP: { name: '필리핀 페소', flag: 'PH', symbol: '₱' },
                    PKR: { name: '파키스탄 루피', flag: 'PK', symbol: '₨' },
                    PLN: { name: '폴란드 즈워티', flag: 'PL', symbol: 'zł' },
                    PYG: { name: '파라과이 과라니', flag: 'PY', symbol: '₲' },
                    QAR: { name: '카타르 리얄', flag: 'QA', symbol: 'ر.ق' },
                    RUB: { name: '러시아 루블', flag: 'RU', symbol: '₽' },
                    SAR: { name: '사우디아라비아 리얄', flag: 'SA', symbol: 'ر.س' },
                    SEK: { name: '스웨덴 크로나', flag: 'SE', symbol: 'kr' },
                    THB: { name: '태국 바트', flag: 'TH', symbol: '฿' },
                    TRY: { name: '터키 리라', flag: 'TR', symbol: '₺' },
                    TWD: { name: '대만 달러', flag: 'TW', symbol: 'NT$' },
                    USD: { name: '미국 달러', flag: 'US', symbol: '$' },
                    UYU: { name: '우루과이 페소', flag: 'UY', symbol: '$U' },
                    VND: { name: '베트남 동', flag: 'VN', symbol: '₫' }
                };

                const filteredRates = responses.map((response, index) => {
                    const rates = response.data.rates;
                    const KRW = rates['KRW'];
                    const cur_unit = currencies[index];
                    const currency = currencyData[cur_unit] || {};

                    // 엔화는 100을 곱함
                    const adjustedKRW = cur_unit === 'JPY' ? KRW * 100 : KRW;

                    return {
                        cur_unit,
                        name: currency.name || cur_unit,
                        deal_bas_r: adjustedKRW,
                        bkpr: adjustedKRW * 1.02,
                        tts: adjustedKRW * 0.98,
                        flag: cur_unit === 'EUR' ? euFlag : `https://flagsapi.com/${currency.flag}/flat/64.png`, // 유로는 로컬 이미지 사용
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
        <div style={{ textAlign: 'center', minHeight: '100vh', position: 'relative', paddingBottom: '150px' }}>
            <h2 style={{ fontSize: '24px' }}>국가별 환율 정보</h2>
            {loading ? (
                <p style={{ fontSize: '18px' }}>로딩 중...</p>
            ) : (
                <div style={{ position: 'relative', display: 'inline-block', width: '98%' }}>
                    <select
                        onChange={(e) => setActiveTab(e.target.value)}
                        style={{ position: 'absolute', top: '-30px', right: 0, fontSize: '18px' ,width: '10%', marginBottom:'20px'}}
                    >
                        <option value="buy">살 때</option>
                        <option value="sell">팔 때</option>
                    </select>
                    <table border="1" style={{ margin: '20px auto', width: '100%', fontSize: '20px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#66b2b2', color: 'white', fontSize: '20px' }}>
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
                                    <td style={{ backgroundColor: '#f2f2f2' }}>
                                        <img 
                                            src={rate.flag} 
                                            alt={`${rate.cur_unit} flag`} 
                                            style={{ width: '64px', height: '48px' }} // 깃발 크기 조정
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
                    <div style={{ marginTop: '20px' }}>
                        {Array.from({ length: Math.ceil(exchangeRates.length / itemsPerPage) }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                style={{
                                    margin: '0 5px',
                                    padding: '10px 20px',
                                    backgroundColor: currentPage === index + 1 ? '#66b2b2' : '#f2f2f2',
                                    color: currentPage === index + 1 ? 'white' : 'black',
                                    borderRadius: '5px',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            
            <button
                onClick={() => navigate('/exchange-rate')}
                style={{
                    marginTop: '20px',
                    marginBottom: '100px', // 푸터와의 간격을 100px로 설정
                    padding: '10px 20px',
                    backgroundColor: '#66b2b2',
                    color: 'white',
                    borderRadius: '5px',
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                뒤로
            </button>

            <div style={{ width: '100%', margin: '0 auto' }}>
                <Footer />
            </div>
        </div>
    );
};

export default DetailRate;