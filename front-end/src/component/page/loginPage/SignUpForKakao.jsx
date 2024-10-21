import React, { useEffect , useState } from 'react';
import '../../../resource/css/SignUp.css';
import apiSer from 'component/ApiService';
import {useNavigate, useLocation} from 'react-router-dom';
import getAddress from './GetAddress'
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

function SignUpForKakao() {
    const location = useLocation();
    const navigate = useNavigate();
    const { kakaoId } = location.state || {}; // state에서 kakaoId 가져오기
    const [form, setForm] = useState({
        userId: '',
        userPw: '',
        name: '',
        hp: '',
        birth: '',
        residentNumber1 : '',
        residentNumber2 : '',
        hpAuthkey:'',
        ocrFile: '',
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
    const [hpAuthKey, setHpAuthKey] = useState('');
    const [authHp, setAuthHp] = useState(false);
    const [resNoError1, setResNoError1] = useState('');
    const [resNoError2, setResNoError2] = useState('');
    const [ocrCheck, setOcrCheck] = useState(false);
    const [ocrName, setOcrName] =useState('');
    const [ocrLocalNo, setOcrLocalNo] = useState('');

    // 카카오 아이디를 form에 설정
    useEffect(() => {
        if (kakaoId) {
            setForm((prevForm) => ({
                ...prevForm,
                userId: kakaoId,
                userPw: kakaoId
            }));
        }
    }, [kakaoId]);
    // 입력창 실시간 업데이트
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...form, [name]: value }));
    };

    const startCheckHpHandler = () => {
        setStartCheckHp(true);
    };

    const settingStateAuth = () => {
        setStateAuth(true);
    };


    //이메일 셀렉트 박스 자동 입력
    const handleChangeEmail2 = (e) => {
      const selectedEmail = e.target.value;
      setForm({ ...form, email2: selectedEmail });
    };

    const checkResNo1 = () => {
    if (form.residentNumber1 && form.residentNumber1.length !== 6) {
        setResNoError1('주민등록번호 앞자리는 6자리여야 합니다.');
    } else {
        setResNoError1('');
    }
};

const checkResNo2 = () => {
    if (form.residentNumber2 && form.residentNumber2.length !== 7) {
        setResNoError2('주민등록번호 뒷자리는 7자리여야 합니다.');
    } else {
        setResNoError2('');
    }
};

    useEffect(() => {
        if(form.residentNumber1 !== null){
            checkResNo1();
            }
        if(form.residentNumber2 !== null){
            checkResNo2();
            }

        },[form.residentNumber1, form.residentNumber2]);

    // 휴대폰
    const hpCheck = () => {
        const hp = form.hp;
        if(hp.length < 10 || hp.length >11) {
            setIdCheckMessage('올바른 휴대폰 번호를 입력하세요');
        }else{
            console.log("hp :" + hp)
            handleCheckHp(hp);
            startCheckHpHandler();
        }
    };
    const authingKey = () => {
        const getHpAuthKey = String(hpAuthKey).trim()
        const getFormHpAuthKey = String(form.hpAuthkey).trim()
        console.log("hpAuthKey : " + hpAuthKey +", form.hpAuthkey :"+ form.hpAuthkey)
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

    // 주소
    const openPopup = link => {
        // 팝업 window의 크기 지정
        const width = 500;
        const height = 400;

        // 팝업을 부모 브라우저의 정 중앙에 나열
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const windowFeatures = `width=${width},height=${height},left=${left},top=${top}`;

        // 팝업을 열고 window 속성 지정
        const popup = window.open("/getAddress", 'getAddress', windowFeatures);
    };
    useEffect(() => {
        const receiveMessage = (event) => {
            if (event.origin !== window.location.origin) return; // 보안 상 다른 도메인에서 온 메시지 무시
            if (event.data.address) {
                setForm((prevForm) => ({ ...prevForm, address1: event.data.address }));
                getPlusAddress();
            }
        };
        window.addEventListener('message', receiveMessage);
        return () => {
            window.removeEventListener('message', receiveMessage);
        };
    }, []);
    const getPlusAddress = () => {
        setPlusAddress(true);
    }

    const ocrMove = () => {
      const localNo = form.residentNumber1 + form.residentNumber2;
      const userName = form.name;

      if (!ocrCheck) {
        // 팝업 열기
        const popup = window.open('http://localhost:3000/ocr', '_blank');

        // 팝업에서 메시지를 받을 listener 설정
        window.addEventListener('message', (event) => {
          if (event.origin === 'http://localhost:3000') { // 보안을 위해 origin 확인
            const { value1, value2 } = event.data; // 객체에서 값 추출

            setOcrName(value1); // 첫 번째 메시지 상태 업데이트
            setOcrLocalNo(value2); // 두 번째 메시지 상태 업데이트

            // 값이 null이 아니면서 조건을 만족할 때
            if (value1 && value2 && userName === value1 && value2 === localNo) {
              setOcrCheck(true);
              setForm({ocrCheck : "1"});
            }
          }
        });
      }
    };

    // 회원가입 완료
    const handleSubmit = (e) => {
        e.preventDefault();  // 기본 폼 제출 방지
        if (authHp === 'false' || authHp === '') {
            alert("휴대폰 인증이 되지 않았습니다.");
        } else {
            console.log("주소: ", form.address);
            console.log("폼 데이터: ", { ...form });
            apiSer.signUp({ ...form })
                .then((response) => {
                    console.log('회원가입 성공:', response);
                    // 성공 시 처리
                    navigate("/login");
                })
                .catch((error) => {
                    console.error('회원가입 중 오류 발생:', error);
                    // 오류 시 처리
                });
        }
    };

    return (
    <Container className="d-flex justify-content-end align-items-center" style={{ minHeight: '80vh' }}>
      <Row className="w-100">
        <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} controlId="userId" className="mt-3">
          <Form.Label column sm={3} className="text-left">아이디</Form.Label>
          <Col sm={6}>
              <Form.Control
                  type="text"
                  placeholder="아이디를 입력하세요"
                  name="userId"
                  value={form.userId}
                  onChange={handleChange}
              />
          </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="userPw" className="mt-3">
        <Form.Label column sm={3} className="text-left">비밀번호</Form.Label>
        <Col sm={6}>
            <Form.Control
                type="password"
                placeholder="비밀번호를 입력하세요, 8-12자 영문, 숫자, 특수문자"
                name="userPw"
                value={form.userPw}
                onChange={handleChange}
            />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="name" className="mt-3">
          <Form.Label column sm={3} className="text-left">이름</Form.Label>
          <Col sm={6}>
              <Form.Control
                  type="text"
                  placeholder="이름을 입력해 주세요"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
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
                  value={form.residentNumber1}
                  onChange={handleChange}
                  maxLength={6}
              />
          </Col>
          -
          <Col sm={3}>
              <Form.Control
                  type="password"
                  placeholder="주민등록번호 뒤 7자리"
                  name='residentNumber2'
                  value={form.residentNumber2}
                  onChange={handleChange}
                  maxLength={7}
              />
          </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formUsername" className="mt-3">
              <Form.Label column sm={3} className="text-left">ID</Form.Label>
              <Col sm={6}>
                  <Form.Control
                      type="tel"
                      placeholder="핸드폰 번호를 - 빼고 입력해 주세요."
                      name="hp"
                      value={form.hp}
                      onChange={handleChange}
                  />
              </Col>
              <Col sm={2}>
                  <Button onClick = {hpCheck}>인증번호 받기</Button>
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
                            value={form.hpAuthkey}
                            onChange={handleChange}
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
        <Form.Group as={Row} controlId="formUsername" className="mt-3">
            <Form.Label column sm={3} className="text-left">생년월일</Form.Label>
            <Col sm={6}>
                <Form.Control
                    type="date"
                    name="birth"
                    value={form.birth}
                    onChange={handleChange}
                />
            </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="formUsername" className="mt-3">
            <Form.Label column sm={3} className="text-left">신분증 인증</Form.Label>
            <Col sm={6}>
              {!ocrCheck ? (<p>인증이 완료되지 않았습니다.</p>) : (<p>인증이 완료되었습니다.</p>)}
            </Col>
            <Col sm={2}>
              <Button onClick={ocrMove}>인증하기</Button>
            </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="formUsername" className="mt-3">
            <Form.Label column sm={3} className="text-left">주소</Form.Label>
            <Col sm={6}>
            <Form.Control
                    type="text"
                    name="address"
                    value={form.address1}
                    onChange={handleChange}
                />
            </Col>
            <Col sm={2}>
              <Button onClick={openPopup}>검색</Button>
            </Col>
            {plusAddress && (

              <Form.Group controlId="formAddress2" className="mt-3">
                  <Row>
                  <Form.Label column sm={3}>추가 주소</Form.Label>
                  <Col sm={6}>
                  <Form.Control
                      type="text"
                      name="address2"
                      value={form.address2}
                      onChange={handleChange}
                      placeholder="추가주소를 입력해주세요."
                  />
                  </Col>
                  </Row>
              </Form.Group>
            )}
        </Form.Group>
          <Button onClick={handleSubmit}>가입완료</Button>
        </Form>
      </Row>
    </Container>
  );
}

export default SignUpForKakao;