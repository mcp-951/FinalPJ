import React, { useState, useEffect } from 'react';
import { Container, Form, Row, Col, Button} from 'react-bootstrap';
import '../../../resource/css/loan/LoanApply.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import apiSer from '../../ApiService';

function LoanApply() {
    const { loanProductNo } = useParams();
    const [allChecked, setAllChecked] = useState(false);  // 전체 약관 동의
    const [termsChecked, setTermsChecked] = useState({
        personalInfo: false,
        loanInfo: false,
    });
    const [loanData, setLoanData] = useState(null); // 초기값을 null로 설정
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [firstNo, setFirstNo] = useState(null);
    const [lastNo, setLastNo] = useState(null);
    const [inputLastNo, setInputLastNo] = useState(null);
    const [localNoCheck, setLocalNoCheck] = useState(false);
    const [hpAuthKey, setHpAuthKey] = useState('');
    const [startCheckHp, setStartCheckHp] = useState(false);
    const [authHp, setAuthHp] = useState(false);
    const [stateAuth, setStateAuth] = useState(false);
    const [checkHpNo, setCheckHpNo] = useState('');
  
    useEffect(() => {
        const fetchLoanProduct = async () => {
            try {
                const response = await axios.get(`http://13.125.114.85:8081/loan/detail/${loanProductNo}`);
                const data = response.data;
                setLoanData(data);
                setLoading(false); // 데이터 로딩 완료
                console.log(data);
            } catch (error) {
                console.log("값을 못가져 왔음", error);
                setLoading(false); // 오류 발생 시에도 로딩 완료
            }
        };
        fetchLoanProduct();
    }, [loanProductNo]);

    useEffect(() => {
        const token = localStorage.getItem('token');
    
        if (token == null) {
            alert("로그인이 필요합니다.");
            navigate('/');
            return;
        }
    
        const decodedToken = jwtDecode(token);
        const userNo = decodedToken.userNo;
        console.log(userNo+ "콘솔값입니다.");
        const fetUserInfo = async () => {
            try {
                const response = await axios.get(`http://13.125.114.85:8081/loan/apply/${userNo}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // JWT를 헤더에 추가
                    }
                });
                const data = response.data;
                console.log(data);
                setUserData(data);
                setFirstNo(data.residentNumber.substring(0, 6));
                setLastNo(data.residentNumber.substring(7))
            } catch (error) {
                console.error("사용자 정보를 가져오는 데 실패했습니다.", error.response?.data || error.message);
            }
        };
    
        fetUserInfo();
    }, []);

  const handleAllCheckedChange = () => {
    const newValue = !allChecked;
    setAllChecked(newValue);
    setTermsChecked({
      personalInfo: newValue,
      loanInfo: newValue,
    });
  };

  // 개별 체크박스 상태 업데이트
    const handleIndividualChange = (e) => {
        const { name, checked } = e.target;
        setTermsChecked((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
        // 개별 체크박스가 모두 체크되었을 경우 전체 동의 체크
        if (checked) {
            setAllChecked(checked && termsChecked.personalInfo && termsChecked.loanInfo);
        } else {
            setAllChecked(false);
        }
    };

    // 로딩 중일 때 표시할 메시지
    if (loading) {
        return <div>로딩 중...</div>;
    }

    // loanData가 null일 때 처리
    if (!loanData) {
        return <div>대출 상품 정보를 찾을 수 없습니다.</div>;
    }

    const userLastNo = (e) => {
        setInputLastNo(e.target.value);
    };
    const inputHpCheck = (e) => {
        setCheckHpNo(e.target.value);
    }

    const noCheck = () => {
        if(inputLastNo === lastNo && inputLastNo != null){
            setLocalNoCheck(true);
        }
        else{
            alert("번호를 다시 확인해 주세요.")
        }
    }


    const hpCheck = () => {
        const hp = userData.hp;
        if(hp.length < 10 || hp.length >11) {
        }else{
            handleCheckHp(hp);
            startCheckHpHandler();
        }
    };
    const authingKey = () => {
        const getHpAuthKey = String(hpAuthKey).trim()
        const getFormHpAuthKey = String(checkHpNo).trim()
        if(getHpAuthKey === getFormHpAuthKey) {
            settingStateAuth(true);
            setAuthHp(true);
            }else{
                alert("인증번호가 맞지 않습니다.")
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

    const startCheckHpHandler = () => {
        setStartCheckHp(true);
    };
    const settingStateAuth = () => {
        setStateAuth(true);
    };

    const moveNext = () => {
        if(stateAuth && localNoCheck && termsChecked.personalInfo && termsChecked.loanInfo){
            navigate(`/loanmain/applynext/${loanProductNo}`)
        }
    };



  return (
    <Container>
        <h2>{loanData ? loanData.loanProductTitle : "로딩중"}</h2>
        <Container className='Terms_Agreement_Container'>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check 
            type="checkbox" 
            label="전체 약관 동의" 
            checked={allChecked}
            onChange={handleAllCheckedChange}
            />
        </Form.Group>
             <div className="terms-box-unique">
                <div className="terms-content-unique">
                    <p>
                    제 1 조 (자동이체의 기능)<br />
                    자동이체는 미리 정해진 일정에 따라 지정된 계좌로 자동적으로 이체하는 기능을 의미합니다.
                    지정된 일자에 잔액이 부족할 경우에는 다음 영업일에 자동으로 이체가 진행됩니다.
                    </p>
                    <p>
                    제 2 조 (자동이체 처리)<br />
                    자동이체가 정상적으로 이체될 경우, 이체한 금액은 즉시 지정된 계좌로 반영됩니다.
                    이체 설정을 해제한 경우에는 자동이체가 더 이상 실행되지 않습니다.
                    </p>
                    <p>
                    제 3 조 (이체 실패 처리)<br />
                    지정된 날짜에 잔액이 부족할 경우, 일정 금액의 수수료를 부과할 수 있습니다.
                    </p>
                    <p>
                    제 4 조 (약정 변경 및 해제)<br />
                    은행은 고객의 요청에 따라 자동이체 설정을 변경하거나 해제할 수 있으며, 이러한 변경은 최소 2영업일 전에 요청되어야 합니다.
                    </p>
                    <p>
                    제 5 조 (자동이체 중단)<br />
                    5개월 연속으로 자동이체가 이루어지지 않을 경우 자동이체 설정이 해제될 수 있습니다.
                    </p>
                    <p>
                    제 6 조 (활성화된 자동이체)<br />
                    자동이체는 활성화된 상태에서만 정상적으로 작동하며, 별도의 설정을 통해 비활성화할 수 있습니다.
                    </p>
                    <p>
                    제 7 조 (잔액 부족에 대한 알림)<br />
                    자동이체가 잔액 부족으로 실행되지 않을 경우 알림을 통해 공지합니다.
                    </p>
                    <p>
                    제 8 조 (약관의 변경)<br />
                    은행은 필요에 따라 약관을 변경할 수 있으며, 사전 공지를 통해 변경사항을 고객에게 알립니다.
                    </p>
                    <p>
                    제 9 조 (기타 약정)<br />
                    본 약관에 명시되지 않은 기타 사항에 대해서는 은행의 기본 약관에 따릅니다.
                    </p>
                </div>
            </div>
            <Form.Group className="mb-3 d-flex justify-content-end align-items-center personal-info-group" controlId="formBasicCheckbox">
        <Form.Check 
        className="personal-info-checkbox"
        type="checkbox" 
        label="[필수]개인정보 이용약관"
        name="personalInfo"
        checked={termsChecked.personalInfo}
        onChange={handleIndividualChange}
        />
    </Form.Group>
    <Form.Group className="mb-3 d-flex justify-content-end align-items-center loan-info-group" controlId="formBasicCheckbox">
        <Form.Check 
        className="loan-info-checkbox"
        type="checkbox" 
        label="[필수]대출 이용약관"
        name="loanInfo"
        checked={termsChecked.loanInfo}
        onChange={handleIndividualChange}
        />
    </Form.Group>
        </Container>
        <Container className=''>
            <Row className="w-100">
                <Form>
                    <Form.Group as={Row} controlId="userId" className="mt-3">
                        <Form.Label column sm={3} className="text-left">이름</Form.Label>
                        <Col sm={6}>
                        <Form.Control
                            type="text"
                            name="userName"
                            value={userData ? userData.name : "로딩중"}
                            readOnly
                            style={{ backgroundColor: '#f8f9fa', borderColor: '#ced4da' }} // 배경색과 테두리 색상 조정
                        />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="residentNumber1" className="mt-3">
                    <Form.Label column sm={3} className="text-left">주민등록번호</Form.Label>
                        <Col sm={3}>
                            <Form.Control
                                type="text"
                                placeholder="주민등록번호 앞 6자리"
                                name='residentNumber1'
                                value={userData ? firstNo : "로딩중"}
                                readOnly
                                style={{ backgroundColor: '#f8f9fa', borderColor: '#ced4da' }} // 배경색과 테두리 색상 조정
                            />
                        </Col>
                        -
                        <Col sm={3}>
                            <Form.Control
                                type="password"
                                placeholder="주민등록번호 뒤 7자리"
                                name='residentNumber2'
                                value={inputLastNo}
                                onChange={userLastNo}
                                maxLength={7}
                            />
                        </Col>
                        <Col sm={2}>
                            {localNoCheck ? (<div>인증완료</div>) : (<Button className="auth-button" onClick={noCheck}>인증하기</Button>) }
                        </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formUsername" className="mt-3">
                            <Form.Label column sm={3} className="text-left">ID</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="tel"
                                    placeholder="핸드폰 번호를 - 빼고 입력해 주세요."
                                    name="hp"
                                    value={userData ? userData.hp : "로딩중"}
                                />
                            </Col>
                            <Col sm={2}>
                                <Button className="auth-button" onClick={hpCheck}>인증번호 받기</Button>
                            </Col>
                    </Form.Group>
                    {startCheckHp && (
                        <Form.Group controlId="formHpAuthKey" className="mt-3">
                        <Row className="align-items-center">
                            <Form.Label column sm={3}>인증번호</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="text"
                                    name="hpAuthkey"
                                    value={checkHpNo}
                                    onChange={inputHpCheck}
                                    required
                                    placeholder="인증번호를 입력하세요" // Placeholder 추가
                                />
                            </Col>
                            <Col sm={2}>
                                <Button type="button" onClick={authingKey}>
                                    인증번호 확인
                                </Button>
                            </Col>
                            <Col sm={1}>
                                {stateAuth && (
                                    <Form.Text style={{ color: 'green' }}>
                                        인증 성공
                                    </Form.Text>
                                )}
                            </Col>
                        </Row>
                    </Form.Group>
                    )}
                </Form>
            </Row>
        </Container>
        <Container className="Next_Cancel_Container">
        <Button className="next-button" onClick={moveNext}>다음</Button>
        <Button className="cancel-button">취소</Button>
    </Container>

    </Container>
  );
}

export default LoanApply;