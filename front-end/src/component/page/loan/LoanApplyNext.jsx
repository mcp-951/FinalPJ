import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // jwtDecode는 함수 형태이므로 함수로 호출해야 함
import axios from "axios";
import { Container, Form, Row, Col, Button } from 'react-bootstrap';

function LoanApplyNext () {
    const navigate = useNavigate();
    const { loanProductNo } = useParams();
    const [autoTransferDTO, setAutoTransferDTO] = useState({
        accountNo: '',
        receiveAccountNo: 0,
        autoSendPrice: '',
        startDate: '',
        endDate: '',
        transferDay: '',
        toBankName: '우람은행',
        autoAgreement: 'Y',
    });

    const [loanDTO, setLoanDTO] = useState({
        userNo: '',
        repaymentType: "원리금균등분할상환",
        loanTern: '',
        loanProductNo: '',
        loanAmount: '',
        loanInterest: '',
        interestRate: 19.9,
    });

    const [token, setToken] = useState(null); // token 상태 추가
    const [loanData, setLoanData] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // autoTransferDTO 상태 업데이트
        setAutoTransferDTO((prev) => ({
            ...prev,
            [name]: value,
        }));

        // loanDTO 상태 업데이트
        setLoanDTO((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleAccountChange = (event) => {
        const selectedAccountNo = event.target.value;
        setAutoTransferDTO((prevState) => ({
            ...prevState,
            accountNo: selectedAccountNo, // 선택된 계좌 번호로 업데이트
        }));
    };
    

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken); // 토큰 설정
            const decodedToken = jwtDecode(storedToken);
            const checkLoanJoin = async () => {
                try {
                    const response = await axios.get(`http://13.125.114.85:8081/loan/apply/join/${decodedToken.userNo}/${loanProductNo}`, {
                        headers: {
                            Authorization: `Bearer ${storedToken}` // JWT를 헤더에 추가
                        }
                    });
                    const data = response.data;
                    console.log(data + "가입했는지 안했는지!!!!");
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
            setLoanDTO((prev) => ({
                ...prev,
                userNo: decodedToken.userNo || '', // userId 값을 설정
            }));
        }
    }, [token]);

    useEffect(() => {
        const fetchLoanProduct = async () => {
            try {
                const response = await axios.get(`http://13.125.114.85:8081/loan/detail/${loanProductNo}`);
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
        const { loanAmount, loanTern, interestRate } = loanDTO;
        // 값이 숫자인지 확인하고, 계산이 가능한 경우에만 실행
        if (!isNaN(loanAmount) && !isNaN(loanTern) && !isNaN(interestRate) && loanAmount > 0 && loanTern > 0 && interestRate > 0) {
            const totalInterest = loanAmount * (loanTern / 12) * (interestRate / 100);
            setLoanDTO((prev) => ({
                ...prev,
                loanInterest: totalInterest, // 소수점 2자리까지 표시
            }));
        }
    }, [loanDTO.loanAmount, loanDTO.loanTern, loanDTO.interestRate]);

    // 계좌 정보를 가져오는 부분
    useEffect(() => {
        const fetchAccount = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                try {
                    const response = await axios.get(`http://13.125.114.85:8081/loan/apply/account/${decodedToken.userNo}`, {
                        headers: {
                            Authorization: `Bearer ${token}` // JWT를 헤더에 추가
                        }
                    });
                    const data = response.data;
                    console.log(data);
                    if (data.length === 0) {
                        alert("계좌를 먼저 생성해주세요.");
                        navigate('/');
                    } else {
                        // 계좌 정보를 저장
                        setAutoTransferDTO(prev => ({
                            ...prev,
                            accounts: data, // 가져온 계좌 데이터를 accounts로 저장
                        }));
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        };
        fetchAccount();
    }, []);

    useEffect(() => {
        setLoanDTO((prev) => ({
            ...prev,
            loanProductNo: loanProductNo, // loanProductNo 값 설정
        }));
    }, [loanProductNo]);

    const moveApply = () => {
        if (loanDTO.loanAmount > loanData.loanMaxLimit || loanDTO.loanAmount < loanData.loanMinLimit ) {
            if(loanDTO.loanAmount.length == 0){alert("대출 받을 금액을 입력해 주세요."); return;}
            else{alert(loanData.loanMinLimit + " ~ " +loanData.loanMaxLimit + "사이를 입력해주세요."); return;}
        }
        else if (loanDTO.loanTern.length == 0) {
            alert("상환기간을 선택해 주세요.");
            return;
        }

        else if (autoTransferDTO.transferDay.length == 0){
            alert("자동 납일 날짜를 선택해 주세요.");
            return;
        }

        else if (autoTransferDTO.accountNo.length === 0){
            alert("지급 받을 계좌를 선택해 주세요.");
            return;
        }

        else{
            sendData();
        }
    };

    const sendData = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            try {
                const response = await axios.post('http://13.125.114.85:8081/loan/apply/send', {
                    autoTransferDTO, 
                    loanDTO: {
                        ...loanDTO, 
                        userNo: decodedToken.userNo 
                    }
                }, {
                    headers: {
                        Authorization: `Bearer ${token}` 
                    }
                });
    
                const data = response.data;
                if(data === 1){
                    alert("신청완료");
                    navigate('/');
                }
                else{
                    alert("실패띠")
                }
                console.log('Success:', data); // 성공적으로 데이터가 전송된 경우
            } catch (error) {
                console.log('Error:', error); // 에러 처리
            }
        }
    };

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
                                value={loanDTO.loanAmount.toLocaleString() || ''} 
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
                                value={loanDTO.loanTern}
                                onChange={handleChange}
                            >
                                <option value="">기간 선택</option>
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
                                value={loanDTO.interestRate}
                                readOnly
                                style={{ backgroundColor: '#f8f9fa', borderColor: '#ced4da' }} // 배경색과 테두리 색상 조정
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="loanInterest" className="mt-3">
                        <Form.Label column sm={3} className="text-left">이자 총합</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                name="loanInterest"
                                value={loanDTO.loanInterest.toLocaleString() || ''}  // loanInterest 값을 할당
                                readOnly
                                style={{ backgroundColor: '#f8f9fa', borderColor: '#ced4da' }} // 배경색과 테두리 색상 조정
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="transferDay" className="mt-3">
                        <Form.Label column sm={3} className="text-left">이체일</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                as="select"
                                name="transferDay"
                                value={autoTransferDTO.transferDay}
                                onChange={handleChange}
                            >
                                <option value="">이체일 선택</option>
                                <option value="1">1일</option>
                                <option value="10">10일</option>
                                <option value="20">20일</option>
                            </Form.Control>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="accountNo" className="mt-3">
                        <Form.Label column sm={3} className="text-left">계좌 선택</Form.Label>
                        <Col sm={6}>
                            <Form.Control
                                as="select"
                                name="accountNo"
                                onChange={handleAccountChange}
                            >
                            <option value="">계좌 선택</option>
                            {autoTransferDTO.accounts ? (
                                autoTransferDTO.accounts.map(account => (
                                    <option key={account.accountNo} value={account.accountNo}>
                                        {account.accountNumber}
                                    </option>
                                ))
                            ) : (
                                <option value="">계좌 정보를 불러오는 중입니다...</option>
                            )}
                            </Form.Control>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mt-3">
                        <Col sm={{ span: 6, offset: 3 }}>
                            <Button variant="primary" type="button" onClick={moveApply}>신청</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Row>
        </Container>
    );
}

export default LoanApplyNext;