import React, { useEffect, useState } from "react";
import '../../resource/css/main/BottomBoard.css';

function BottomNewsBoard() {
    const [news, setNews] = useState([]); // 뉴스 데이터를 저장할 상태 변수
    const [loading, setLoading] = useState(true); // 로딩 상태 변수

    // 기본 이미지 URL (이미지가 없는 경우 표시할 기본 이미지)
    const defaultImageUrl = "https://via.placeholder.com/60?text=No+Image";

    // 데이터 가져오는 useEffect
    useEffect(() => {
        fetch('http://localhost:5000/api/news/gallery')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                setNews(data);  // 데이터 저장
                setLoading(false);  // 로딩 상태 종료
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);  // 오류 발생 시 로딩 종료
            });
    }, []);

    return (
        <table className="boardTable">
            <thead>
                <tr>
                    <th className="title">News</th>
                    <th className="date">
                        {/* '더보기' 버튼 클릭 시 연합뉴스 경제 뉴스 페이지로 이동 */}
                        <a href="https://www.yonhapnewstv.co.kr/news/economy" target="_blank" rel="noopener noreferrer">
                            <button className="boardPlus">+ 더보기</button>
                        </a>
                    </th>
                </tr>
            </thead>
            <tbody>
                {/* 로딩 상태 확인 및 데이터 출력 */}
                {loading ? (
                    <tr>
                        <td colSpan="2">로딩 중...</td>
                    </tr>
                ) : (
                    news.length > 0 ? (
                        news.map((item, index) => (
                            <tr key={index}>
                                {/* 이미지와 뉴스 제목을 함께 표시 */}
                                <td className="newsItem">
                                    <img 
                                        src={item.image || defaultImageUrl}  // 이미지가 없는 경우 기본 이미지 사용
                                        alt="뉴스 이미지" 
                                        style={{ 
                                            width: '60px', 
                                            height: '60px', 
                                            marginRight: '10px',
                                            objectFit: 'cover',  // 이미지 비율 맞추기
                                            borderRadius: '5px'  // 이미지 둥글게 처리
                                        }} 
                                    />
                                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                                        {index + 1}. {item.text}
                                    </a>
                                </td>
                                <td>{new Date().toLocaleDateString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2">데이터가 없습니다.</td>
                        </tr>
                    )
                )}
            </tbody>
        </table>
    );
}

export default BottomNewsBoard;


