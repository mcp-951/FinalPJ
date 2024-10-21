import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import ApiService from '../../../ApiService'; // ApiService 가져오기
import axios from 'axios';
import '../../../../resource/css/product/EmergencyWithdrawal.css';

function EmergencyWithdrawal() {
    const location = useLocation(); 
    const navigate = useNavigate(); // useNavigate 추가
    const selectedAccount = location.state?.account;
    const [accountNumber, setAccountNumber] = useState(selectedAccount ? selectedAccount.accountNumber : '');
    const [accountBalance, setAccountBalance] = useState(selectedAccount ? selectedAccount.accountBalance : 0); // 계좌 잔액 추가
    const [bank, setBank] = useState(''); 
    const [amount, setAmount] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(''); 
    const [accounts, setAccounts] = useState([]); // 사용자 계좌 목록 상태 추가
    const [amountError, setAmountError] = useState(''); // 금액 오류 메시지

    useEffect(() => {
        const token = localStorage.getItem('token');
        // 토큰이 없으면 로그인 페이지로 리다이렉트
        if (!token) {
          alert('로그인이 필요합니다.');
          navigate('/login');
        }
      }, [navigate]);
      
    // 사용자 계좌 정보 가져오기 (토큰 필요)
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const token = localStorage.getItem('token'); // 토큰 가져오기
                const response = await axios.get('http://localhost:8081/products/deposits/findAccount', {
                    headers: {
                        'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
                    }
                });
                // 입출금 계좌 필터링
                const filteredAccounts = response.data.filter(account => {
                    return account.deposit && account.deposit.depositName && account.deposit.depositName.includes('입출금');
                });
                setAccounts(filteredAccounts);
            } catch (error) {
                console.error('사용자 계좌 정보 조회 오류:', error);
            }
        };

        fetchAccounts();
    }, []);

    // 금액 입력 시 천 단위 콤마 추가 및 잔액 체크
    const handleAmountChange = (e) => {
        const rawValue = e.target.value.replace(/,/g, '');
        const numericValue = parseInt(rawValue) || 0;

        // 잔액보다 높은 금액인지 체크
        if (numericValue > accountBalance) {
            setAmountError('이체 금액이 잔액보다 많습니다.');
        } else {
            setAmountError('');
        }

        // 천 단위 콤마 추가
        const formattedValue = numericValue.toLocaleString();
        setAmount(formattedValue);
    };

    // 비밀번호 확인 함수
    const handlePasswordCheck = async () => {
        try {
            const response = await axios.post(`http://localhost:8081/uram/account/${accountNumber}/check-password`, {
                userNo: selectedAccount.userNo, // userNo 보내기
                password: password // 입력된 비밀번호 보내기
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // JWT 토큰을 Authorization 헤더에 포함
                },
            });
    
            if (response.status === 200) {
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

        // 금액이 잔액보다 많으면 출금 처리 중지
        const numericAmount = parseInt(amount.replace(/,/g, ''));
        if (numericAmount > accountBalance) {
            alert('이체 금액이 잔액보다 많습니다. 다시 확인해주세요.');
            return;
        }

        // 긴급 출금 데이터 준비
        const withdrawData = {
            accountNumber: accountNumber, // 예적금 계좌번호
            targetAccountNumber: bank, // 입금할 계좌번호
            amount: numericAmount, // 이체 금액
        };
        try {
            const response = await ApiService.emergencyWithdraw(withdrawData, token);
            if (response.status === 200 && response.data.includes("ok")) {
                alert("긴급 출금 요청이 성공적으로 처리되었습니다.");
                navigate('/DepositSearch'); // 출금 완료 후 DepositSearch 페이지로 이동
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
                
                {/* 선택된 계좌의 잔액 표시 */}
                <div className="form-group">
                    <label>잔액:</label>
                    <span>{accountBalance.toLocaleString()} 원</span>
                </div>

                <div className="form-group">
                    <label htmlFor="bank">입금할 은행</label>
                    <select 
                        id="bank" 
                        value={bank} 
                        onChange={(e) => setBank(e.target.value)} 
                        required
                    >
                        <option value="">계좌 선택</option>
                        {accounts.map(account => (
                            <option key={account.accountNo} value={account.accountNumber}>
                                {account.accountNumber}
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
