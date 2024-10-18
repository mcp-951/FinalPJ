import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

function SignUp_() {
    const fontsize = { fontSize: '0.8rem' };
    // Id 입력 값
    const [userId, setUserId] = useState('');
    // 비밀번호 입력 값
    const [password, setPassword] = useState('');
    // 비밀번호 확인 입력 값
    const [passwordCK, setPasswordCK] = useState('');
    // 이메일 입력 값
    const [email, setEmail] = useState('');
    // 도메인 입력값
    const [domain, setDomain] = useState('선택해주세요');
    // 사용자 지정 도메인 값
    const [customDomain, setCustomDomain] = useState('');
    // 이름 입력 값
    const [username, setuserName] = useState('');
    // 주민번호 입력 값
    const [residentNumberFront, setResidentNumberFront] = useState('');
    const [residentNumberBack, setResidentNumberBack] = useState('');
    //핸드폰번호 입력 값
    const [userHP, setUserHP] = useState('');
    // 핸드폰 인증 값
    

    // 함수 시작
    const userIdInput = (e) => {setUserId(e.target.value);};
    // 비밀번호 입력 함수
    const passwordInput = (e) => {setPassword(e.target.value);};
    // 비밀번호 입력 함수
    const passwordCInput = (e) => {setPasswordCK(e.target.value);};
    //이메일 입력 함
    const emailChange = (e) => {setEmail(e.target.value);};
    const domainChange = (e) => {
        setDomain(e.target.value);
        // "직접 입력"이 선택된 경우 customDomain 상태를 초기화
        if (e.target.value === 'custom') {
            setCustomDomain('');
        }
    };
    const customDomainChange = (e) => {setCustomDomain(e.target.value);};
    const usernameChange = (e) => {setuserName(e.target.value);};
    const residentNumberFrontChange = (e) => {setResidentNumberFront(e.target.value);};
    const residentNumberBackChange = (e) => {setResidentNumberBack(e.target.value);};
    const userHPChange = (e) => {setUserHP(e.target.value);};

    //핸드폰 인증
    const hpCheck = () => {
        const hp = userHP;
        if(hp.length < 10 || hp.length >11) {
            alert('올바른 휴대폰 번호를 입력하세요');
        }else{
            handleCheckHp(hp);
            startCheckHpHandler();
        }
    };
    return (
        <Container className="d-flex justify-content-end align-items-center" style={{ minHeight: '80vh' }}>
            <Row className="w-100">
                <Col md={12} className="mx-auto">
                    <Form onSubmit="">
                        {/* 아이디 입력 */}
                        <Form.Group as={Row} controlId="formUsername" className="mt-3">
                            <Form.Label column sm={3} className="text-left">ID</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="text"
                                    placeholder="아이디를 입력하세요"
                                    name="username"
                                    value={userId}
                                    onChange={userIdInput}
                                />
                            </Col>
                        </Form.Group>

                        {/* 비밀번호 입력 */}
                        <Form.Group as={Row} controlId="formPassword" className="mt-3">
                            <Form.Label column sm={3} className="text-left">비밀번호</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="password"
                                    placeholder="비밀번호를 입력하세요"
                                    name="password"
                                    value={password}
                                    onChange={passwordInput}
                                />
                            </Col>
                        </Form.Group>
                        {/*비밀번호 확인*/}
                        <Form.Group as={Row} controlId="formPassword" className="mt-3">
                            <Form.Label column sm={3} className="text-left">비밀번호 확인</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="password"
                                    placeholder="비밀번호를 다시 입력해 주세요"
                                    name="passwordCK"
                                    value={passwordCK}
                                    onChange={passwordCInput}
                                />
                            </Col>
                            <Col sm={2}>
                                {password !== passwordCK && passwordCK !== '' && (<p style={fontsize} className="text-danger">*비밀번호가 일치하지 않습니다.</p>)}  
                            </Col>
                        </Form.Group>

                        {/* 이메일 입력 */}
                        <Form.Group as={Row} controlId="formEmail" className="mt-3">
                            <Form.Label column sm={3} className="text-left">이메일</Form.Label>
                            <Col sm={3}>
                                <Form.Control
                                    type="text"
                                    placeholder="이메일을 입력하세요"
                                    name="email"
                                    value={email}
                                    onChange={emailChange}
                                />
                            </Col>
                            @
                            <Col sm={3}>
                                <Form.Select value={domain} onChange={domainChange}>
                                    <option value="gmail.com">gmail.com</option>
                                    <option value="naver.com">naver.com</option>
                                    <option value="daum.net">daum.net</option>
                                    <option value="yahoo.com">yahoo.com</option>
                                    <option value="custom">직접 입력</option> {/* 사용자 정의 도메인 선택 */}
                                </Form.Select>
                            </Col>
                        </Form.Group>

                        {/* 직접 입력할 경우 도메인 입력 필드 */}
                        {domain === 'custom' && (
                            <Form.Group as={Row} controlId="formCustomDomain" className="mt-3">
                                <Form.Label column sm={3} className="text-left">도메인</Form.Label>
                                <Col sm={9}>
                                    <Form.Control
                                        type="text"
                                        placeholder="도메인을 입력하세요"
                                        value={customDomain}
                                        onChange={customDomainChange}
                                    />
                                </Col>
                            </Form.Group>
                        )}
                        <Form.Group as={Row} controlId="formUsername" className="mt-3">
                            <Form.Label column sm={3} className="text-left">이름</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="text"
                                    placeholder="이름을 입력해 주세요"
                                    name="username"
                                    value={username}
                                    onChange={usernameChange}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formResidentNumberFront" className="mt-3">
                            <Form.Label column sm={3} className="text-left">주민등록번호 (앞자리)</Form.Label>
                            <Col sm={3}>
                                <Form.Control
                                    type="text"
                                    placeholder="주민등록번호 앞 6자리"
                                    value={residentNumberFront}
                                    onChange={residentNumberFrontChange}
                                    maxLength={6}
                                />
                            </Col>
                            -
                            <Col sm={3}>
                                <Form.Control
                                    type="text"
                                    placeholder="주민등록번호 뒤 7자리"
                                    value={residentNumberBack}
                                    onChange={residentNumberBackChange}
                                    maxLength={7}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formUsername" className="mt-3">
                            <Form.Label column sm={3} className="text-left">ID</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="text"
                                    placeholder="핸드폰 번호를 - 빼고 입력해 주세요."
                                    name="userHP"
                                    value={userHP}
                                    onChange={userHPChange}
                                />
                            </Col>
                            <Col sm={2}>
                                <Button>인증번호 받기</Button>
                            </Col>
                        </Form.Group>
                        
                        <Button variant="primary" type="submit" className="mt-3">회원가입</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default SignUp_;