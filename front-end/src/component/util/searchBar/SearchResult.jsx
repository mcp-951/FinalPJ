import React from "react";
import { useLocation } from 'react-router-dom';
import '../../../resource/css/search/SearchResult.css'; // CSS 파일 경로

function SearchResult() {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('query');
    const data = [
        `<a href ='/'>계좌</a> -> <a href ='/'>계좌조회</a> -> <a href ='/'>전체계좌조회</a> `,
        '계좌 -> 계좌관리 -> 비밀번호변경',
        '계좌 -> 계좌관리 -> 계좌해지',
        '계좌 -> 계좌관리 -> 이체한도 조회',
        '계좌 -> 이체 -> 이체',
        '계좌 -> 자동이체 -> 자동이체 등록',
        '계좌 -> 자동이체 -> 자동이체 조회',
        '계좌 -> 자동이체 -> 자동이체 변경',
        '계좌 -> 자동이체 -> 자동이체 해지',

        '금융상품 -> 예금 -> 예금상품 리스트',
        '금융상품 -> 예금 -> 예금상품 메인',
        '금융상품 -> 대출 -> 대출상품 리스트',
        '금융상품 -> 대출 -> 중동상환',
        '금융상품 -> 대출 -> 대출 이자계산기',

        '외환 -> 환율 -> 실시간 환율',
        '외환 -> 환전 -> 환전 신청',
        '외환 -> 환전 -> 환전 내역',

        '공과금 -> 공과금 납부',
        '공과금 -> 납부내역',
        '투자 -> '
    ];

    const filteredData = query ? data.filter(item => 
        item.toLowerCase().includes(query.toLowerCase())
    ) : data;

    return (
        <div className="search-result-container">
            <table className="search-result-table">
                <thead>
                    <tr>
                        <th>검색결과 ({filteredData.length}건)</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.length > 0 ? (
                        filteredData.map((item, index) => (
                            <tr key={index}>
                                <td dangerouslySetInnerHTML={{ __html: item }} /> {/* HTML 렌더링 */}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td>{`'${query}'에 대한 검색결과가 없습니다.`}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default SearchResult;
