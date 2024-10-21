import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../../ApiService'; // ApiService 가져오기
import '../../../../resource/css/product/DepositSearch.css';

const DepositSearch = () => {
    const [accounts, setAccounts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccounts = async () => {
            const token = localStorage.getItem('token');
            
            // 토큰이 없으면 로그인 페이지로 리디렉션
            if (!token) {
                alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
                navigate('/login');
                return;
            }

            try {
                const response = await ApiService.getUsersDeposit(); // 계좌 정보 가져오는 ApiService 호출
                console.log('API 응답 데이터:', response.data);

                // 가운데가 "01" 또는 "02"인 계좌만 필터링하고, 상품명에 "입출금"이 포함되지 않은 계좌만
                const filteredAccounts = response.data.filter(account => {
                    const accountParts = account.accountNumber.split('-');
                    return (
                        (accountParts[1] === '01' || accountParts[1] === '02') &&
                        !(account.deposit && account.depositName.includes('입출금'))
                    );
                });

                setAccounts(filteredAccounts);
            } catch (error) {
                console.error('사용자 계좌 정보 조회 오류:', error);
            }
        };

        fetchAccounts();
    }, []);

    // 긴급출금 페이지로 이동하는 함수
    const goToEmergencyWithdrawal = (account) => {
        // withdrawal 값 확인
        if (account.withdrawal === 'Y') {
            navigate('/EmergencyWithdrawal', { state: { account } });
        } else {
            alert('긴급 출금을 이미 사용하셨습니다.');
        }
    };

    return (
        <div className="container">
            <table className="table">
                <thead>
                    <tr>
                        <th>계좌종류</th>
                        <th>계좌정보</th>
                        <th>등록구분</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((account, index) => (
                        <tr key={index}>
                            <td className="account-type">
                                {account.depositCategory ? (account.depositCategory === 1 ? '예금' : '적금') : '알 수 없음'}
                            </td>
                            <td className="account-info">
                                <span>{account.depositName ? account.depositName : '상품 정보 없음'}</span>
                                <span>{account.accountNumber}</span>
                                <span className="account-balance">잔액 {account.accountBalance.toLocaleString()}원</span>
                            </td>
                            <td>
                                <button 
                                    className="register-btn" 
                                    onClick={() => goToEmergencyWithdrawal(account)}
                                >
                                    긴급출금
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DepositSearch;
