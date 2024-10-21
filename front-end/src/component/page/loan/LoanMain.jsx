import React, {useEffect, useState} from "react";
import LoanProduct from "./LoanProduct";
import '../../../resource/css/loan/LoanMain.css'
import axios from "axios";


function LoanMain () {
    const [loanData, setLoanData] = useState([]);
    useEffect(() => {
        const fetchLoanProduct = async () => {
            try{
                const response = await axios.get('http://localhost:8081/loan/list')
                const data = response.data;
                setLoanData(data);
            } catch(error){
                console.log("값을 못가져 왔음", error);
            }
        }
        fetchLoanProduct();
    }, [])

    return (
        <div className="LoanMainContainer">
            <ul>
                {loanData.map((loanProduct) => (
                    <li key={loanProduct.loanProductNo}> {/* 각 항목에 고유한 key 추가 */}
                        <LoanProduct 
                            loanProductNo={loanProduct.loanProductNo}
                            loanProductTitle={loanProduct.loanProductTitle}
                            loanMaxLimit={loanProduct.loanMaxLimit}
                            loanMinLimit={loanProduct.loanMinLimit}
                            loanMaxTern={loanProduct.loanMaxTern}
                            loanMinTern={loanProduct.loanMinTern}
                            minInterestRate={loanProduct.minInterestRate}
                            maxInterestRate={loanProduct.maxInterestRate}
                            earlyRepaymentFee={loanProduct.earlyRepaymentFee}
                            minCreditScore={loanProduct.minCreditScore}
                            viewPoint={loanProduct.viewPoint}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LoanMain;