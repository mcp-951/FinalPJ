import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../resource/css/exchange/Exchange.css'; // CSS 파일 추가
import Footer from '../../util/Footer';

const Exchange = () => {
    const [currency, setCurrency] = useState('');
    const [amount, setAmount] = useState('');
    const [rate, setRate] = useState(0);
    const [requiredWon, setRequiredWon] = useState(0);
    const [date, setDate] = useState('');
    const [branch, setBranch] = useState('');
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const passwordInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (currency) {
            // 환율 정보 API 호출
            fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`)
                .then(response => response.json())
                .then(data => {
                    setRate(data.rates.KRW);
                });
        }
    }, [currency]);

    const handleSubmit = () => {
        if (!currency) {
            alert('통화 종류를 입력해주세요.');
            return;
        }
        if (!amount) {
            alert('환전 금액을 입력해주세요.');
            return;
        }
        if (!date) {
            alert('수령일을 입력해주세요.');
            return;
        }
        if (!branch) {
            alert('수령 지점을 입력해주세요.');
            return;
        }
        if (!account) {
            alert('출금 계좌를 입력해주세요.');
            return;
        }
        if (!password) {
            alert('비밀번호를 입력해주세요.');
            return;
        }
        if (password === '12345') {
            alert(`${date}에 ${branch}에 방문 해주세요.`);
            navigate('/exchange-rate');
        } else {
            alert('비밀번호 불일치');
            passwordInputRef.current.focus();
        }
    };

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
    };

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
        setRequiredWon(e.target.value * rate);
    };

    return (
        <div className="exchange-container">
            <h2>환전 신청</h2>
            <div className="exchange-row" style={{ marginTop: '50px' }}>
                <div className="exchange-column">
                    <label>통화 종류</label>
                    <select value={currency} onChange={handleCurrencyChange}>
                        <option value="">선택하세요</option>
                        <option value="USD">미국 (USD)</option>
                        <option value="JPY">일본 (JPY)</option>
                        <option value="CNY">중국 (CNY)</option>
                        <option value="EUR">유로 (EUR)</option>
                    </select>
                </div>
                <div className="exchange-column">
                    <label>환전 금액</label>
                    <input type="number" value={amount} onChange={handleAmountChange} />
                </div>
                <div className="exchange-column">
                    <label>현재 환율</label>
                    <input type="text" value={rate} readOnly />
                </div>
                <div className="exchange-column">
                    <label>필요 원화</label>
                    <input type="text" value={requiredWon} readOnly />
                </div>
            </div>
            <div className="exchange-row" style={{ marginTop: '50px' }}>
                <div className="exchange-column-vertical">
                    <label>수령일</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    <label style={{ marginTop: '20px' }}>수령 지점</label>
                    <select value={branch} onChange={(e) => setBranch(e.target.value)}>
                        <option value="">지점 선택</option>
                        <option value="마포점">마포점</option>
                        <option value="여의도점">여의도점</option>
                        <option value="홍대점">홍대점</option>
                    </select>
                </div>
                <div className="exchange-column-vertical">
                    <label>출금 계좌</label>
                    <select value={account} onChange={(e) => setAccount(e.target.value)}>
                        <option value="">계좌 선택</option>
                        <option value="계좌1">계좌1</option>
                        <option value="계좌2">계좌2</option>
                        <option value="계좌3">계좌3</option>
                        <option value="계좌4">계좌4</option>
                        <option value="계좌5">계좌5</option>
                    </select>
                    <label style={{ marginTop: '20px' }}>비밀번호</label>
                    <div className="password-container">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="password-input"
                            ref={passwordInputRef}
                        />
                    </div>
                </div>
            </div>
            <button onClick={handleSubmit} style={{ marginBottom: '50px' }}>신청</button>
            
            <Footer />
        </div>
    );
};

export default Exchange;