import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from "axios";

import '../../../resource/css/tax/TaxMain.css'
function TaxMain(){
    const navigate = useNavigate();
    const [sum, setSum] = useState(null);
    const [taxData, setTaxData] = useState(null);
    const [userName, setUserName] =useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const taxDetailGo = () =>{
        navigate('/tax/Detail');
    }
    
    useEffect(() => { 
        if(token == null){
            alert("로그인이 필요합니다.");
            navigate('/');
            return;
        }
        else{
            setToken(localStorage.getItem('token'));
            const decodedToken = jwtDecode(token);
            setUserName(decodedToken.name)
            console.log(decodedToken.userNo);

            const fetchTaxData = async () => {
                try{
                    const response = await axios.get(`http://localhost:8081/tax/electroTaxMain/${decodedToken.userNo}`, {
                        headers: {
                            Authorization: `Bearer ${token}` // JWT를 헤더에 추가
                        }})
                        const data = response.data;
                        setTaxData(data);
                        setSum(data.basicFee1 + data.basicFee2 + data.basicFee3 + data.fee1 + data.fee2 + data.fee3);
                } catch(error){
                    console.error("값을 못가져왔음" ,error);
                }
            }
            fetchTaxData();
        }
    }, []);
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
                    {taxData ? (
                            <p>{userName}님의 {taxData.taxWriteDate.substring(5, 7)}월달 전기세는 {sum}원 입니다.</p>) : (<p>데이터를 불러오는 중입니다...</p>
                    )}
                </div>
            </div>
            <div className="TaxBottom">
                <button onClick={taxDetailGo}>납부하기</button>
                <button>납부내역</button>
            </div>
        </div>
    );
}

export default TaxMain;