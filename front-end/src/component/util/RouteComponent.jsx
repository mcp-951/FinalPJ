import React, { useState } from 'react';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';

// 메인 라우터 임포트
import Main from '../mainPage/Main';

// 로그인 라우터 임포트
import Login from '../page/loginPage/Login';
import Signup from '../page/loginPage/SignUp';


// 투자 라우터 임포트
import InvestmentMain from 'component/page/investment/InvestmentMain';

// 공과금 라우터 임포트
import TaxMain from 'component/page/tax/TaxMain';
import TaxWMain from 'component/page/tax/TaxWMain';

// 어드민 라우터 임포트
import AdminList from '../page/adminPage/admin/AdminList';
import AdminLogin from '../page/adminPage/admin/AdminLogin';
import EditAdmin from '../page/adminPage/admin/EditAdmin';
import MemberList from '../page/adminPage/user/MemberList';
import RetiredMember from '../page/adminPage/user/RetiredMember';
import FinancialProduct from '../page/adminPage/product/FinancialProduct';
import SavingsProduct from '../page/adminPage/product/SavingsProduct';
import DepositProduct from '../page/adminPage/product/DepositProduct';
import LoanProduct from '../page/adminPage/product/LoanProduct';
import TransactionHistory from '../page/adminPage/akkount/TransactionHistory';
import AccountClosure from '../page/adminPage/akkount/AccountClosure';
import CurrencyExchangeHistory from '../page/adminPage/exchange/CurrencyExchangeHistory';
import ExchangePickupLocation from '../page/adminPage/exchange/ExchangePickupLocation';
import MemberEdit from '../page/adminPage/user/MemberEdit';
import EditSavingsProduct from '../page/adminPage/product/EditSavingsProduct';
import EditDepositProduct from '../page/adminPage/product/EditDepositProduct';
import EditLoanProduct from '../page/adminPage/product/EditLoanProduct';
import Sidebar from '../page/adminPage/Sidebar';

// 예금 적금
import DepositMain from '../page/product/DepositMain'; // 예금 상품 메인 페이지
import DepositList from '../page/product/DepositList'; // 예금 상품 리스트 페이지
import SavingMain from '../page/product/SavingMain'; // 적금 상품 메인 페이지
import SavingList from '../page/product/SavingList'; // 적금 상품 리스트 페이지

// 계좌 관련 (채림)
import Account from '../page/account/accountView/Account';
import AccountDetail from '../page/account/accountView/AccountDetail'; 
import PasswordCheck from '../page/account/accountManagement/PasswordCheck'; 
import PasswordChange from '../page/account/accountManagement/PasswordChange'; 
import AccountClose from '../page/account/accountManagement/AccountClose'; 
import LimitInquiry from '../page/account/accountManagement/LimitInquiry'; 
import LimitChange from '../page/account/accountManagement/LimitChange'; 
import AccountTransfer from '../page/account/accountTransfer/AccountTransfer'; 
import AccountTransferConfirmation from '../page/account/accountTransfer/AccountTransferConfirmation'; 
import AccountTransferComplete from '../page/account/accountTransfer/AccountTransferComplete'; 
import AutoTransferRegister from '../page/account/autoTransfer/AutoTransferRegister'; // 자동이체 등록 페이지
import AutoTransferRegister2 from '../page/account/autoTransfer/AutoTransferRegister2'; // 자동이체 등록 2단계 페이지

// 에이스 동명
import ExchangeRate from '../page/exchangePage/ExchangeRate';
import Exchange from '../page/exchangePage/Exchange';
import ExchangeList from '../page/exchangePage/ExchangeList';
import DetailRate from '../page/exchangePage/DetailRate';
import AssetsCal from '../page/assetsPage/AssetsCal';
import AssetsList from '../page/assetsPage/AssetsList';
import AssetsAnalysis from '../page/assetsPage/AssetsAnalysis';

//팝업
import GetAddress from 'component/page/loginPage/GetAddress';


const RouteComponent = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <div>
            <BrowserRouter>
                <div style={style}>
                    <Routes>
                        <Route path="/" exact={true} element={<Main />} />
                        {/*}로그인 페이지{*/}
                        <Route path="/login" exact={true} element={<Login />} />
                        <Route path="/signup" exact={true} element={<Signup />} />
                        {/*}투자 페이지{*/}
                        <Route path="/investment" exact={true} element={<InvestmentMain/>} />
                        {/*}공과금페이지{*/}
                        <Route path="/tax/elec" exact={true} element={<TaxMain/>} />
                        <Route path="/tax/water" exact={true} element={<TaxWMain/>} />
                        
                        {/* 어드민 관리자 */}
                        <Route path="/" element={<Navigate to="/ba" />} />
                        <Route path="/ba" element={<AdminLogin setIsLoggedIn={setIsLoggedIn} />} />
                        {isLoggedIn && (<>
                            <Route path="*" element={<Sidebar />} />
                            <Route path="/adminList" element={<AdminList />} />
                            <Route path="/editAdmin" element={<EditAdmin />} />

                            {/* 사용자 관리 페이지 */}
                            <Route path="/memberList" element={<MemberList />} />
                            <Route path="/retiredMember" element={<RetiredMember />} />
                            <Route path="/editMember" element={<MemberEdit />} />

                            {/* 금융 상품 관리 페이지 */}
                            <Route path="/financialProduct" element={<FinancialProduct />} />
                            <Route path="/savingsProduct" element={<SavingsProduct />} />
                            <Route path="/depositProduct" element={<DepositProduct />} />
                            <Route path="/loanProduct" element={<LoanProduct />} />

                            {/* 금융 상품 수정 페이지 */}
                            <Route path="/editSavingsProduct" element={<EditSavingsProduct />} />
                            <Route path="/editDepositProduct" element={<EditDepositProduct />} />
                            <Route path="/editLoanProduct" element={<EditLoanProduct />} />

                            {/* 거래 내역 및 계좌 관리 페이지 */}
                            <Route path="/transactionHistory" element={<TransactionHistory />} />
                            <Route path="/accountClosure" element={<AccountClosure />} />

                            {/* 외환 거래 관리 페이지 */}
                            <Route path="/exchangeHistory" element={<CurrencyExchangeHistory />} />
                            <Route path="/exchangeLocation" element={<ExchangePickupLocation />} />
                        </>)}
                        {/* 로그인하지 않았을 때는 관리자 로그인 페이지로 리다이렉트 */}
                        {/*<Route path="*" element={<Navigate to="/ba" />} />*/}

                        {/*상품 라우터_민우님*/}
                        {/* 예금 상품 관련 라우터 추가 */}
                        <Route path="/DepositMain" exact={true} element={<DepositMain />} /> {/* 예금 메인 페이지 */}
                        <Route path="/deposit-list" exact={true} element={<DepositList />} /> {/* 예금 리스트 페이지 */}

                        {/* 적금 상품 관련 라우터 추가 */}
                        <Route path="/SavingMain" exact={true} element={<SavingMain />} /> {/* 적금 메인 페이지 */}
                        <Route path="/saving-list" exact={true} element={<SavingList />} /> {/* 적금 리스트 페이지 */}

                        {/* 계좌 페이지 시작_채림님*/}
                        {/* 계좌 목록 페이지 */}<Route path="/account" element={<Account />} />
                        {/* 계좌 상세 페이지 */}<Route path="/account/detail/:accountNumber" element={<AccountDetail />} />
                        
                        {/* 비밀번호 확인 페이지 */}
                        <Route path="/account/:accountNumber/password-check" element={<PasswordCheck title="비밀번호 확인" instructions="비밀번호를 확인해주세요." />} />
                        <Route path="/account/password-check" element={<PasswordCheck title="비밀번호 확인" instructions="비밀번호를 확인해주세요." />} />

                        {/* 비밀번호 변경 페이지 */}<Route path="/account/:accountNumber/password-change" element={<PasswordChange />} />
                        {/* 계좌 해지 페이지 */}<Route path="/account/:accountNumber/close" element={<AccountClose />} />
                        {/* 이체 한도 조회 페이지 */}<Route path="/account/:accountNumber/limit-inquiry" element={<LimitInquiry />} />
                        {/* 이체 한도 변경 페이지 */}<Route path="/account/:accountNumber/limit-change" element={<LimitChange />} />
                        {/* 계좌 이체 페이지 */}<Route path="/account/transfer" element={<AccountTransfer />} />
                        {/* 이체 확인 페이지 */}<Route path="/account/transfer-confirmation" element={<AccountTransferConfirmation />} />
                        {/* 이체 완료 페이지 */}<Route path="/account/transfer-complete" element={<AccountTransferComplete />} />
                        {/* 자동이체 등록 페이지 */}<Route path="/auto-transfer-register" element={<AutoTransferRegister />} /> {/* 자동이체 등록 페이지 경로 추가 */}
                        {/* 자동이체 등록 2단계 페이지 */}<Route path="/auto-transfer-step2" element={<AutoTransferRegister2 />} /> {/* 자동이체 등록 2단계 페이지 추가 */}

                        {/*여기는 에이스 클럽 원주민만 가능*/}
                        <Route path="/exchange-rate" exact={true} element={<ExchangeRate />} />
                        <Route path="/exchange" exact={true} element={<Exchange />} /> {/* Exchange 경로 추가 */}
                        <Route path="/exchangeList" exact={true} element={<ExchangeList />} /> {/* ExchangeList 경로 추가 */}
                        <Route path="/detail-rate" exact={true} element={<DetailRate />} />
                        <Route path="/asset-calendar" exact={true} element={<AssetsCal />} />
                        <Route path="/myAsset" exact={true} element={<AssetsList />} />
                        <Route path="/consumeAnalyse" exact={true} element={<AssetsAnalysis/>} />
                        <Route path="/AssetsAnalysis" exact={true} element={<AssetsAnalysis />} />


                        <Route path="/getAddress" exact={true} element={<GetAddress />} />

                   </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
};

const style={
    margin: '10px'
}
export default RouteComponent;