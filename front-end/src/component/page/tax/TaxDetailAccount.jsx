import React,{useState, useEffect} from "react";
import '../../../resource/css/tax/TaxDetailAccount.css'
function TaxDetailAccount () {
    return(
        <div className="TaxDetailAccountContainner">
            <div className="TaxAccount">
                <div>
                    <label>계좌번호</label>
                </div>
                <div>
                    <select>
                        <option>통장1</option>
                        <option>통장2</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default TaxDetailAccount;