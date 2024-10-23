import React, { useEffect, useState } from "react";
import '../../../resource/css/loan/LoanDetail.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";

function LoanDetail() {
    const navigate = useNavigate();
    const { loanProductNo } = useParams();
    const [loanData, setLoanData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLoanProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/loan/detail/${loanProductNo}`);
                const data = response.data;
                setLoanData(data);
                setLoading(false);
            } catch (error) {
                console.log("값을 못 가져왔음", error);
                setLoading(false);
            }
        };
        fetchLoanProduct();
    }, [loanProductNo]);

    const moveApply = () => {
        navigate(`/loanmain/loanapply/${loanProductNo}`)
    }

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (!loanData) {
        return <div>대출 상품 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="LoanDetail-container">
            <div className="LoanDetail-apply-container">
                <div className="LoanDetail-apply-summary">
                    <h2 className="LoanDetail-title">{loanData.loanProductTitle}</h2>
                    <div className="LoanDetail-info-list">
                        <div className="LoanDetail-info-item">
                            <span>최대한도</span>
                            <b>{(loanData.loanMaxLimit / 10000).toLocaleString()} 만원</b>
                        </div>
                        <div className="LoanDetail-info-item">
                            <span>대출금리</span>
                            <b>연 '{loanData.minInterestRate.toFixed(1)}'% ~ 연 '{loanData.maxInterestRate.toFixed(1)}'%</b>
                        </div>
                        <div className="LoanDetail-info-item-button">
                            <button className="LoanDetail-apply-button" onClick={moveApply}>신청하기</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="LoanDetail-product-container">
                <div className="LoanDetail-product-details">
                    <h3 className="LoanDetail-info-header">상품 안내</h3>
                    <table className="LoanDetail-content-table">
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
                                <td>원리금균등분할상환<p>1~3개월 이자 상환 후</p></td>
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
                    </table>
                </div>
            </div>
        </div>
    );
}

export default LoanDetail;
