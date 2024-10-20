import React, { useEffect, useState } from "react";
import '../../../resource/css/loan/LoanDetail.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";

function LoanDetail() {
    const navigate = useNavigate();
    const { loanProductNo } = useParams();
    const [loanData, setLoanData] = useState(null); // 초기값을 null로 설정
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const [appply, setApply] = useState();

    useEffect(() => {
        const fetchLoanProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/loan/detail/${loanProductNo}`);
                const data = response.data;
                setLoanData(data);
                setLoading(false); // 데이터 로딩 완료
                console.log(data);
            } catch (error) {
                console.log("값을 못가져 왔음", error);
                setLoading(false); // 오류 발생 시에도 로딩 완료
            }
        };
        fetchLoanProduct();
    }, [loanProductNo]);

    const moveApply = () =>{
        navigate(`/loanmain/loanapply/${loanProductNo}`)
    }

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
                            <button className="Apply_button" onClick={moveApply}>신청하기</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="Product_container">
                <div className="Product_container_div">
                    <div>
                        <h3 className="Product_info">상품 안내</h3>
                    </div>
                    <div>
                        <table className="Product_content_detail">
                            <thead>
                                <tr>
                                    <th>신청대상</th>
                                    <td>{loanData.minCreditScore} 등급 이상</td>
                                </tr>
                                <tr>
                                    <th>대출한도</th>
                                    <td>최소 {loanData.loanMinLimit.toLocaleString()}원 ~ 최대 {loanData.loanMaxLimit.toLocaleString()}원</td>
                                </tr>
                                <tr>
                                    <th>대출 기간</th>
                                    <td>최단 {loanData.loanMinTern}개월 ~ 최대 {loanData.loanMaxTern}개월</td>
                                </tr>
                                <tr>
                                    <th>상환방식</th>
                                    <td>원리금균등분할상환
                                        <p>1~3개월 이자 상환 및 이후 </p>
                                    </td>
                                </tr>
                                <tr>
                                    <th>이자납입방법</th>
                                    <td>매월 후취</td>
                                </tr>
                                <tr>
                                    <th>중도 상환수수료</th>
                                    <td>{loanData.earlyRepaymentFee.toFixed(1)}%</td>
                                </tr>
                            </thead>
                            {/* 테이블 바디 추가 필요 */}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoanDetail;