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
  // 특정 유저의 모든 계좌 정보 가져오기 (예금, 적금, 대출 등 모두 포함)
  getAllAccounts: (userNo, token) => {
    return api.get(`/users/${userNo}/accounts`, {
      headers: {
        'Authorization': `Bearer ${token}`, // JWT 토큰 추가
      },
    });
  },

  // 특정 계좌 번호로 계좌 상세 정보 가져오기
  getAccountDetail: (userNo, accountNumber, token) => {
    return api.get(`/account/${accountNumber}?userNo=${userNo}`, {
      headers: {
        'Authorization': `Bearer ${token}`, // JWT 토큰 추가
      },
    });
  },

  // 특정 상품 번호로 상품 정보 가져오기
  getProductByNo: (productNo, token) => {
    return api.get(`/product/${productNo}`, {
      headers: {
        'Authorization': `Bearer ${token}`, // JWT 토큰 추가
      },
    });
  },

  // 특정 계좌의 거래내역 가져오기 (userNo 없이 수정)
  getAccountLogs: (accountNumber, token) => {
    return api.get(`/account/${accountNumber}/logs`, {
      headers: {
        'Authorization': `Bearer ${token}`, // JWT 토큰 추가
      },
    });
  },
};

export default ApiService;
