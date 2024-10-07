import axios from 'axios';

// Axios 기본 설정
const api = axios.create({
  baseURL: 'http://localhost:8081/uram',  // 백엔드 서버 URL 설정
  headers: {
    'Content-Type': 'application/json',
  },
});

// 계좌 관련 API 서비스
const ApiService = {
  // 모든 계좌 정보 가져오기 (예금, 적금, 대출 등 모두 포함)
  getAllAccounts: () => {
    return api.get('/account');  // "/account" API 호출
  },

  // 특정 계좌 번호로 계좌 상세 정보 가져오기
  getAccountDetail: (accountNumber) => {
    return api.get(`/account/${accountNumber}`);  // "/account/{accountNumber}"로 계좌 상세 정보 가져오기
  },

  // 특정 상품 번호로 상품 정보 가져오기
  getProductByNo: (productNo) => {
    return api.get(`/product/${productNo}`);  // 백엔드에서 product 정보를 받아오는 API 경로
  },

  // 특정 계좌의 거래내역 가져오기
  getAccountLogs: (accountNumber) => {
    return api.get(`/account/${accountNumber}/logs`);  // 계좌번호로 거래내역 가져오기
  },

  // 추가적인 API 메서드들 정의 가능
};

export default ApiService;
