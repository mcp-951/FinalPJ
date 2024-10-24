import React from "react";
import { useNavigate } from 'react-router-dom';
import '../../../resource/css/loan/LoanProduct.css'

function LoanProduct(props){
    const navigate = useNavigate();
    const moveDetail = () => {
        navigate(`/loanmain/loandetail/${props.loanProductNo}`); // 다른 페이지로 이동
    };

    const loanMaxLimit1 = props.loanMaxLimit /10000
    const loanMaxLimit2 = props.loanMaxLimit /100000000
    return(
        <div className="LoanProduct_div" onClick={moveDetail}>
            <span className="loanTitle_spanMain">
                <div className="spanBox">대출</div>
                <strong className="loanTitle_strong">{props.loanProductTitle}</strong>
            </span>
            <span className="loanPrice_spanMain">
                <p>'최대'&nbsp; 
                    {loanMaxLimit1 >= 10000 ? (<><strong className="loanPrice_strong">{loanMaxLimit2.toLocaleString()}</strong>억원 </>) : (<><strong className="loanPrice_strong">{loanMaxLimit1.toLocaleString()}</strong>만원 </>)}
                </p>
                <small>최저 금리 연 '{props.minInterestRate.toFixed(1)}'% ~</small>
            </span>
        </div>
    );
}

export default LoanProduct;