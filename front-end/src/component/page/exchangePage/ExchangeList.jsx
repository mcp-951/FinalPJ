import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../util/Footer';
import { jwtDecode } from 'jwt-decode'; // default import로 수정
import { Map, MapMarker } from 'react-kakao-maps-sdk'; // 카카오 맵 임포트
import mapIcon from './free-icon-map-3082365.png'; // 지도 아이콘 이미지 임포트

const ExchangeList = () => {
    const token = localStorage.getItem("token");
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [exchangeData, setExchangeData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showMapIndex, setShowMapIndex] = useState(null); // 지도가 열릴 인덱스 저장
    const [coordinates, setCoordinates] = useState(null); // 좌표 상태 저장
    const [isMapLoaded, setIsMapLoaded] = useState(false); // Kakao Maps SDK 로드 상태 확인
    const itemsPerPage = 10; // 한 페이지에 표시할 데이터 수
    const navigate = useNavigate();

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber); // currentPage 상태 업데이트
    };

    // 토큰 만료 여부 체크 함수
    const isTokenExpired = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);
            return decodedToken.exp < currentTime;
        } catch (error) {
            return true;
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
        if (!token || token === null) {
            alert("로그인이 필요합니다.");
            navigate('/login');
            return;
        }

        try {
            jwtDecode(token);
        } catch (error) {
            alert("유효하지 않은 토큰입니다. 다시 로그인하세요.");
            localStorage.removeItem("token");
            navigate('/login');
            return;
        }

        if (isTokenExpired(token)) {
            alert("토큰이 만료되었습니다. 다시 로그인하세요.");
            localStorage.removeItem("token");
            navigate('/login');
            return;
        }
    }, [token, navigate]);

    // Kakao Maps SDK 로드 확인
    useEffect(() => {
        const loadKakaoMapScript = () => {
            const script = document.createElement('script');
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY&libraries=services`;
            script.async = true;
            script.onload = () => {
                setIsMapLoaded(true); // 스크립트가 로드되었을 때 상태 업데이트
            };
            document.head.appendChild(script);
        };

        if (!window.kakao || !window.kakao.maps) {
            loadKakaoMapScript();
        } else {
            setIsMapLoaded(true); // 스크립트가 이미 로드된 경우
        }
    }, []);

    // 사용자 정보 및 환전 내역 가져오기
    useEffect(() => {
        const fetchUserDataAndExchangeList = async () => {
            try {
                const userNoResponse = await axios.get(`http://localhost:8081/exchange/list/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                const userNo = userNoResponse.data;

                const exchangeResponse = await axios.get(`http://localhost:8081/exchange/exchangeList/${userNo}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                console.log(exchangeResponse.data);

                // tradeNo를 기준으로 역순 정렬
                const sortedData = exchangeResponse.data.sort((a, b) => b.tradeNo - a.tradeNo);
                setExchangeData(sortedData);
                setFilteredData(sortedData); // 초기에는 전체 데이터를 필터링 데이터에 넣음
            } catch (error) {
                console.error("데이터 가져오기 오류:", error);
            }
        };

        if (token && userId) {
            fetchUserDataAndExchangeList();
        }
    }, [token, userId]);

    // 지점 주소를 기반으로 좌표 가져오기
    const loadKakaoMap = async (branch, index) => {
        if (!isMapLoaded) {
            console.error('Kakao Map script is not loaded yet.');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8081/exchange/pickup-address/${branch}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            const pickupAddress = response.data;
            console.log("주소 : ",pickupAddress)
            const geocoder = new window.kakao.maps.services.Geocoder();

            geocoder.addressSearch(pickupAddress, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    const coords = { lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) };
                    setCoordinates(coords);
                    // 지도가 이미 열려 있으면 닫고, 그렇지 않으면 해당 인덱스의 지도를 열도록 설정
                    setShowMapIndex(prevIndex => (prevIndex === index ? null : index));
                } else {
                    console.error('Geocode 실패: ' + status);
                }
            });
        } catch (error) {
            console.error('주소 정보를 가져오는 중 오류 발생:', error);
        }
    };

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
                                <th>통화 종류</th>
                                <th>환전량</th>
                                <th>출금액</th>
                                <th>환전 신청일</th>
                                <th>방문 예정일</th>
                                <th>수령 지점</th>
                                <th>지점 위치</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((data, index) => (
                                <tr key={index} style={{ padding: '15px 0' }}>
                                    <td style={{ padding: '10px 0' }}>{data.selectCountry}</td>
                                    <td style={{ padding: '10px 0' }}>{data.tradeAmount}</td>
                                    <td style={{ padding: '10px 0' }}>{data.tradePrice}</td>
                                    <td style={{ padding: '10px 0' }}>{data.tradeDate}</td>
                                    <td style={{ padding: '10px 0' }}>{data.receiveDate}</td>
                                    <td style={{ padding: '10px 0' }}>{data.pickupPlace}</td>
                                    <td style={{ padding: '10px 0', position: 'relative' }}>
                                        <img
                                            src={mapIcon}
                                            alt="지도 아이콘"
                                            style={{ width: '30px', cursor: 'pointer' }}
                                            onClick={() => loadKakaoMap(data.pickupPlace, index)} // `data.pickupPlace`로 올바른 값을 전달
                                        />
                                        {showMapIndex === index && coordinates && coordinates.lat && coordinates.lng && (
                                            <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', zIndex: '100' }}>
                                                <Map
                                                    center={coordinates}
                                                    style={{ width: '400px', height: '300px', marginTop: '10px', borderRadius: '10px', zIndex: '100' }}
                                                    level={3}
                                                >
                                                    <MapMarker position={coordinates} />
                                                </Map>
                                            </div>
                                        )}
                                    </td>
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
