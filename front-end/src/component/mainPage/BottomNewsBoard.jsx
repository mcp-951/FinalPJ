import React, { useEffect, useState } from "react";
import '../../resource/css/main/BottomBoard.css';

function BottomNewsBoard() {
    const [news, setNews] = useState([]); // 뉴스 데이터를 저장할 상태 변수
    const [loading, setLoading] = useState(true); // 로딩 상태 변수
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지를 관리할 상태 변수
    const itemsPerPage = 5; // 페이지당 표시할 뉴스 항목 수

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

    // 페이지 단위로 뉴스 항목 분리
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentNews = news.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지 전환 함수
    const nextPage = () => {
        if (currentPage < Math.ceil(news.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div>
            <table className="boardTable">
                <thead>
                    <tr>
                        <th className="title">경제 뉴스</th>
                        <th className="date">
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
                        currentNews.length > 0 ? (
                            currentNews.map((item, index) => (
                                <tr key={index}>
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
                                            {index + 1 + indexOfFirstItem}. {item.text}
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

            {/* 페이지네이션 버튼 */}
            <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>
                    이전
                </button>
                <span className="page-info">
                    {currentPage} / {Math.ceil(news.length / itemsPerPage)} 페이지
                </span>
                <button onClick={nextPage} disabled={currentPage === Math.ceil(news.length / itemsPerPage)}>
                    다음
                </button>
            </div>
        </div>
    );
}

export default BottomNewsBoard;