import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import apiSer from '../../ApiService';
import { useNavigate } from 'react-router-dom';
import getAddress from './GetAddress';
import '../../../resource/css/SignUp.css';

function SignUp_() {
    const [form, setForm] = useState({
        userId: '',
        userPw: '',
        confirmPassword: '',
        name: '',
        email1: '',
        email2: '',
        hp: '',
        birth: '',
        residentNumber1: '',
        residentNumber2: '',
        hpAuthkey: '',
        ocrFile: null,
        address: '',
        address1: '',
        address2: ''
    });

    const [idCheckMessage, setIdCheckMessage] = useState('');
    const [idCheckState, setIdCheckState] = useState('');
    const [startCheckHp, setStartCheckHp] = useState(false);
    const [stateAuth, setStateAuth] = useState(false);
    const [pwSameCheck, setPwSameCheck] = useState(false);
    const [plusAddress, setPlusAddress] = useState(false);
    const navigate = useNavigate();
    const [hpAuthKey, setHpAuthKey] = useState('');
    const [authHp, setAuthHp] = useState('');
    const [resNoError1, setResNoError1] = useState('');
    const [resNoError2, setResNoError2] = useState('');
    const [ocrCheck, setOcrCheck] = useState(false);
    
    // 정규식
    const reg_id = /^(?=.*?[a-zA-Z0-9]).{6,16}$/;
    const reg_password = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,20}$/;

    // 입력창 실시간 업데이트
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // 아이디 체크
    const idCheck = () => {
        const userId = form.userId;
        if (userId === "") {
            setIdCheckMessage('아이디를 입력하세요');
        } else {
            handleCheckId(userId);
        }
    };

    const handleCheckId = (userId) => {
        apiSer.checkId(userId)
            .then((response) => {
                if (response.data === '') {
                    setIdCheckMessage(`${userId}는(은) 사용 가능한 아이디입니다.`);
                    setIdCheckState(true);
                } else {
                    setIdCheckMessage(`${userId}는(은) 이미 존재하는 아이디입니다.`);
                    setIdCheckState(false);
                }
            })
            .catch((error) => {
                console.error("Error checking ID: ", error);
            });
    };

    // 비밀번호 체크
    useEffect(() => {
        if (form.userPw !== form.confirmPassword) {
            setPwSameCheck(true);
        } else {
            setPwSameCheck(false);
        }
    }, [form.userPw, form.confirmPassword]);

    // 주민등록번호 체크
    useEffect(() => {
        if (form.residentNumber1.length !== 6) {
            setResNoError1('주민등록번호 앞자리는 6자리여야 합니다.');
        } else {
            setResNoError1('');
        }

        if (form.residentNumber2.length !== 7) {
            setResNoError2('주민등록번호 뒷자리는 7자리여야 합니다.');
        } else {
            setResNoError2('');
        }
    }, [form.residentNumber1, form.residentNumber2]);

    // 휴대폰 인증
    const hpCheck = () => {
        const hp = form.hp;
        if (hp.length < 10 || hp.length > 11) {
            setIdCheckMessage('올바른 휴대폰 번호를 입력하세요');
        } else {
            handleCheckHp(hp);
            setStartCheckHp(true);
        }
    };

    const handleCheckHp = (hp) => {
        apiSer.checkHp(hp)
            .then((response) => {
                setHpAuthKey(response.data);
            })
            .catch((error) => {
                console.error("Error checking Hp: ", error);
            });
    };

    // 주소 검색 팝업
    const openPopup = () => {
        const width = 500;
        const height = 400;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const windowFeatures = `width=${width},height=${height},left=${left},top=${top}`;
        window.open("/getAddress", 'getAddress', windowFeatures);
    };

    // 회원가입 완료
    const handleSubmit = (e) => {
        e.preventDefault();
        if (idCheckState === '' || idCheckState === false) {
            setIdCheckMessage('중복 확인 해주세요.');
        } else if (form.userPw === '' || form.userPw !== form.confirmPassword) {
            alert("비밀번호 확인 바랍니다.");
        } else {
            apiSer.signUp({...form});
            navigate("/login");
        }
    };

    const authingKey = () => {
        if (form.hpAuthkey === hpAuthKey) {
            setStateAuth(true);
        } else {
            setStateAuth(false);
            alert("인증번호가 일치하지 않습니다.");
        }
    };

    return (
        <Container>
            <Row>
                <Col>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formUserId">
                            <Form.Label>아이디</Form.Label>
                            <Form.Control
                                type="text"
                                name="userId"
                                value={form.userId}
                                onChange={handleChange}
                                placeholder="6-20자 영문, 숫자"
                            />
                            <Button type="button" onClick={idCheck}>중복 체크</Button>
                            <Form.Text>{idCheckMessage}</Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label>비밀번호</Form.Label>
                            <Form.Control
                                type="password"
                                name="userPw"
                                value={form.userPw}
                                onChange={handleChange}
                                placeholder="8-12자 영문, 숫자, 특수문자"
                            />
                        </Form.Group>

                        <Form.Group controlId="formConfirmPassword">
                            <Form.Label>비밀번호 확인</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="8-12자 영문, 숫자, 특수문자"
                            />
                            {pwSameCheck && <Form.Text>비밀번호가 일치하지 않습니다.</Form.Text>}
                        </Form.Group>

                        <Form.Group controlId="formName">
                            <Form.Label>이름</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formResidentNumber">
                            <Form.Label>주민등록번호</Form.Label>
                            <Form.Control
                                type="text"
                                name="residentNumber1"
                                value={form.residentNumber1}
                                onChange={handleChange}
                                required
                            />
                            {resNoError1 && <Form.Text style={{ color: 'red' }}>{resNoError1}</Form.Text>}
                            <Form.Control
                                type="password"
                                name="residentNumber2"
                                value={form.residentNumber2}
                                onChange={handleChange}
                                required
                            />
                            {resNoError2 && <Form.Text style={{ color: 'red' }}>{resNoError2}</Form.Text>}
                        </Form.Group>

                        <Form.Group controlId="formEmail">
                            <Form.Label>이메일</Form.Label>
                            <Form.Control
                                type="text"
                                name="email1"
                                value={form.email1}
                                onChange={handleChange}
                                required
                            />
                            @
                            <Form.Control
                                type="text"
                                name="email2"
                                value={form.email2}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formHp">
                            <Form.Label>휴대폰</Form.Label>
                            <Form.Control
                                type="tel"
                                name="hp"
                                value={form.hp}
                                onChange={handleChange}
                                placeholder="010 1234 5678"
                                required
                            />
                            <Button type="button" onClick={hpCheck}>인증번호받기</Button>
                        </Form.Group>

                        {startCheckHp && (
                            <Form.Group controlId="formHpAuthKey">
                                <Form.Label>인증번호</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="hpAuthkey"
                                    value={form.hpAuthkey}
                                    onChange={handleChange}
                                    required
                                />
                                {stateAuth && <Form.Text>인증 성공</Form.Text>}
                                <Button type="button" onClick={authingKey}>인증</Button>
                            </Form.Group>
                        )}

                        <Form.Group controlId="formAddress">
                            <Form.Label>주소</Form.Label>
                            <Form.Control
                                type="text"
                                name="address1"
                                value={form.address1}
                                readOnly
                                required
                            />
                            <Button type="button" onClick={openPopup}>주소 검색</Button>
                            <Form.Control
                                type="text"
                                name="address2"
                                value={form.address2}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Button type="submit">회원가입</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default SignUp_;