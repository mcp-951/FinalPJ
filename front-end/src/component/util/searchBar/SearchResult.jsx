import React from "react";
import { useLocation } from 'react-router-dom';
import '../../../resource/css/search/SearchResult.css'; // CSS 파일 경로

function SearchResult() {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('query');
    const data = [
        `계좌 -> 계좌조회 -> <a href ='/accounts'>전체계좌조회</a> `,
        `계좌 -> 계좌관리 -> <a href ='/account/:accountNumber/password-change'>비밀번호변경</a> `,
        `계좌 -> 계좌관리 -> <a href ='/account/:accountNumber/close'>계좌해지</a>`,
        `계좌 -> 계좌관리 -> <a href ='/account/password-check?purpose=limit-inquiry'>이체한도 조회</a>`,
        `계좌 -> 이체 -> <a href ='/account/transfer'>계좌이체</a>`,
        `계좌 -> 자동이체 -> <a href ='/auto-transfer/register'>자동이체 등록</a>`,
        `계좌 -> 자동이체 -> <a href ='/auto-transfer/register'>자동이체 조회</a>`,
        `계좌 -> 자동이체 -> <a href ='/auto-transfer/list'>자동이체 변경</a>`,
        `계좌 -> 자동이체 -> <a href ='/auto-transfer/list'>자동이체 해지</a>`,

        `금융상품 -> 예금,적금 -> <a href ='/deposit-list'>상품 리스트</a>`,
        `금융상품 -> 예금,적금 -> <a href ='/DepositMain'>중도 출금</a>`,
        `금융상품 -> 대출 -> <a href ='/loanmain'>대출 상품</a>`,

        `외환 -> 환율 -> <a href ='/exchange-rate'>실시간 환율</a>`,
        `외환 -> 환전 -> <a href ='/exchange'>환전 신청</a>`,
        `외환 -> 환전 -> <a href ='/exchangeList'>환전 내역</a>`,

        `공과금 -> <a href ='/tax/elec'>공과금 납부</a>`,
        `공과금 -> <a href ='/tax/History'>이용 내역</a>`,

        `투자 -> <a href ='/investment'>투자</a>`
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
