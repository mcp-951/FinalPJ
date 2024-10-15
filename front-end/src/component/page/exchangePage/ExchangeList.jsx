import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../util/Footer';
import {jwtDecode} from 'jwt-decode'; // default import로 변경

const ExchangeList = () => {
    const token = localStorage.getItem("token");
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [exchangeData, setExchangeData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // 한 페이지에 표시할 데이터 수
    const navigate = useNavigate();

    // 토큰 만료 여부 체크 함수
    const isTokenExpired = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000); // 현재 시간을 초 단위로 변환
            return decodedToken.exp < currentTime; // 토큰의 exp가 현재 시간보다 작으면 만료된 것
        } catch (error) {
            return true; // 토큰 디코딩 중 에러가 발생하면 만료된 것으로 간주
        }
    };

    // JWT 토큰 디코딩해서 userId 가져오기
    let userId = null;
    if (token) {
        try {
            const decoded = jwtDecode(token);
            userId = decoded.username;
        } catch (error) {
            // 유효하지 않은 토큰인 경우 처리
        }
    }

    // 페이지 렌더링 전에 토큰 체크
    useEffect(() => {
        // 토큰이 없거나 null인 경우
        if (!token || token === null) {
            alert("로그인이 필요합니다.");
            navigate('/login'); // 로그인 페이지로 리다이렉트
            return;
        }

        // 유효하지 않은 토큰인 경우
        try {
            jwtDecode(token); // 토큰 디코딩 시도
        } catch (error) {
            alert("유효하지 않은 토큰입니다. 다시 로그인하세요.");
            localStorage.removeItem("token"); // 유효하지 않은 토큰 제거
            navigate('/login'); // 로그인 페이지로 리다이렉트
            return;
        }

        // 토큰 만료 체크
        if (isTokenExpired(token)) {
            alert("토큰이 만료되었습니다. 다시 로그인하세요.");
            localStorage.removeItem("token"); // 만료된 토큰 제거
            navigate('/login'); // 로그인 페이지로 리다이렉트
            return;
        }
    }, [token, navigate]);

    // 사용자 정보 및 환전 내역 가져오기
    useEffect(() => {
        const fetchUserDataAndExchangeList = async () => {
            try {
                console.log("Token:", token);
                console.log("UserId:", userId);

                // 1. userId로 userNo 가져오기
                const userNoResponse = await axios.get(`http://localhost:8081/exchange/list/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                const userNo = userNoResponse.data;
                console.log("UserNo: ", userNo);

                // 2. userNo로 해당 사용자의 환전 내역 가져오기 (userNo 필터링)
                const exchangeResponse = await axios.get(`http://localhost:8081/exchange/exchangeList/${userNo}`,{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }});
                console.log("Filtered Exchange Data for UserNo:", exchangeResponse.data);

                // 환전 내역을 state에 저장
                setExchangeData(exchangeResponse.data);
                setFilteredData(exchangeResponse.data); // 초기에는 전체 데이터를 필터링 데이터에 넣음
            } catch (error) {
                console.error("데이터 가져오기 오류:", error);
            }
        };

        if (token && userId) {
            fetchUserDataAndExchangeList(); // 비동기 데이터 가져오기
        }
    }, [token, userId]);

    // 필터링된 데이터를 가져오기 위한 함수
    const fetchData = () => {
        const filtered = exchangeData.filter(data => {
            const exchangeDate = new Date(data.tradeDate);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return exchangeDate >= start && exchangeDate <= end;
        });
        setFilteredData(filtered);
        setCurrentPage(1); // 필터링 시 첫 페이지로 돌아가게 설정
    };

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 페이지네이션을 위한 계산
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
                                <th>수령 지점</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((data, index) => (
                                <tr key={index} style={{ padding: '15px 0' }}>
                                    <td style={{ padding: '10px 0' }}>{data.tradeNo}</td>
                                    <td style={{ padding: '10px 0' }}>{data.selectCountry}</td>
                                    <td style={{ padding: '10px 0' }}>{data.tradeAmount}</td>
                                    <td style={{ padding: '10px 0' }}>{data.tradePrice}</td>
                                    <td style={{ padding: '10px 0' }}>{data.tradeDate}</td>
                                    <td style={{ padding: '10px 0' }}>{data.pickupPlace}</td>
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
                    marginBottom: '50px',
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

export default ExchangeList;
