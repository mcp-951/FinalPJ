import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import ApiService from '../../../ApiService';
import '../../../../resource/css/product/EmergencyWithdrawal.css';

function EmergencyWithdrawal() {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedAccount = location.state?.account;
    const [accountNumber, setAccountNumber] = useState(selectedAccount ? selectedAccount.accountNumber : '');
    const [accountBalance, setAccountBalance] = useState(selectedAccount ? selectedAccount.accountBalance : 0);
    const [bank, setBank] = useState('');
    const [amount, setAmount] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [amountError, setAmountError] = useState('');
    const [errorMessages, setErrorMessages] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login');
        } else {
            fetchUserAccounts(); // 사용자 계좌 목록 가져오기
        }
    }, [navigate]);

    // 사용자 계좌 목록 가져오기
    const fetchUserAccounts = () => {
        ApiService.getUserAccounts()
        .then((response) => {
            console.log("계좌 정보:", response.data);
            const filteredAccounts = response.data.filter(account => {
                return account.depositName && account.depositName.includes('입출금');
            });
            setAccounts(filteredAccounts);
        })
        .catch((error) => {
            console.error('계좌 정보를 불러오는 중 오류 발생:', error);
            setErrorMessages((prevState) => ({
                ...prevState,
                fetchError: '계좌 정보를 불러오는 중 오류가 발생했습니다.',
            }));
        });
    };

    // 금액 입력 시 천 단위 콤마 추가 및 잔액 체크
    const handleAmountChange = (e) => {
        const rawValue = e.target.value.replace(/,/g, '');
        const numericValue = parseInt(rawValue) || 0;

        if (numericValue > accountBalance) {
            setAmountError('이체 금액이 잔액보다 많습니다.');
        } else {
            setAmountError('');
        }

        const formattedValue = numericValue.toLocaleString();
        setAmount(formattedValue);
    };

    // 비밀번호 확인 함수
    const handlePasswordCheck = async () => {
        try {
            const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
            const response = await ApiService.checkPassword(token, accountNumber, password); // 토큰 포함해서 호출

            // 서버 응답 데이터 확인
            if (response.status === 200 && response.data === true) {
                setPasswordError('비밀번호가 확인되었습니다.');
            } else {
                setPasswordError('비밀번호가 일치하지 않습니다.');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setPasswordError('비밀번호가 일치하지 않습니다.');
            } else {
                setPasswordError('비밀번호 확인 중 오류가 발생했습니다.');
            }
        }
    };

    // 긴급 출금 요청 처리
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const numericAmount = parseInt(amount.replace(/,/g, ''));
        if (numericAmount > accountBalance) {
            alert('이체 금액이 잔액보다 많습니다. 다시 확인해주세요.');
            return;
        }

        const withdrawData = {
            accountNumber: accountNumber,
            targetAccountNumber: bank,
            amount: numericAmount,
        };
        try {
            const response = await ApiService.emergencyWithdraw(withdrawData, token);
            if (response.status === 200 && response.data.includes("ok")) {
                alert("긴급 출금 요청이 성공적으로 처리되었습니다.");
                navigate('/DepositSearch');
            } else {
                alert("긴급 출금 요청 처리 중 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error("긴급 출금 요청 처리 오류:", error);
            alert("긴급 출금 요청 처리 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="emergency-withdrawal-container">
            <h2>긴급 출금</h2>
            <form onSubmit={handleSubmit} className="emergency-withdrawal-form">
                <div className="form-group">
                    <label htmlFor="accountNumber">예적금 계좌번호</label>
                    <input
                        type="text"
                        id="accountNumber"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        required
                        readOnly
                    />
                </div>

                <div className="form-group">
                    <label>잔액:</label>
                    <span>{accountBalance.toLocaleString()} 원</span>
                </div>

                <div className="form-group">
                    <label htmlFor="bank">입금할 계좌</label>
                    <select
                        id="bank"
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                        required
                    >
                        <option value="">계좌 선택</option>
                        {accounts.map(account => (
                            <option key={account.accountNo} value={account.accountNumber}>
                                {account.accountNumber} - {account.depositName ? account.depositName : "기타 예금"}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="amount">이체 금액</label>
                    <input
                        type="text"
                        id="amount"
                        value={amount}
                        onChange={handleAmountChange}
                        required
                    />
                    {amountError && <p className="amount-error">{amountError}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">예적금 비밀번호 확인</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        maxLength={4}
                    />
                    <button type="button" onClick={handlePasswordCheck}>확인</button>
                    {passwordError && <p className="password-error">{passwordError}</p>}
                </div>

                <button type="submit" className="submit-btn">긴급 출금 요청</button>
            </form>
        </div>
    );
}

export default EmergencyWithdrawal;