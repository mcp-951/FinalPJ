import React,{useEffect, useState} from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import { Container, Form, Row, Col, Button} from 'react-bootstrap';

function LoanApplyNext () {
    const navigate = useNavigate();
    const { loanProductNo } = useParams();
    useEffect(() => {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token); 
        const checkLoanJoin = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/loan/apply/join/${decodedToken.userNo}/${loanProductNo}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // JWT를 헤더에 추가
                    }})
                    const data = response.data
                    
                    if(data === 1){
                        alert("같은 대출 상품은 한번만 가입 가능합니다.");
                        navigate('/');
                    }
            } catch(error){console.log(error)}
        }
        checkLoanJoin();
    }, [])
    return(
        <Container>
            <Row>
                <div>
                    <h2>상품가입</h2>
                </div>
                <Form>

                </Form>
            </Row>
        </Container>
    );
}

export default LoanApplyNext;
