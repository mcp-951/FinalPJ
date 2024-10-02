import React from "react";
import '../../../resource/css/tax/TaxMain.css'
function TaxWMain(){
    return(
        <div className="TaxContainer">
            <div className="TaxTitle">
                <h2>공과금 관리</h2>
                <div>
                    <button>전기</button>
                    <button>수도</button>
                </div>
            </div>
            <div className="TaxMainPrice">
                <div className="TaxTextBox">
                    <p>박OO님의 O월달 수도세는 1,892,456원 입니다.</p>
                </div>
            </div>
            <div className="TaxBottom">
                <button>납부하기</button>
                <button>납부내역</button>
            </div>
        </div>
    );
}

export default TaxWMain;