import React from "react";
import { useNavigate } from 'react-router-dom';
import '../../../resource/css/loan/LoanProduct.css'

function LoanProduct(props){
    const navigate = useNavigate();
    const moveDetail = () => {
        navigate('/'); // 다른 페이지로 이동
    };
    return(
        <div className="LoanProduct_div" onClick={moveDetail}>
            <span className="loanTitle_spanMain">
                <div className="spanBox">대출</div>
                <strong className="loanTitle_strong">제목이 올 것입니다.</strong>
            </span>
            <span className="loanPrice_spanMain">
                <p>'최대'&nbsp; <strong className="loanPrice_strong">'5,000'</strong>만원</p>
                <small>최저 금리 연 '13.5%' ~</small>
            </span>
        </div>
    );
}

export default LoanProduct;