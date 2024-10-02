import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../util/Footer';

const ExchangeHistory = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [exchangeData, setExchangeData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    // 임시 데이터 설정
    const tempData = [
        { exchangeNumber: 1, currencyType: 'USD', exchangeAmount: 100, withdrawalAmount: 130000, exchangeDate: '2023-09-10', receivingBranch: '홍대점' },
        { exchangeNumber: 2, currencyType: 'EUR', exchangeAmount: 200, withdrawalAmount: 260000, exchangeDate: '2023-09-11', receivingBranch: '강남점' },
        { exchangeNumber: 3, currencyType: 'JPY', exchangeAmount: 300, withdrawalAmount: 390000, exchangeDate: '2023-09-12', receivingBranch: '명동점' },
        { exchangeNumber: 4, currencyType: 'CNY', exchangeAmount: 400, withdrawalAmount: 520000, exchangeDate: '2023-09-13', receivingBranch: '종로점' },
        { exchangeNumber: 5, currencyType: 'GBP', exchangeAmount: 500, withdrawalAmount: 650000, exchangeDate: '2023-09-14', receivingBranch: '서초점' },
        { exchangeNumber: 6, currencyType: 'USD', exchangeAmount: 600, withdrawalAmount: 780000, exchangeDate: '2023-09-15', receivingBranch: '홍대점' },
        { exchangeNumber: 7, currencyType: 'EUR', exchangeAmount: 700, withdrawalAmount: 910000, exchangeDate: '2023-09-16', receivingBranch: '강남점' },
        { exchangeNumber: 8, currencyType: 'JPY', exchangeAmount: 800, withdrawalAmount: 1040000, exchangeDate: '2023-09-17', receivingBranch: '명동점' },
        { exchangeNumber: 9, currencyType: 'CNY', exchangeAmount: 900, withdrawalAmount: 1170000, exchangeDate: '2023-09-18', receivingBranch: '종로점' },
        { exchangeNumber: 10, currencyType: 'GBP', exchangeAmount: 1000, withdrawalAmount: 1300000, exchangeDate: '2023-09-19', receivingBranch: '서초점' },
        { exchangeNumber: 11, currencyType: 'USD', exchangeAmount: 1100, withdrawalAmount: 1430000, exchangeDate: '2023-09-20', receivingBranch: '홍대점' },
        { exchangeNumber: 12, currencyType: 'EUR', exchangeAmount: 1200, withdrawalAmount: 1560000, exchangeDate: '2023-09-21', receivingBranch: '강남점' },
    ];

    useEffect(() => {
        setExchangeData(tempData);
        setFilteredData(tempData); // 기본적으로 모든 데이터를 출력
    }, []);

    const fetchData = () => {
        const filtered = tempData.filter(data => {
            const exchangeDate = new Date(data.exchangeDate);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return exchangeDate >= start && exchangeDate <= end;
        });
        setFilteredData(filtered);
        setCurrentPage(1); // 페이지를 첫 페이지로 초기화
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div style={{ textAlign: 'center', minHeight: '100vh', position: 'relative', paddingBottom: '150px' }}>
            <div style={{ margin: '20px auto', width: '80%' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#66b2b2', padding: '10px', borderRadius: '5px' }}>
                    <label style={{ marginRight: '10px', color: 'white', fontSize: '18px' }}>기간 조회</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        style={{ marginRight: '10px', padding: '5px', borderRadius: '5px' }}
                    />
                    <span style={{ marginRight: '10px', color: 'white', fontSize: '18px' }}>~</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        style={{ marginRight: '10px', padding: '5px', borderRadius: '5px' }}
                    />
                    <button
                        onClick={fetchData}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#66b2b2',
                            color: 'white',
                            borderRadius: '5px',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        조회
                    </button>
                </div>
                {filteredData.length > 0 ? (
                    <table border="1" style={{ margin: '20px auto', width: '100%', fontSize: '20px', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#66b2b2', color: 'white' }}>
                                <th>환전 번호</th>
                                <th>통화 종류</th>
                                <th>환전량</th>
                                <th>출금액</th>
                                <th>환전일</th>
                                <th>수령점</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((data, index) => (
                                <tr key={index} style={{ padding: '15px 0' }}>
                                    <td style={{ padding: '10px 0' }}>{data.exchangeNumber}</td>
                                    <td style={{ padding: '10px 0' }}>{data.currencyType}</td>
                                    <td style={{ padding: '10px 0' }}>{data.exchangeAmount}</td>
                                    <td style={{ padding: '10px 0' }}>{data.withdrawalAmount}</td>
                                    <td style={{ padding: '10px 0' }}>{data.exchangeDate}</td>
                                    <td style={{ padding: '10px 0' }}>{data.receivingBranch}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{ marginTop: '20px', fontSize: '18px' }}>조회된 데이터가 없습니다.</p>
                )}
                <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                    {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, index) => (
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
            <button
                onClick={() => navigate('/exchange-rate')}
                style={{
                    marginTop: '20px',
                    marginBottom: '50px', // 푸터와의 간격을 100px로 설정
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

            <div>
                <Footer style={{ position: 'fixed', bottom: 0, width: '100%', height: '100px' }} />
            </div>
        </div>
    );
};

export default ExchangeHistory;