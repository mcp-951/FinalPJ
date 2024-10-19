import React, { useEffect, useState } from "react";
import '../../../resource/css/loan/LoanDetail.css';
import { useParams } from 'react-router-dom';
import axios from "axios";

function LoanDetail() {
    const { loanProductNo } = useParams();
    const [loanData, setLoanData] = useState(null); // 초기값을 null로 설정
    const [loading, setLoading] = useState(true); // 로딩 상태 추가

    useEffect(() => {
        const fetchLoanProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/loan/detail/${loanProductNo}`);
                const data = response.data;
                setLoanData(data);
                setLoading(false); // 데이터 로딩 완료
            } catch (error) {
                console.log("값을 못가져 왔음", error);
                setLoading(false); // 오류 발생 시에도 로딩 완료
            }
        };
        fetchLoanProduct();
    }, [loanProductNo]);

    // 로딩 중일 때 표시할 메시지
    if (loading) {
        return <div>로딩 중...</div>;
    }

    // loanData가 null일 때 처리
    if (!loanData) {
        return <div>대출 상품 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="LoanDetail_container">
            <div className="Apply_container">
                <div className="Apply_container_sum">
                    <h2 className="Apply_title">{loanData.loanProductTitle}</h2>
                    <div className="Apply_bottom_list">
                        <div className="Apply_bottom_list_max">
                            <span>최대한도</span>
                            <b>{(loanData.loanMaxLimit / 10000).toLocaleString()} 만원</b>
                        </div>
                        <div className="Apply_bottom_list_rate">
                            <span>대출금리</span>
                            <b>연 '{loanData.minInterestRate.toFixed(1)}'% ~ 연 '{loanData.maxInterestRate.toFixed(1)}'%</b>
                        </div>
                        <div className="Apply_bottom_list_button">
                            <button className="Apply_button">신청하기</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="Product_container">
                <div>
                    <h3>상품 안내</h3>
                </div>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>신청대상</th>
                                <th>궁시렁 궁싱렁</th>
                            </tr>
                            <tr>
                                <th>대출한도</th>
                                <th>대출한동 궁시렁 궁싱렁</th>
                            </tr>
                            <tr>
                                <th>대출 기간</th>
                                <th></th>
                            </tr>
                            {/* 추가 데이터 행 */}
                        </thead>
                        {/* 테이블 바디 추가 필요 */}
                    </table>
                </div>
            </div>
        </div>
    );
}

export default LoanDetail;