import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../util/Footer';
import { jwtDecode } from 'jwt-decode'; // default import로 수정
import { Map, MapMarker } from 'react-kakao-maps-sdk'; // 카카오 맵 임포트
import mapIcon from './free-icon-map-3082365.png'; // 지도 아이콘 이미지 임포트
import '../../../resource/css/exchange/ExchangeList.css'; // CSS 파일 임포트

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

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber); // currentPage 상태 업데이트
    };

    const isTokenExpired = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);
            return decodedToken.exp < currentTime;
        } catch (error) {
            return true;
        }
    };

    let userId = null;
    if (token) {
        try {
            const decoded = jwtDecode(token);
            userId = decoded.username;
        } catch (error) {
            // 유효하지 않은 토큰인 경우 처리
        }
    }

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
            const geocoder = new window.kakao.maps.services.Geocoder();

            geocoder.addressSearch(pickupAddress, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    const coords = { lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) };
                    setCoordinates(coords);
                    setShowMapIndex(prevIndex => (prevIndex === index ? null : index));
                } else {
                    console.error('Geocode 실패: ' + status);
                }
            });
        } catch (error) {
            console.error('주소 정보를 가져오는 중 오류 발생:', error);
        }
    };

    const fetchData = () => {
        const filtered = exchangeData.filter(data => {
            const exchangeDate = new Date(data.tradeDate);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return exchangeDate >= start && exchangeDate <= end;
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="ExchangeList-container">
            <div className="ExchangeList-searchBar">
                <label>기간 조회</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <span>~</span>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button onClick={fetchData}>조회</button>
            </div>

            {filteredData.length > 0 ? (
                <table className="ExchangeList-table">
                    <thead>
                        <tr>
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
                            <tr key={index}>
                                <td>{data.selectCountry}</td>
                                <td>{data.tradeAmount}</td>
                                <td>{data.tradePrice}</td>
                                <td>{data.tradeDate}</td>
                                <td>{data.receiveDate}</td>
                                <td>{data.pickupPlace}</td>
                                <td>
                                    <img
                                        src={mapIcon}
                                        alt="지도 아이콘"
                                        onClick={() => loadKakaoMap(data.pickupPlace, index)}
                                    />
                                    {showMapIndex === index && coordinates && coordinates.lat && coordinates.lng && (
                                        <div className="ExchangeList-map">
                                            <Map
                                                center={coordinates}
                                                style={{ width: '400px', height: '300px', borderRadius: '10px' }}
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
                <p className="ExchangeList-noData">조회된 데이터가 없습니다.</p>
            )}

            <div className="ExchangeList-pagination">
                {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={currentPage === index + 1 ? 'active' : ''}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            <button className="ExchangeList-backButton" onClick={() => navigate('/exchange-rate')}>
                뒤로
            </button>

            
        </div>
    );
};

export default ExchangeList;
