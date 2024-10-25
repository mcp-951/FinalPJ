import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar'; // 사이드바
import { Chart } from 'react-google-charts'; // 구글 차트 사용
import '../../../../resource/css/admin/AdFinancialProduct.css'; // CSS 추가

const AdFinancialProduct = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]); // 상품 리스트 관리
    const [filterState, setFilterState] = useState('Y'); // 필터 상태: 'Y' (판매 중), 'N' (판매 중지)
    const [filteredProducts, setFilteredProducts] = useState([]); // 필터링된 상품 리스트 관리
    const [chartData, setChartData] = useState([
        ['상품 유형', '갯수'],
        ['예금', 0],
        ['적금', 0],
        ['대출', 0],
    ]); // 기본 차트 데이터 형식 설정
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const [displayCount, setDisplayCount] = useState(3);  // 페이지당 표시할 상품 수 관리
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 관리
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 관리
    const [searchField, setSearchField] = useState('전체'); // 검색 필드 상태 관리
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 관리
    const token = localStorage.getItem("token");

    // 필터 상태에 따른 금융 상품 조회 API 호출
    const fetchProducts = (state) => {
        axios.get(`http://localhost:8081/admin/financial-products?state=${state}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then((response) => {
            setProducts(response.data); // 상품 리스트 설정

            // 예금 상품과 대출 상품을 필터링하여 상태에 맞는 상품 리스트 설정
            const filtered = response.data.filter(product => {
                if (product.loanProductTitle) {
                    return product.viewPoint === state; // 대출 상품의 상태
                } else if (product.depositName) {
                    return product.depositState === state; // 예금 상품의 상태
                }
                return false; // 상품이 대출이나 예금이 아닐 경우 제외
            });
            setFilteredProducts(filtered); // 필터링된 상품 리스트 설정
        })
        .catch((error) => {
            console.error('금융 상품 목록을 불러오는 중 오류 발생:', error);
        });
    };

    // 차트 데이터 API 호출
    const fetchChartData = () => {
        axios.get('http://localhost:8081/admin/product-counts', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then((response) => {
            const chartDataArray = [
                ['상품 유형', '갯수'],
                ['예금', response.data.Deposits || 0],
                ['적금', response.data.Savings || 0],
                ['대출', response.data.Loans || 0],
            ];
            setChartData(chartDataArray); // 변환된 데이터 설정
            setLoading(false); // 로딩 완료 시 로딩 상태 false로 변경
        })
        .catch((error) => {
            console.error('차트 데이터를 불러오는 중 오류 발생:', error);
            setLoading(false); // 오류 발생 시에도 로딩 상태 false로 변경
        });
    };

    useEffect(() => {
        fetchProducts(filterState); // 페이지 로드시 필터 상태에 맞는 상품 데이터 호출
        fetchChartData(); // 차트 데이터 호출
    }, [filterState, token]);

    // 검색 및 필터링 로직
    const filteredList = filteredProducts.filter(product => {
        const lowerSearchTerm = searchTerm.toLowerCase();
    
        // 전체 검색일 경우 각 필드를 모두 확인
        if (searchField === '전체') {
            return (
                product.depositName?.toLowerCase().includes(lowerSearchTerm) ||
                product.loanProductTitle?.toLowerCase().includes(lowerSearchTerm) ||
                (product.depositCategory === 1 && '예금'.includes(lowerSearchTerm)) ||
                (product.depositCategory === 2 && '적금'.includes(lowerSearchTerm)) ||
                (product.loanProductTitle && '대출'.includes(lowerSearchTerm))
            );
        }
    
        // 특정 필드 검색
        switch (searchField) {
            case '상품명':
                return product.depositName?.toLowerCase().includes(lowerSearchTerm) || product.loanProductTitle?.toLowerCase().includes(lowerSearchTerm);
            case '상품 종류':
                // 상품 종류에서 예금/적금/대출을 구분하는 로직
                if (lowerSearchTerm === '예금') {
                    return product.depositCategory === 1; // 예금인 경우
                } else if (lowerSearchTerm === '적금') {
                    return product.depositCategory === 2; // 적금인 경우
                } else if (lowerSearchTerm === '대출') {
                    return product.loanProductTitle !== undefined; // 대출인 경우
                }
                return false; // 일치하는 항목이 없으면 false 반환
            default:
                return true; // 전체일 경우 필터링하지 않음
        }
    });

    // 현재 페이지에 따른 데이터 추출
    const startIndex = (currentPage - 1) * displayCount;
    const endIndex = startIndex + displayCount;
    const paginatedList = filteredList.slice(startIndex, endIndex);

    // 페이지 수 계산
    useEffect(() => {
        setTotalPages(Math.ceil(filteredList.length / displayCount));
    }, [displayCount, filteredList]);

    // 페이지 이동 처리
    const handlePageChange = (pageNum) => {
        if (pageNum > 0 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
        }
    };

    // 페이지 번호 범위를 설정하는 함수
    const getPageNumbers = () => {
        const maxVisiblePages = 5; // 한 번에 표시할 페이지 버튼 수
        let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let end = Math.min(totalPages, start + maxVisiblePages - 1);
        start = Math.max(1, end - maxVisiblePages + 1);

        return Array.from({ length: end - start + 1 }, (_, index) => start + index);
    };

    const handleSavingsRegister = () => {
        navigate('/admin/adRegisterProduct'); // 예/적금 등록 페이지로 이동
    };

    const handleLoanRegister = () => {
        navigate('/admin/adRegisterLoanProduct'); // 대출 등록 페이지로 이동
    };

    const handleEdit = (product) => {
        if (product.loanProductTitle && product.loanProductNo) {
            navigate("/admin/adEditLoanProduct", { state: { loan: product } });
        } else if (product.depositName) {
            navigate("/admin/adEditSavingsProduct", { state: { deposit: product } });
        } else {
            alert("유효하지 않은 상품입니다.");
        }
    };

    const handleDelete = async (product) => {
        try {
            if (product.loanProductTitle && product.loanProductNo) {
                await axios.put(`http://localhost:8081/admin/deleteLoan/${product.loanProductNo}`, { loanState: 'Closed' }, {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                });
                alert('해당 대출 상품이 삭제되었습니다.');
            } else if (product.depositName) {
                await axios.put(`http://localhost:8081/admin/deleteSavings/${product.depositNo}`, null, {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                });
                alert('해당 예금 상품이 삭제되었습니다.');
            } else {
                alert("유효하지 않은 상품입니다.");
            }
            fetchProducts(filterState);
        } catch (error) {
            alert('삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const toggleFilterState = () => {
        const newFilterState = filterState === 'Y' ? 'N' : 'Y'; // Y와 N 사이에서만 필터 전환
        setFilterState(newFilterState);
        fetchProducts(newFilterState); // 필터 상태에 맞는 상품 데이터 호출
    };

    return (
        <div className="AdFinancialProduct-container">
            <Sidebar />
            <div className="Adfinancial-main-content">
                <h2>금융 상품 관리</h2>
                <div className="AdFinancialProduct-chart-container">
                    <Chart
                        chartType="PieChart"
                        data={chartData}
                        options={{ title: '금일 가입량' }}
                        width={'100%'}
                        height={'400px'}
                    />
                </div>
                <div className="AdFinancialProduct-button-container">
                    <button onClick={handleSavingsRegister}>예/적금 등록</button>
                    <button onClick={handleLoanRegister}>대출 등록</button>
                    <button onClick={toggleFilterState}>
                        {filterState === 'Y' ? '판매 중지된 상품 보기' : '판매 중인 상품 보기'}
                    </button>
                </div>

                <div className="AdFinancialProduct-search-controls">
                    <select 
                        className="AdFinancialProduct-select" // select 박스에 CSS 클래스 추가
                        value={searchField} 
                        onChange={(e) => setSearchField(e.target.value)}
                    >
                        <option value="전체">전체</option>
                        <option value="상품명">상품명</option>
                        <option value="상품 종류">상품 종류</option>
                    </select>
                    <input
                        className="AdFinancialProduct-input" // input 박스에 CSS 클래스 추가
                        type="text"
                        placeholder="검색어를 입력하세요."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                
                <div className="AdFinancialProduct-pagination-controls">
                    <label>페이지당 항목 수: </label>
                    <select value={displayCount} onChange={(e) => setDisplayCount(Number(e.target.value))}>
                        <option value={3}>3</option>
                        <option value={5}>5</option>
                        <option value={7}>7</option>
                    </select>
                </div>

                <table className="AdFinancialProduct-table">
                    <thead>
                        <tr>
                            <th>노출순서</th>
                            <th>상품명</th>
                            <th>상품 종류</th>
                            <th>최소/최대 금리</th>
                            <th>최소/최대 금액</th>
                            <th>최소/최대 기간</th>
                            <th>상품 특성</th>
                            <th>상품 설명</th>
                            <th>상태</th>
                            {filterState === 'Y' && (
                                <>
                                    <th>수정</th>
                                    <th>삭제</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedList.map((product, index) => (
                            <tr key={product.productNo || index}>
                                <td>{startIndex + index + 1}</td>
                                {product.depositName ? (
                                    <>
                                        <td>{product.depositName}</td>
                                        <td>{product.depositCategory === 1 ? "예금" : "적금"}</td>
                                        <td>{product.depositMinimumRate}% / {product.depositMaximumRate}%</td>
                                        <td>{product.depositMinimumAmount} / {product.depositMaximumAmount}원</td>
                                        <td>{product.depositMinimumDate} / {product.depositMaximumDate}개월</td>
                                        <td>{product.depositCharacteristic}</td>
                                        <td>{product.depositContent}</td>
                                        <td>{product.depositState === 'Y' ? "판매중" : "판매 중지"}</td>
                                    </>
                                ) : (
                                    <>
                                        <td>{product.loanProductTitle}</td>
                                        <td>대출</td>
                                        <td>{product.minInterestRate}% / {product.maxInterestRate}%</td>
                                        <td>{product.loanMinLimit} / {product.loanMaxLimit}원</td>
                                        <td>{product.loanMinTern} / {product.loanMaxTern}개월</td>
                                        <td>-</td>
                                        <td>{product.loanContent}</td>
                                        <td>{product.viewPoint === 'Y' ? "판매중" : "판매 중지"}</td>
                                    </>
                                )}
                                {filterState === 'Y' && (
                                    <>
                                        <td><button onClick={() => handleEdit(product)}>수정</button></td>
                                        <td><button onClick={() => handleDelete(product)}>삭제</button></td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="AdFinancialProduct-pagination">
                    <button disabled={currentPage === 1} onClick={() => handlePageChange(1)}>{'<<'}</button>
                    <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>{'<'}</button>
                    {getPageNumbers().map(pageNum => (
                        <button key={pageNum} className={pageNum === currentPage ? 'active' : ''} onClick={() => handlePageChange(pageNum)}>
                            {pageNum}
                        </button>
                    ))}
                    <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>{'>'}</button>
                    <button disabled={currentPage === totalPages} onClick={() => handlePageChange(totalPages)}>{'>>'}</button>
                </div>
            </div>
        </div>
    );
};

export default AdFinancialProduct;
