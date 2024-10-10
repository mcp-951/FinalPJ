import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from "axios";

import '../../../resource/css/tax/TaxHistory.css'

function TaxHistory(){
    const navigate = useNavigate();
    const [logData, setLogData] =useState([]);
    useEffect(() =>{
        const token = localStorage.getItem('token');

        
        if(token == null){
            alert("로그인이 필요합니다.");
            navigate('/');
            return;
        }

        else{
            const decodedToken = jwtDecode(token);
            const taxUserLog = async () =>{
                try{
                    const response = await axios.get(`http://localhost:8081/tax/taxHistory/${decodedToken.userNo}`, {
                        headers: {
                            Authorization: `Bearer ${token}` // JWT를 헤더에 추가
                        }})
                    const data = response.data;
                    console.log(data)
                    setLogData(data)
                }catch(error){
                    console.error("값을 못가져왔음" ,error);
                }
            } 
            taxUserLog();
        }
    }, []);

    const goPage = () =>{
        navigate('/tax/Detail')
    }
    return(
        <div className="HistoryContainer">
            <div className="HistoryList">
                <table>
                    <thead>
                        <tr>
                            <th>관리번호</th>
                            <th>종류</th>
                            <th>기본료</th>
                            <th>사용료</th>
                            <th>청구료</th>
                            <th>납부기한</th>
                            <th>납부상태</th>
                        </tr>
                    </thead>
                    <tbody>
                    {logData.length > 0 ? ( // logData가 비어있지 않은 경우
                            logData.map((item) => ( // logData의 각 항목을 반복하여 렌더링
                                <tr key={item.taxNo}>
                                    <td>{item.taxNo || '-'}</td>
                                    <td>{item.taxCategory =='electro' ? ('전기세') : ('수도세') || '-'}</td>
                                    <td>{item.basicFee1 + item.basicFee2 + item.basicFee3 || '-'}</td>
                                    <td>{item.fee1 + item.fee2 + item.fee3 || '-'}</td>
                                    <td>{item.basicFee1 + item.basicFee2 + item.basicFee3 + item.fee1 + item.fee2 + item.fee3 || '-'}</td>
                                    <td>{item.taxDeadLine || '-'}</td>
                                    <td>{item.taxState == 'N' ? (<button onClick={goPage}>납부하기</button>) : ('납부완료') || '-'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">데이터가 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TaxHistory;