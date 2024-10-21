import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // jwtDecode는 함수 형태이므로 함수로 호출해야 함
import axios from "axios";
import { Container, Form, Row, Col, Button } from 'react-bootstrap';

function LoanApplyNext () {
    const navigate = useNavigate();
    const { loanProductNo } = useParams();
    const [form, setForm] = useState({
        userId: '',
        transferDay: '',
        loanAmount: '',
        repaymentType : "원리금균등분할상환",
        loanTern : '',
        loanInterest: '',
    });
    const [token, setToken] = useState(null); // token 상태 추가
    const [loanData, setLoanData] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken); // 토큰 설정
            const decodedToken = jwtDecode(storedToken); 
            const checkLoanJoin = async () => {
                try {
                    const response = await axios.get(`http://localhost:8081/loan/apply/join/${decodedToken.userNo}/${loanProductNo}`, {
                        headers: {
                            Authorization: `Bearer ${storedToken}` // JWT를 헤더에 추가
                        }
                    });
                    const data = response.data;
                    
                    if (data === 1) {
                        alert("같은 대출 상품은 한번만 가입 가능합니다.");
                        navigate('/');
                    }
                } catch (error) {
                    console.log(error);
                }
            };
            checkLoanJoin();
        }
    }, [loanProductNo, navigate]);

    useEffect(() => {
        // 토큰에서 userId 추출
        if (token) {
            const decodedToken = jwtDecode(token);
            setForm((prevForm) => ({
                ...prevForm,
                userId: decodedToken.userId || '', // userId 값을 설정
            }));
        }
    }, [token]);

    useEffect(() => {
        const fetchLoanProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/loan/detail/${loanProductNo}`);
                const data = response.data;
                setLoanData(data);
                console.log(data);
            } catch (error) {
                console.log("값을 못가져 왔음", error);
            }
        };
        fetchLoanProduct();
    }, [loanProductNo]);

    useEffect(() => {
        const { loanAmount, loanTern, interestRate } = form;
        if (loanAmount && loanTern && interestRate) {
            const totalInterest = loanAmount * (loanTern / 12) * interestRate;
            setForm((prevForm) => ({
                ...prevForm,
                totalInterest: totalInterest.toFixed(2), // 소수점 2자리까지 표시
            }));
        }
    }, [form.loanAmount, form.loanTern, form.interestRate]);

    return (
        <Container>
            <Row>
                <div>
                    <h2>상품가입</h2>
                </div>
                <Form>
                    <Form.Group as={Row} controlId="loanProductNo" className="mt-3">
                        <Form.Label column sm={3} className="text-left">가입 상품</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="loanProductNo"
                                value={loanData ? loanData.loanProductTitle : ""}
                                readOnly
                                style={{ backgroundColor: '#f8f9fa', borderColor: '#ced4da' }} // 배경색과 테두리 색상 조정
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="loanAmount" className="mt-3">
                        <Form.Label column sm={3} className="text-left">대출 받을 금액</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="loanAmount"
                                value={form.loanAmount} 
                                onChange={handleChange}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="loanTern" className="mt-3">
                        <Form.Label column sm={3} className="text-left">상환 기간</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                as="select"
                                name="loanTern"
                                value={form.loanTern}
                                onChange={handleChange}
                            >
                                <option value="">기간 선택</option>
                                {/* loanData가 존재하는지 확인한 후 옵션 생성 */}
                                {loanData ? (
                                    Array.from({length: (loanData.loanMaxTern - loanData.loanMinTern) / 12 + 1}, (_, i) => loanData.loanMinTern + i * 12).map((term) => (
                                        <option key={term} value={term}>
                                            {term}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">상환 기간을 불러오는 중입니다...</option>
                                )}
                            </Form.Control>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="interestRate" className="mt-3">
                        <Form.Label column sm={3} className="text-left">적용 이율</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="interestRate"
                                value="19.9"
                                readOnly
                                style={{ backgroundColor: '#f8f9fa', borderColor: '#ced4da' }} // 배경색과 테두리 색상 조정
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="loanAmount" className="mt-3">
                        <Form.Label column sm={3} className="text-left">이자 총합</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="loanAmount"
                                value={form.loanInterest}
                                onChange={handleChange}
                                readOnly
                                style={{ backgroundColor: '#f8f9fa', borderColor: '#ced4da' }} // 배경색과 테두리 색상 조정
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="repaymentType" className="mt-3">
                        <Form.Label column sm={3} className="text-left">상환 방식</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="repaymentType"
                                value={form.repaymentType}
                                readOnly
                                style={{ backgroundColor: '#f8f9fa', borderColor: '#ced4da' }} // 배경색과 테두리 색상 조정
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="transferDay" className="mt-3">
                        <Form.Label column sm={3} className="text-left">납입일</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                as="select"
                                name="transferDay"
                                value={form.transferDay}
                                onChange={handleChange}
                                style={{ backgroundColor: '#f8f9fa', borderColor: '#ced4da' }} // 배경색과 테두리 색상 조정
                            >
                                <option value="">날짜 선택</option>
                                {[...Array(30)].map((_, index) => (
                                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                                ))}
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-3">가입완료</Button>
                </Form>
            </Row>
        </Container>
    );
}

export default LoanApplyNext;