import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import '../../../resource/css/tax/TaxDetail.css'
import axios from "axios";

function TaxDetail (){
    const navigate = useNavigate();
    const [taxType, setTaxType] = useState('전기세')
    const [taxMonth, setTaxMonth] = useState(null)
    const [taxYear, setTaxYear] = useState(null)
    const [token, setToken] = useState(null)
    const [taxData, setTaxData] = useState(null)
    const [basicSum, setBasciSum] = useState(null)
    const [feeSum, setFeeSum] = useState(null)
    const [sum, setSum] = useState(null);
    
    const taxTypeChange = (event) =>{
        setTaxType(event.target.value)
    }
    const taxMonthSelect = (event) =>{
        setTaxMonth(event.target.value)
    }
    const taxYearSelect = (event) =>{
        setTaxYear(event.target.value)
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token == null){
            alert("로그인이 필요합니다.");
            navigate('/');
            return;
        }

        else{
            const decodedToken = jwtDecode(token);
            setToken(decodedToken)
        }
    }, []);

    const SelectTax = async (event)=>{
        event.preventDefault();
        const taxData = {
            taxType: taxType,
            taxMonth: taxMonth,
            taxYear: taxYear,
        };

        try{
            const realToken = localStorage.getItem('token');
            console.log(taxData.taxMonth + '하이이')
            const response = await axios.get(`http://localhost:8081/tax/taxSelectList/${token.userNo}/${taxData.taxYear}/${taxData.taxMonth}`, {
                headers: {
                    Authorization: `Bearer ${realToken}`
                }})
                const data = response.data;
                console.log(data);
                setTaxData(data);
                setBasciSum(data.basicFee1 + data.basicFee2 + data.basicFee3);
                setFeeSum(data.fee1 + data.fee2 + data.fee3)
                setSum(data.basicFee1 + data.basicFee2 + data.basicFee3 + data.fee1 + data.fee2 + data.fee3);
        } catch(error){
            console.error("값을 못가져왔음", error);
        }
    }
    
    return(
        <div className="Taxcontainer">
            <div className="SelectTax_bar">
                <div className="SelectTax_Type">
                    <div className="SelectTax_Type_Label">
                        <label htmlFor="taxType">공과금 종류</label>
                    </div>
                    <div className="SelectTax_Type_Select">
                        <select id="taxMenu" value={taxType} onChange={taxTypeChange} className="SelectTax_Type_Select_SelectBar">
                            <option value="전기세">전기세</option>
                            <option value="수도세">수도세</option>
                        </select>
                    </div>
                </div>
                <div className="SelectTax_Date">
                    <div className="SelectTax_Date_Laber">
                        <label htmlFor="taxDate">납부 시기</label>
                    </div>
                    
                    <div className="SelectTax_Date_Select">
                        <select id="taxDateYear" value={taxYear} onChange={taxYearSelect} className="SelectTax_Type_Date_SelectBar">
                            <option value="" disabled selected>연도</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                            <option value="2021">2021</option>
                            <option value="2020">2020</option>
                        </select>
                            년
                        <select id="taxDateMonth" value={taxMonth} onChange={taxMonthSelect} className="SelectTax_Type_Date_SelectBar">
                            <option value="" disabled selected>월</option>
                            <option value="01">1월</option>
                            <option value="02">2월</option>
                            <option value="03">3월</option>
                            <option value="04">4월</option>
                            <option value="05">5월</option>
                            <option value="06">6월</option>
                            <option value="07">7월</option>
                            <option value="08">8월</option>
                            <option value="09">9월</option>
                            <option value="10">10월</option>
                            <option value="11">11월</option>
                            <option value="12">12월</option>
                        </select>
                        월
                    </div>
                </div>
                <div className="SelectTax_button">
                    <div>
                        <button onClick={SelectTax}>조회하기</button>
                    </div>
                </div>
            </div>

            <div className="taxList">
                <table>
                    <tr>
                        <th>관리번호</th>
                        <th>종류</th>
                        <th>기본료</th>
                        <th>사용료</th>
                        <th>청구료</th>
                        <th>납부기한</th>
                        <th>납부</th>
                    </tr>
                    <tr>{taxData ? (<>
                            <td>{taxData.taxNo}</td>
                            <td>{taxType}</td>
                            <td>{basicSum}</td>
                            <td>{feeSum}</td>
                            <td>{sum}</td>
                            <td>{taxData.taxDeadLine}</td>
                            {taxData.taxState == 'N' ? (
                            <td><button>납부하기</button></td>) 
                            :(<td>납부완료</td>)}
                        </>)
                        : (<>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </>)}
                    </tr>
                </table>
            </div>
        </div>
    );
}

export default TaxDetail;