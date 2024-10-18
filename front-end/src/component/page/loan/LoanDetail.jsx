import React from "react";
import '../../../resource/css/loan/LoanDetail.css'
function LoanDetail () {
    
    return(
        <div className="LoanDetail_container">
            <div className="Apply_container">
                <div className="Apply_container_sum">
                    <h2 className="Apply_title">제목이 올 것입니다.</h2>
                    <div className="Apply_bottom_list">
                        <div className="Apply_bottom_list_max">
                            <span>최대한도</span>
                            <b>5,000만원</b>
                        </div>
                        <div className="Apply_bottom_list_rate">
                            <span>대출금리</span>
                            <b>연 '13.5'% ~ 연 '19.9'%</b>
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
                                <th> 대출한동 궁시렁 궁싱렁</th>
                            </tr>
                            <tr>
                                <th>대출 기간</th>
                                <th></th>
                            </tr>
                            <tr>
                                <th>신청 대상</th>
                                <th>궁시렁 궁싱렁</th>
                            </tr>
                            <tr>
                                <th>신청 대상</th>
                                <th>궁시렁 궁싱렁</th>
                            </tr>
                            <tr>
                                <th>신청 대상</th>
                                <th>궁시렁 궁싱렁</th>
                            </tr>
                            <tr>
                                <th>신청 대상</th>
                                <th>궁시렁 궁싱렁</th>
                            </tr>
                            <tr>
                                <th>신청 대상</th>
                                <th>궁시렁 궁싱렁</th>
                            </tr>
                            <tr>
                                <th>신청 대상</th>
                                <th>궁시렁 궁싱렁</th>
                            </tr>
                            <tr>
                                <th>신청 대상</th>
                                <th>궁시렁 궁싱렁</th>
                            </tr>
                            <tr>
                                <th>신청 대상</th>
                                <th>궁시렁 궁싱렁</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default LoanDetail;