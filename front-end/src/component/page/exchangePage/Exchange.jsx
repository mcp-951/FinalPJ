import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../resource/css/exchange/Exchange.css';
import Footer from '../../util/Footer';

const Exchange = ({ user }) => {
    const [branches, setBranches] = useState([]);
    const [accountNumber, setAccountNumber] = useState('');
    const [currency, setCurrency] = useState('');
    const [amount, setAmount] = useState('');
    const [rate, setRate] = useState(0);
    const [requiredWon, setRequiredWon] = useState(0);
    const [date, setDate] = useState('');
    const [branch, setBranch] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
    const passwordInputRef = useRef(null);
    const navigate = useNavigate();

    // 로그인된 사용자 정보 확인 및 데이터 가져오기
    useEffect(() => {
        if (!user || !user.userId) {
            alert("로그인이 필요합니다.");
        }

        // 로그인된 사용자가 있으면 데이터 가져오기
        if (user && user.userId) {
            // userId로 userNo 가져오기
            axios.get(`/api/exchange/user-no?userId=${user.userId}`)
                .then(response => {
                    const userNo = response.data;

                    // userNo로 accountNo 가져오기
                    return axios.get(`/api/exchange/account-no?userNo=${userNo}`);
                })
                .then(response => {
                    const accountNo = response.data;

                    // accountNo로 accountNumber 가져오기
                    return axios.get(`/api/exchange/account-number?accountNo=${accountNo}`);
                })
                .then(response => {
                    setAccountNumber(response.data);
                })
                .catch(error => {
                    console.error("계좌 정보를 가져오는 중 오류 발생:", error);
                });
        }

        // 지점 정보 가져오기 (로그인 여부와 상관없이 가능)
        axios.get(`/api/exchange/pickup-places`)
            .then(response => {
                setBranches(response.data);
            })
            .catch(error => {
                console.error("지점 정보를 가져오는 중 오류 발생:", error);
            });
    }, [user]);

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
    const PwdSubmit = () => {
        if (!user || !user.userId) {
            alert("로그인이 필요합니다.");
            return;
        }

        axios.post('/api/exchange/verify-password', null, {
            params: { userId: user.userId, inputPassword: password }
        })
        .then(response => {
            if (response.data) {
                alert("비밀번호가 일치합니다");
                setIsPasswordConfirmed(true);
            } else {
                alert('비밀번호 불일치');
                passwordInputRef.current.focus();
            }
        })
        .catch(error => {
            console.error('비밀번호 확인 중 오류 발생:', error);
            alert('비밀번호 확인에 실패했습니다.');
        });
    };

    // 환전 신청 처리
    const handleSubmit = () => {
        if (!isPasswordConfirmed) {
            alert('비밀번호를 확인하세요.');
            return;
        }
        if (!currency || !amount || !date || !branch || !accountNumber) {
            alert('모든 항목을 입력해주세요.');
            return;
        }

        const confirmResult = window.confirm('환전 하시겠습니까?');
        if (confirmResult) {
            const exchangeDetails = {
                userNo: user.userNo,
                accountNo: accountNumber,
                selectCountry: currency,
                exchangeRate: rate,
                tradeDate: new Date().toISOString().split('T')[0],
                pickupPlace: branch,
                tradePrice: requiredWon,
                tradeAmount: amount,
                receiveDate: date
            };

            axios.post('/exchange', exchangeDetails)
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

    // 통화 종류 변경 핸들러
    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
    };

    // 환전 금액 변경 핸들러
    const handleAmountChange = (e) => {
        setAmount(e.target.value);
        setRequiredWon(e.target.value * rate);
    };

    return (
        <div className="exchange-container">
            <h2>환전 신청</h2>
            <div className="exchange-row" style={{ marginTop: '50px' }}>
                <div className="exchange-column">
                    <label className='exlabel'>통화 종류</label>
                    <select className="ex" value={currency} onChange={handleCurrencyChange}>
                        <option value="">선택하세요</option>
                        <option value="USD">미국 (USD)</option>
                        <option value="JPY">일본 (JPY)</option>
                        <option value="CNY">중국 (CNY)</option>
                        <option value="EUR">유로 (EUR)</option>
                    </select>
                </div>
                <div className="exchange-column">
                    <label className='exlabel'>환전 금액</label>
                    <input className="ex" type="number" value={amount} onChange={handleAmountChange} />
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
                    <input className="ex" type="text" value={accountNumber} readOnly />
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
