import React, { useEffect, useState } from "react";
import LoanProduct from "./LoanProduct";
import '../../../resource/css/loan/LoanMain.css';
import axios from "axios";

function LoanMain() {
    const [loanData, setLoanData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
    const [itemsPerPage] = useState(5); // 한 페이지에 표시할 항목 수

    useEffect(() => {
        const fetchLoanProduct = async () => {
            try {
                const response = await axios.get('http://localhost:8081/loan/list');
                const data = response.data;
                setLoanData(data);
            } catch (error) {
                console.log("값을 못가져 왔음", error);
            }
        }
        fetchLoanProduct();
    }, []);

    // 현재 페이지에 맞는 데이터 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLoanData = loanData.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지 변경 핸들러
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // 페이지 숫자 목록 만들기
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(loanData.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="LoanMainContainer">
            {/* 상단에 "URAM 대출 상품" 문구 추가 */}
            <h1 className="LoanMainTitle">⊙ URAM 대출 상품 ⊙</h1>

            <ul className="LoanMain-list">
                {currentLoanData.map((loanProduct) => (
                    <li key={loanProduct.loanProductNo} className="LoanMain-item">
                        <LoanProduct 
                            loanProductNo={loanProduct.loanProductNo}
                            loanProductTitle={loanProduct.loanProductTitle}
                            loanMaxLimit={loanProduct.loanMaxLimit}
                            loanMinLimit={loanProduct.loanMinLimit}
                            loanMaxTern={loanProduct.loanMaxTern}
                            loanMinTern={loanProduct.loanMinTern}
                            minInterestRate={loanProduct.minInterestRate}
                            maxInterestRate={loanProduct.maxInterestRate}
                            earlyRepaymentFee={loanProduct.earlyRepaymentFee}
                            minCreditScore={loanProduct.minCreditScore}
                            viewPoint={loanProduct.viewPoint}
                        />
                    </li>
                ))}
            </ul>

            {/* 페이지 번호 목록 */}
            <div className="LoanMainPagination">
                {pageNumbers.map((number) => (
                    <button 
                        key={number} 
                        onClick={() => paginate(number)} 
                        className={`LoanMainPaginationButton ${currentPage === number ? 'active' : ''}`}
                    >
                        {number}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default LoanMain;


