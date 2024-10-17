import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../resource/css/product/LoanMain.css';

const LoanMain = () => {
    const [loan, setLoan] = useState(null);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // sessionStorage에서 선택된 대출 상품 정보 가져오기
        const storedLoan = sessionStorage.getItem('selectedLoan'); // selectedProduct -> selectedLoan으로 변경
        if (storedLoan) {
            setLoan(JSON.parse(storedLoan));
        }

        // localStorage에서 JWT 토큰 가져오기
        const storedToken = localStorage.getItem('token');
        setToken(storedToken); // 토큰을 상태로 저장
    }, []);

    const handleJoinClick = () => {
        if (token) {
            // JWT 토큰이 있는 경우, sessionStorage에 필요한 정보 저장 후 다음 페이지로 이동
            // 세션에 상품 정보 저장
            sessionStorage.setItem(
                'selectedLoan',
                JSON.stringify({ 
                    loanName: loan.loanName, 
                    loanContent: loan.loanContent, 
                    loanRate: loan.loanRate, 
                    loanState: loan.loanState, 
                    loanNo: loan.loanNo
                })
            );

            // 토큰과 함께 다음 페이지로 이동
            navigate(`/Loanchap1`);
        } else {
            // JWT 토큰이 없는 경우, 알림창 표시
            alert("로그인하세요.");
        }
    };

    if (!loan) {
        return <div>대출 상품 정보가 없습니다.</div>;
    }

    return (
        <div className="loan-main">
            <h1>{loan.loanName}</h1> {/* loanName으로 변경 */}
            <p>{loan.loanContent}</p> {/* loanContent으로 변경 */}
            <strong>연 {loan.loanRate}%</strong> {/* loanRate으로 변경 */}
            <br />
            <button className="join-button" onClick={handleJoinClick}>가입하기</button>
        </div>
    );
};

export default LoanMain;
