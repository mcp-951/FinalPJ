import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../resource/css/exchange/Exchange.css';
import Footer from '../../util/Footer';
import { jwtDecode } from 'jwt-decode';

const Exchange = () => {
    const token = localStorage.getItem("token");
    const [branches, setBranches] = useState([]);
    const [accountNumbers, setAccountNumbers] = useState([]);  // 계좌 번호 리스트
    const [selectedAccountNumber, setSelectedAccountNumber] = useState('');  // 선택된 계좌 번호
    const [accountNo, setAccountNo] = useState(null);  // 백엔드에서 가져올 accountNo
    const [selectedAccountBalance, setSelectedAccountBalance] = useState(0);  // 선택한 계좌의 잔액
    const [currency, setCurrency] = useState('');
    const [amount, setAmount] = useState('');  // 환전 금액
    const [rate, setRate] = useState(0);
    const [requiredWon, setRequiredWon] = useState(0);
    const [date, setDate] = useState('');  // 수령일
    const [branch, setBranch] = useState('');  // 선택된 지점
    const [password, setPassword] = useState('');
    const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
    const [userNo, setUserNo] = useState(null);
    const passwordInputRef = useRef(null);
    const navigate = useNavigate();

    // JWT 토큰 디코딩해서 username 가져오기
    const decoded = token ? jwtDecode(token) : null;
    const userId = decoded ? decoded.username : null;

    useEffect(() => {
        if (!token || token === null) {
            alert("로그인이 필요합니다.");
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                // 토큰 값으로 userNo 추출
                const userNoResponse = await axios.get(`http://13.125.114.85:8081/exchange/list/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                const userNo = userNoResponse.data;
                setUserNo(userNo);
                console.log("UserNo:", userNo);
    
                // userNo로 예금 계좌 목록 가져오기
                const accountsResponse = await axios.get(`http://13.125.114.85:8081/exchange/users/${userNo}/accounts/category-one`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
    
                // 상태 코드가 NO_CONTENT(204)일 때 계좌 없음 처리
                if (accountsResponse.status === 204) {
                    alert("신청할 수 있는 계좌가 필요합니다.");
                    navigate('/exchange-rate');  // 메인 페이지로 이동
                    return;
                }
    
                // 백엔드에서 반환된 계좌 목록을 상태에 저장
                const accountData = accountsResponse.data.accounts;
                setAccountNumbers(accountData);
                console.log("Accounts (depositCategory 1):", accountData);
            } catch (error) {
                console.error("계좌 정보를 가져오는 중 오류 발생:", error);
                alert("계좌 정보를 가져오는 중 오류가 발생했습니다.");
            }
    
            try {
                const branchesResponse = await axios.get(`http://13.125.114.85:8081/exchange/pickup-places`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setBranches(branchesResponse.data);
                console.log("Branches:", branchesResponse.data);
            } catch (error) {
                console.error("지점 정보를 가져오는 중 오류 발생:", error);
            }
        };
    
        fetchUserData();
    }, [token, userId, navigate]);

    // 계좌 선택 시 해당 accountNo와 잔액 가져오기
    const handleSelectedAccountNumber = async (event) => {
        const selectedAccountNumber = event.target.value;
        setSelectedAccountNumber(selectedAccountNumber);

        try {
            const response = await axios.get(`http://13.125.114.85:8081/exchange/get-account-info/${selectedAccountNumber}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAccountNo(response.data.accountNo);  // accountNo는 그대로 전송에 사용
            setSelectedAccountBalance(response.data.accountBalance);  // 잔액 설정 (UI용)
            console.log("가져온 accountNo와 잔액:", response.data);
        } catch (error) {
            console.error("계좌 번호를 가져오는 중 오류 발생:", error);
            alert("계좌 번호를 가져오는 데 실패했습니다.");
        }
    };

    // 통화 환율 계산
    useEffect(() => {
        if (currency && amount > 0) {
            axios.get(`https://api.exchangerate-api.com/v4/latest/${currency}`)
                .then(response => {
                    setRate(response.data.rates.KRW);
                    const calculatedWon = amount * response.data.rates.KRW;
                    setRequiredWon(calculatedWon);
                    console.log("환율:", response.data.rates.KRW);
                    console.log("필요 원화:", calculatedWon);
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
            const response = await axios.post(
                `http://13.125.114.85:8081/exchange/verify-password/${selectedAccountNumber}/${password}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (response.data === 1) {
                alert("비밀번호가 일치합니다");
                setIsPasswordConfirmed(true);  // 비밀번호 일치 시 상태 변경
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

    // 수령일 유효성 검사
    const validateReceiveDate = () => {
        const today = new Date().toISOString().split('T')[0];  // 오늘 날짜 (YYYY-MM-DD)
        if (date < today) {
            alert('지난 날짜는 선택할 수 없습니다.');
            return false;
        }
        return true;
    };

    // 환전 금액 유효성 검사
    const validateAmount = () => {
        if (amount <= 0) {
            alert('0원 이하는 환전신청이 불가능합니다.');
            return false;
        }
        if (requiredWon > selectedAccountBalance) {
            alert('계좌 잔액보다 많은 금액은 신청할 수 없습니다.');
            return false;
        }
        return true;
    };

    // 환전 신청 처리
    const handleSubmit = () => {
        if (!isPasswordConfirmed) {
            alert('비밀번호를 확인하세요.');
            return;
        }

        // 수령일 유효성 검사
        if (!validateReceiveDate()) {
            return;
        }

        // 환전 금액 유효성 검사
        if (!validateAmount()) {
            return;
        }

        if (!currency || !amount || !date || !branch || !selectedAccountNumber || !accountNo) {
            alert('모든 항목을 입력해주세요.');
            return;
        }

        // 수령 지점이 선택되었는지 확인
        if (!branch) {
            alert('수령 지점을 선택하세요.');
            return;
        }

        // 전송할 데이터를 콘솔에 먼저 출력하여 확인 (기존 구조 유지)
        const exchangeDetails = {
            userNo,
            accountNo,  // accountNo만 전송, 잔액은 전송하지 않음
            selectCountry: currency,
            exchangeRate: rate,
            tradeDate: new Date().toISOString().split('T')[0],
            pickupPlace: branch,  
            tradePrice: requiredWon,
            tradeAmount: amount,
            receiveDate: date
        };

        console.log("전송할 데이터:", exchangeDetails);  // 전송할 데이터 확인

        const confirmResult = window.confirm('환전 하시겠습니까?');
        if (confirmResult) {
            axios.post('http://13.125.114.85:8081/exchange/submit-exchange', exchangeDetails, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                if (response.status === 200) {
                    navigate('/exchange-result', {
                        state: {
                            message: `${date}에 ${branch}에 방문 해주세요.`,
                            branch
                        }
                    });
                } else {
                    alert('환전 신청에 실패했습니다.');
                }
            })
            .catch(error => {
                console.error('환전 신청 중 오류 발생:', error);
                if (error.response) {
                    console.log('서버 응답 데이터:', error.response.data);  // 구체적인 오류 메시지 확인
                    console.log('서버 응답 상태 코드:', error.response.status);
                    console.log('서버 응답 헤더:', error.response.headers);
                }
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
                    <input className="ex" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
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
                    <select className="ex" value={branch} onChange={(e) => {
                        setBranch(e.target.value);  // branch 값 설정
                        console.log("선택한 지점:", e.target.value);  // 선택된 지점 값 콘솔에 출력
                    }}>
                        <option value="">지점을 선택하세요</option>
                        {branches.map((branch, index) => (
                            <option key={index} value={branch.pickupPlaceName}>
                                {branch.pickupPlaceName}
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
                                {account.accountNumber} - 잔액: {account.accountBalance}원
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
                            disabled={isPasswordConfirmed}  // 비밀번호가 확인되면 비활성화
                        />
                        <button className='password-button' onClick={PwdSubmit} disabled={isPasswordConfirmed}>
                            {isPasswordConfirmed ? '확인 완료' : '확인'}
                        </button>
                    </div>
                </div>
            </div>
            <button className='OkBtn' onClick={handleSubmit} style={{ marginTop: '20px' }}>환전 신청</button>
            
        </div>
    );
};

export default Exchange;
