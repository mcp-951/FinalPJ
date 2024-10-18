import React from "react";
import LoanProduct from "./LoanProduct";
import '../../../resource/css/loan/LoanMain.css'

function LoanMain () {
    return (
        <div className="LoanMainContainer">
            <ul>
                <li>
                    <LoanProduct />
                </li>
            </ul>
        </div>
    );
}

export default LoanMain;