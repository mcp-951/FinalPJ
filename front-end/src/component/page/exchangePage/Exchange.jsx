import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../resource/css/exchange/Exchange.css';
import Footer from '../../util/Footer';
import {jwtDecode} from 'jwt-decode'; // default import로 변경

const Exchange = () => {
    const token = localStorage.getItem("token");
    const [branches, setBranches] = useState([]);
    const [accountNumbers, setAccountNumbers] = useState([]);
    const [selectedAccountNumber, setSelectedAccountNumber] = useState('');
    const [currency, setCurrency] = useState('');
    const [amount, setAmount] = useState('');
    const [rate, setRate] = useState(0);
    const [requiredWon, setRequiredWon] = useState(0);
    const [date, setDate] = useState('');
    const [branch, setBranch] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
    const [userNo, setUserNo] = useState(null);
    const passwordInputRef = useRef(null);
    const navigate = useNavigate();

    // 토큰 만료 여부 체크 함수
    const isTokenExpired = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000); // 현재 시간을 초 단위로 변환
            return decodedToken.exp < currentTime; // 토큰의 exp가 현재 시간보다 작으면 만료된 것
        } catch (error) {
            return true; // 토큰 디코딩 중 에러가 발생하면 만료된 것으로 간주
        }
    };

    // 페이지 렌더링 전에 토큰 체크
    useEffect(() => {
        // 토큰이 없거나 잘못된 경우 알러트 창을 띄우고 로그인 페이지로 리다이렉트
        if (!token || token === null) {
            alert("로그인이 필요합니다.");
            navigate('/login'); // 로그인 페이지로 리다이렉트
            return;
        }

        try {
            jwtDecode(token); // 토큰 디코딩 시도
        } catch (error) {
            alert("로그인이 필요합니다.");
            localStorage.removeItem("token"); // 유효하지 않은 토큰 제거
            navigate('/login'); // 로그인 페이지로 리다이렉트
            return;
        }

        // 토큰 만료 체크
        if (isTokenExpired(token)) {
            alert(" 로그인이 필요합니다.");
            localStorage.removeItem("token"); // 만료된 토큰 제거
            navigate('/login'); // 로그인 페이지로 리다이렉트
            return;
        }
    }, [token, navigate]);

    const handleSelectedAccountNumber = (event) => {
        const selectedAccountNumber = event.target.value;
        setSelectedAccountNumber(selectedAccountNumber);
        console.log(selectedAccountNumber);
    };

    // JWT 토큰 디코딩해서 username 가져오기
    const decoded = token ? jwtDecode(token) : null;
    const userId = decoded ? decoded.username : null;

    // 사용자 정보 및 계좌 정보 가져오기
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userNoResponse = await axios.get(`http://localhost:8081/exchange/list/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                const userNo = userNoResponse.data;
                setUserNo(userNo);
                console.log("UserNo:", userNo); // 사용자 번호 확인

                const accountsResponse = await axios.get(`http://localhost:8081/exchange/account/${userNo}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                const accounts = accountsResponse.data;
                console.log("Accounts:", accounts); // 응답 데이터 확인
                setAccountNumbers(accounts);
            } catch (error) {
                console.error("계좌 정보를 가져오는 중 오류 발생:", error);
            }

            try {
                const branchesResponse = await axios.get(`http://localhost:8081/exchange/pickup-places`, {
                    headers: {
                        Authorization: `Bearer ${token}`  // JWT 토큰을 Authorization 헤더에 추가
                    }
                });
                setBranches(branchesResponse.data);
            } catch (error) {
                console.error("지점 정보를 가져오는 중 오류 발생:", error);
            }
        };

        if (token && userId) {
            fetchUserData();
        }
    }, [token, userId]);

    // 통화 종류 변경 시 환율 정보 가져오기
    useEffect(() => {
        if (currency) {
            axios.get(`https://api.exchangerate-api.com/v4/latest/${currency}`)
                .then(response => {
                    setRate(response.data.rates.KRW);
                    setRequiredWon(amount * response.data.rates.KRW);
                })
                .catch(error => {
                    console.error('환율 정보를 가져오는 중 오류 발생:', error);
                });
        }
    }, [currency, amount]);

    // 비밀번호 확인 처리
    const PwdSubmit = async () => {
        if (!selectedAccountNumber) {
            alert("계좌를 선택하세요.");
            return;
        }

        if (!password) {
            alert("비밀번호를 입력하세요.");
            passwordInputRef.current.focus();
            return;
        }

        try {
            // 선택한 계좌 번호와 입력한 비밀번호를 서버로 전송하여 비교
            const response = await axios.post(
                `http://localhost:8081/exchange/verify-password/${selectedAccountNumber}/${password}`,
                null,  // POST 요청에 보낼 데이터가 없으면 null을 전달
                {
                    headers: {
                        Authorization: `Bearer ${token}`  // JWT 토큰을 Authorization 헤더에 추가
                    }
                }
            );
            console.log("가져온 값 : ", response);
            if (response.data === 1) {
                alert("비밀번호가 일치합니다");
                setIsPasswordConfirmed(true);
            } else {
                alert('비밀번호가 일치하지 않습니다.');
                setIsPasswordConfirmed(false);
                passwordInputRef.current.focus();
            }
        } catch (error) {
            console.error('비밀번호 확인 중 오류 발생:', error);
            alert('비밀번호 확인에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    // 환전 신청 처리
    const handleSubmit = () => {
        if (!isPasswordConfirmed) {
            alert('비밀번호를 확인하세요.');
            return;
        }
        if (!currency || !amount || !date || !branch || !selectedAccountNumber) {
            alert('모든 항목을 입력해주세요.');
            return;
        }

        const confirmResult = window.confirm('환전 하시겠습니까?');
        if (confirmResult) {
            const exchangeDetails = {
                userNo,
                accountNo: selectedAccountNumber,
                selectCountry: currency,
                exchangeRate: rate,
                tradeDate: new Date().toISOString().split('T')[0],
                pickupPlace: branch,
                tradePrice: requiredWon,
                tradeAmount: amount,
                receiveDate: date
            };

            axios.post('http://localhost:8081/exchange/submit-exchange', exchangeDetails, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        navigate('/exchange-result', {
                            state: {
                                message: `${date}에 ${branch}에 방문 해주세요.`
                            }
                        });
                    } else {
                        alert('환전 신청에 실패했습니다.');
                    }
                })
                .catch(error => {
                    console.error('환전 신청 중 오류 발생:', error);
                    alert('환전 신청에 실패했습니다.');
                });
        }
    };

    return (
        <div className="exchange-container">
            <h2>환전 신청</h2>
            <div className="exchange-row" style={{ marginTop: '50px' }}>
                <div className="exchange-column">
                    <label className='exlabel'>통화 종류</label>
                    <select className="ex" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                        <option value="">선택하세요</option>
                        <option value="USD">미국 (USD)</option>
                        <option value="JPY">일본 (JPY)</option>
                        <option value="CNY">중국 (CNY)</option>
                        <option value="EUR">유로 (EUR)</option>
                    </select>
                </div>
                <div className="exchange-column">
                    <label className='exlabel'>환전 금액</label>
                    <input className="ex" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div className="exchange-column">
                    <label className='exlabel'>현재 환율</label>
                    <input className="ex" type="text" value={rate} readOnly />
                </div>
                <div className="exchange-column">
                    <label className='exlabel'>필요 원화</label>
                    <input className="ex" type="text" value={requiredWon} readOnly />
                </div>
            </div>
            <div className="exchange-row" style={{ marginTop: '50px' }}>
                <div className="exchange-column-vertical">
                    <label className='exlabel'>수령일</label>
                    <input className="ex" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    <label className='exlabel' style={{ marginTop: '20px' }}>수령 지점</label>
                    <select className="ex" value={branch} onChange={(e) => setBranch(e.target.value)}>
                        <option value="">지점을 선택하세요</option>
                        {branches.map((branch, index) => (
                            <option key={index} value={branch.pickUpPlaceName}>
                                {branch.pickUpPlaceName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="exchange-column-vertical">
                    <label className='exlabel'>출금 계좌</label>
                    <select className="ex" value={selectedAccountNumber} onChange={handleSelectedAccountNumber}>
                        <option value="">계좌를 선택하세요</option>
                        {accountNumbers.map((account, index) => (
                            <option key={index} value={account.accountNumber}>
                                {account.accountNumber}
                            </option>
                        ))}
                    </select>
                    <label className='exlabel' style={{ marginTop: '20px' }}>비밀번호</label>
                    <div className="password-container">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="password-input"
                            ref={passwordInputRef}
                        />
                        <button className='password-button' onClick={PwdSubmit}>확인</button>
                    </div>
                </div>
            </div>
            <button className='OkBtn' onClick={handleSubmit} style={{ marginTop: '20px' }}>환전 신청</button>
            <Footer />
        </div>
    );
};

export default Exchange;
