import React, { useState } from 'react';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';

// 메인 라우터 임포트
import Main from '../mainPage/Main';
import Navbar from './Navbar';

// 고객센터 라우터 임포트
import CustomerServiceMain from 'component/page/customerService/CustomerServiceMain';
import InquiryDetail from 'component/page/customerService/InquiryDetail';
import InquiryForm from 'component/page/customerService/InquiryForm'; 

// 로그인 라우터 임포트
import Login from '../page/loginPage/Login';
import Signup from '../page/loginPage/SignUp';

// 유저 라우터 임포트
import MyPage from 'component/page/user/MyPage'
import MyPageChangePw from 'component/page/user/MyPageChangePw'


// 검색바 라우터 임포트
import SearchResult from './searchBar/SearchResult';

// 투자 라우터 임포트
import InvestmentMain from 'component/page/investment/InvestmentMain';

// 공과금 라우터 임포트
import TaxMain from 'component/page/tax/TaxMain';
import TaxDetail from 'component/page/tax/TaxDetail';
import TaxHistory from 'component/page/tax/TaxHistory';

// OCR 데이터
import ImgSelect from 'component/page/ocrPage/ImgSelect';

// 대출
import LoanMain from 'component/page/loan/LoanMain';
import LoanDetail from 'component/page/loan/LoanDetail';
import LoanApply from 'component/page/loan/LoanApply';

// 어드민 라우터 임포트
import AdminList from '../page/adminPage/admin/AdminList';
import AdminLogin from '../page/adminPage/admin/AdminLogin';
import EditAdmin from '../page/adminPage/admin/EditAdmin';
import MemberList from '../page/adminPage/user/MemberList';
import RetiredMember from '../page/adminPage/user/RetiredMember';
import FinancialProduct from '../page/adminPage/product/FinancialProduct';
import SavingsProduct from '../page/adminPage/product/SavingsProduct';
import DepositProduct from '../page/adminPage/product/DepositProduct';
import ADLoanProduct from '../page/adminPage/product/ADLoanProduct';
import TransactionHistory from '../page/adminPage/akkount/TransactionHistory';
import AccountClosure from '../page/adminPage/akkount/AccountClosure';
import CurrencyExchangeHistory from '../page/adminPage/exchange/CurrencyExchangeHistory';
import ExchangePickupLocation from '../page/adminPage/exchange/ExchangePickupLocation';
import MemberEdit from '../page/adminPage/user/MemberEdit';
import EditSavingsProduct from '../page/adminPage/product/EditSavingsProduct';
import EditLoanProduct from '../page/adminPage/product/EditLoanProduct';
import Sidebar from '../page/adminPage/Sidebar';
import TaxList from '../page/adminPage/tax/taxList';
import TaxEdit from '../page/adminPage/tax/taxEdit';
import TaxInsert from '../page/adminPage/tax/taxInsert';
import AdAccount from '../page/adminPage/account/AdAccount';
import AdAccountStop from '../page/adminPage/account/AdAccountStop';
import AdAccountClosure from '../page/adminPage/account/AdAccountClosure';
import AdTransactionHistory from '../page/adminPage/account/AdTransactionHistory';
import RegisterProduct from '../page/adminPage/product/RegisterProduct';
import RegisterLoanProduct from '../page/adminPage/product/RegisterLoanProduct ';
import AdminInquiryList from '../page/adminPage/support/AdminInquiryList';  // 문의 목록
import AdminInquiryDetail from '../page/adminPage/support/AdminInquiryDetail';  // 문의 상세

// 예금 적금
import DepositMain from 'component/page/product/Deposit/DepositMain';
import DepositList from 'component/page/product/Deposit/DepositList';
import Depositchap1 from 'component/page/product/Deposit/Depositchap1';
import Depositchap2 from 'component/page/product/Deposit/Depositchap2';
import Depositchap3 from 'component/page/product/Deposit/Depositchap3';
import DepositchapO1 from 'component/page/product/Deposit/DepositchapO1';
import DepositchapO2 from 'component/page/product/Deposit/DepositchapO2';
import Termination from 'component/page/product/Deposit/Termination';


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
import AutoTransferList from '../page/account/autoTransfer/AutoTransferList';

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
import ExchangeResult from 'component/page/exchangePage/ExchangeResult';
import Footer from './Footer';
import SignUpForKakao from 'component/page/loginPage/SignUpForKakao';
import FindIdAndPw from 'component/page/loginPage/FindIdAndPw';
import RedirectPage from 'component/page/loginPage/RedirectKakao';




const RouteComponent = () => {
    const [inquiries, setInquiries] = useState([]); // inquiries 상태 변수 정의
    const addInquiry = (newInquiry) => setInquiries([...inquiries, newInquiry]); // addInquiry 함수 정의

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <div>
            <BrowserRouter>
                <header>
                    <Navbar/>
                </header>
                <div style={style}>
                    <Routes>
                        <Route path="/" exact={true} element={<Main />} />
                        {/*}로그인 페이지{*/}
                        <Route path="/login" exact={true} element={<Login />} />
                        <Route path="/signup" exact={true} element={<Signup />} />                        
                        {/*검색바 리스트 이동*/}
                        <Route path="/searchresult" exact={true} element={<SearchResult/>} />
                        <Route path="/signupForKakao" exact={true} element={<SignUpForKakao />} />
                        <Route path="/FindIdAndPw" exact={true} element={<FindIdAndPw />} />
                        {/*}투자 페이지{*/}
                        <Route path="/investment" exact={true} element={<InvestmentMain/>} />
                        {/*}공과금페이지{*/}
                        <Route path="/tax/elec" exact={true} element={<TaxMain/>} />
                        <Route path="/tax/Detail" exact={true} element={<TaxDetail/>} />
                        <Route path="/tax/History" exact={true} element={<TaxHistory/>} />
                        {/*OCR데이터*/}
                        <Route path="/ocr" exact={true} element={<ImgSelect />} />
                        {/*대출*/}
                        <Route path="/loanmain" exact={true} element={<LoanMain />} />
                        <Route path="/loanmain/loandetail/:loanProductNo" exact={true} element={<LoanDetail />} />
                        <Route path="/loanmain/loanapply/:loanProductNo" exact={true} element={<LoanApply />} />
                        
                        {/* 어드민 관리자 */}
                        <Route path="/adLog" element={<AdminLogin setIsLoggedIn={setIsLoggedIn} />} />
                        {/* <Route path="/adminList" element={<AdminList />} /> */}
                        {/* <Route path="/editAdmin" element={<EditAdmin />} /> */}
                        {/* 고객센터 페이지 경로 설정 */}
                        <Route path="/customer-service" element={<CustomerServiceMain />} />
                        <Route path="/inquiry/:id" element={<InquiryDetail inquiries={inquiries} />} />
                        <Route path="/inquiry-form" element={<InquiryForm addInquiry={addInquiry} />} /> {/* InquiryForm 라우팅 설정 */}
                        
                        {/* 사용자 관리 페이지 */}
                        <Route path="/memberList" element={<MemberList />} />
                        <Route path="/retiredMember" element={<RetiredMember />} />
                        <Route path="/editMember" element={<MemberEdit />} />

                        {/* 관리자 페이지 문의 관리 목록 */}
                        <Route path="/admin/support/inquiries" element={<AdminInquiryList />} />

                        {/* 특정 문의글 상세 보기 (qnaNo가 변수로 전달됨) */}
                        <Route path="/admin/support/inquiry/:qnaNo" element={<AdminInquiryDetail />} />

                        {/* 금융 상품 관리 페이지 */}
                        <Route path="/admin/financialProduct" element={<FinancialProduct />} />
                        <Route path="/admin/savingsProduct" element={<SavingsProduct />} />
                        <Route path="/admin/depositProduct" element={<DepositProduct />} />
                        <Route path="/admin/loanProduct" element={<ADLoanProduct />} />
                        {/* 금융 상품 수정 페이지 */}
                        <Route path="/admin/RegisterLoanProduct" element={<RegisterLoanProduct  />} />
                        <Route path="/admin/RegisterProduct" element={<RegisterProduct />} />
                        <Route path="/EditSavingsProduct" element={<EditSavingsProduct />} />
                        <Route path="/EditLoanProduct" element={<EditLoanProduct />} />

                        {/* 거래 내역 및 계좌 관리 페이지 */}
                        <Route path="/admin/adTransactionHistory" element={<AdTransactionHistory />} />
                        <Route path="/admin/adAccount" element={<AdAccount />} />
                        <Route path="/admin/adAccountStop" element={<AdAccountStop />} />
                        <Route path="/admin/adAccountClosure" element={<AdAccountClosure />} />

                        {/* 외환 거래 관리 페이지 */}
                        <Route path="/exchangeHistory" element={<CurrencyExchangeHistory />} />
                        <Route path="/exchangeLocation" element={<ExchangePickupLocation />} />

                        {/* 로그인하지 않았을 때는 관리자 로그인 페이지로 리다이렉트 */}


                        {/*상품 라우터_민우님*/}
                        {/* 예금, 적금, 대출 상품 관련 */}
                        <Route path="/DepositMain" exact={true} element={<DepositMain />} />
                        <Route path="/deposit-list" exact={true} element={<DepositList />} />
                        <Route path="/Depositchap1" exact={true} element={<Depositchap1 />} />
                        <Route path="/Depositchap2" exact={true} element={<Depositchap2 />} />
                        <Route path="/Depositchap3" exact={true} element={<Depositchap3 />} />
                        <Route path="/DepositchapO1" exact={true} element={<DepositchapO1 />} />
                        <Route path="/DepositchapO2" exact={true} element={<DepositchapO2 />} />
                        <Route path="/Termination" exact={true} element={<Termination />} />

                        {/* 계좌 페이지 시작_채림님*/}
                        {/* 계좌 목록 페이지 */}<Route path="/users/:userNo/accounts" element={<Account />} />
                        {/* 계좌 상세 페이지 */}<Route path="/account/detail/:accountNumber" element={<AccountDetail />} />
{/*                         <Route path="/account/transaction-history" element={<TransactionCalendar />} /> */}


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
                        {/* 자동이체 등록 페이지 */}<Route path="/auto-transfer/register" element={<AutoTransferRegister />} /> {/* 자동이체 등록 페이지 경로 추가 */}
                        {/* 자동이체 등록 2단계 페이지 */}<Route path="/auto-transfer/step2" element={<AutoTransferRegister2 />} /> {/* 자동이체 등록 2단계 페이지 추가 */}
                        <Route path="/auto-transfer/list" element={<AutoTransferList />} />
                        <Route path="/new-transfer-modify/:autoTransNo" element={<AutoTransferRegister2 />} />
                        {/* 자동이체 해지 비밀번호 확인 페이지 */}
{/*                         <Route path="/auto-transfer-password-check" element={<AutoTransferCancelPasswordCheck />} /> */}

                        {/*여기는 에이스 클럽 원주민만 가능*/}
                        <Route path="/exchange-rate" exact={true} element={<ExchangeRate />} />
                        <Route path="/exchange" exact={true} element={<Exchange />} /> {/* Exchange 경로 추가 */}
                        <Route path="/exchangeList" exact={true} element={<ExchangeList />} /> {/* ExchangeList 경로 추가 */}
                        <Route path="/detail-rate" exact={true} element={<DetailRate />} />
                        <Route path="/exchange-result" exact={true} element={<ExchangeResult />} />
                        <Route path="/asset-calendar" exact={true} element={<AssetsCal />} />
                        <Route path="/myAsset" exact={true} element={<AssetsList />} />
                        <Route path="/consumeAnalyse" exact={true} element={<AssetsAnalysis/>} />
                        <Route path="/AssetsAnalysis" exact={true} element={<AssetsAnalysis />} />

                        <Route path="/taxList" exact={true} element={<TaxList />} />
                        <Route path="/taxInsert" exact={true} element={<TaxInsert />} />
                        <Route path="/taxEdit/:taxNo" exact={true} element={<TaxEdit />} />

                        <Route path="/getAddress" exact={true} element={<GetAddress />} />
                        <Route path="/kakaoLogin" exact={true} element={<RedirectPage />} />
                        

                   </Routes>
                </div>
                <footer>
                    <Footer />
                </footer>
            </BrowserRouter>
        </div>
    );
};

const style={
    margin: '10px'
}
export default RouteComponent;