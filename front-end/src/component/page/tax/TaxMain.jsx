import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import axios from "axios";
import '../../../resource/css/tax/TaxMain.css';

function TaxMain(){
    const navigate = useNavigate();
    const [category, setCategory] = useState('electro');
    const [sum, setSum] = useState(null);
    const [taxData, setTaxData] = useState(null);
    const [userName, setUserName] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const taxDetailGo = () =>{
        navigate('/tax/Detail');
    }

    const taxHistoryGo = () =>{
        navigate('/tax/History');
    }

    useEffect(() => {
        if(token == null){
            alert("로그인이 필요합니다.");
            navigate('/');
            return;
        } else {
            setToken(localStorage.getItem('token'));
            const decodedToken = jwtDecode(token);
            setUserName(decodedToken.name);

            const fetchTaxData = async () => {
                try {
                    const response = await axios.get(`http://localhost:8081/tax/TaxMain/${decodedToken.userNo}/${category}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }});
                    const data = response.data;
                    setTaxData(data);
                    setSum(data.basicFee1 + data.basicFee2 + data.basicFee3 + data.fee1 + data.fee2 + data.fee3);
                } catch(error) {
                    console.error("값을 못가져왔음", error);
                }
            };
            fetchTaxData();
        }
    }, [category, token, navigate]);

    const waterCategory = () => {
        setCategory('water');
    };

    const electroCategory = () => {
        setCategory('electro');
    };

    return (
        <div className="TaxMain-container">
            <div className="TaxMain-title">
                <h2>공과금 관리</h2>
                <div className="TaxMain-buttons">
                    <button onClick={electroCategory}>전기</button>
                    <button onClick={waterCategory}>수도</button>
                </div>
            </div>
            <div className="TaxMain-price">
                <div className="TaxMain-textBox">
                    {taxData ? (
                        <p>{userName}님의 {taxData.taxWriteDate.substring(5, 7)}월달 {taxData.taxCategory === 'electro' ? '전기세' : '수도세'}는 {sum}원 입니다.</p>
                    ) : (
                        <p>{userName}님의 {category === 'electro' ? '전기세' : '수도세'}는 0원 입니다.</p>
                    )}
                </div>
            </div>
            <div className="TaxMain-bottom">
                <button onClick={taxDetailGo}>납부하기</button>
                <button onClick={taxHistoryGo}>납부내역</button>
            </div>
        </div>
    );
}

export default TaxMain;
