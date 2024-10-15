import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Map, MapMarker } from 'react-kakao-maps-sdk'; // 카카오 맵 임포트

const ExchangeResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { message, branch } = location.state || {}; // 전달받은 branch 정보
    const [pickUpAddress, setPickUpAddress] = useState(''); // 서버에서 받아올 주소
    const [coordinates, setCoordinates] = useState(null); // 좌표 상태 저장
    const [showMap, setShowMap] = useState(false); // 지도 표시 여부

    console.log("Branch:", branch); // 전달받은 branch 값을 확인하는 로그

    // 서버에서 pickUpAddress를 받아오는 함수
    const fetchPickUpAddress = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/exchange/pickup-address/${branch}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            console.log("PickUpAddress:", response.data); // 서버에서 받아온 주소 확인
            setPickUpAddress(response.data); // 주소 설정
        } catch (error) {
            console.error('주소 정보를 가져오는 중 오류 발생:', error); // 오류 발생 시 로그 출력
        }
    };

    // 카카오 맵 Geocoder로 주소를 좌표로 변환하는 함수
    const loadKakaoMap = (address) => {
        if (!window.kakao || !window.kakao.maps) {
            console.error("카카오 맵 API가 아직 로드되지 않았습니다."); // 카카오 API가 로드되지 않았을 경우
            return;
        }

        const geocoder = new window.kakao.maps.services.Geocoder(); // 주소-좌표 변환 객체

        // 주소로 좌표 검색 (지오코딩)
        geocoder.addressSearch(address, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const coords = { lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) }; // 좌표 생성
                setCoordinates(coords); // 변환된 좌표를 상태로 저장
                console.log("좌표:", coords); // 변환된 좌표 확인
            } else {
                console.error('Geocode 실패: ' + status); // 지오코딩 실패 시 오류 출력
            }
        });
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (pickUpAddress && showMap) {
            loadKakaoMap(pickUpAddress); // pickUpAddress가 설정되면 좌표 변환
        }
    }, [pickUpAddress, showMap]);

    // 위치보기 버튼 클릭 시 지도 표시 토글
    const toggleMap = () => {
        if (!showMap) {
            fetchPickUpAddress(); // 주소를 받아오고
        }
        setShowMap(prevShowMap => !prevShowMap); // 지도를 토글
    };

    return (
        <div className="exchange-result-container">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>환전 신청 완료</h1>
            {message ? (
                <p style={{ fontSize: '1.5rem', marginBottom: '40px' }}>{message}</p>
            ) : (
                <p style={{ fontSize: '1.5rem', marginBottom: '40px' }}>선택한 정보가 없습니다.</p>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
                <button onClick={() => navigate('/exchange-rate')} className="main-button">
                    메인으로
                </button>

                {/* 위치보기 버튼 */}
                <button onClick={toggleMap} className="location-button">
                    {showMap ? "지도 숨기기" : "위치보기"}
                </button>
            </div>

            {/* 지도 출력 */}
            {showMap && coordinates && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Map
                        center={coordinates} // 좌표 설정
                        style={{
                            width: '50%', // 지도 너비
                            height: '400px', // 지도 높이
                            borderRadius: '15px', // 모서리 둥글게
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // 그림자 추가
                        }} 
                        level={3} // 확대 레벨
                    >
                        {/* 마커 표시 */}
                        <MapMarker position={coordinates}>
                            <div style={{ padding: '5px', color: '#000' }}>여기서 찾으세요!</div>
                        </MapMarker>
                    </Map>
                </div>
            )}
        </div>
    );
};

export default ExchangeResult;
