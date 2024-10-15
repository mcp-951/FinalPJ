import axios from 'axios';
import localStorage from 'localStorage';

const API_BASE_URL = "http://localhost:8081";
const BASE_URL = "http://localhost:8081";
const token = localStorage.getItem("token");


const apiSer = {
    login: (loginData) => {
        console.log("login");
        console.log("data : " + loginData.userId);
        return axios.post(`${API_BASE_URL}/login`, loginData);
    },

    signUp: (inputData) => {
        console.log("signUp");
        return axios.post(`${API_BASE_URL}/signup`, inputData);
    },

    checkId : (userId) => {
        console.log("userId : " + userId);
        console.log("IdCheck");
        return axios.get(`${API_BASE_URL}/findById` + '/' + userId);
    },
    checkHp : (hp) => {
        console.log("hp : " + hp);
        console.log("checkHp");
        return axios.get(`${API_BASE_URL}/checkHp` + '/' + hp);
    },
    kakaoLogin : (kakaoId) => {
        console.log("info : " + kakaoId)
        console.log("kakaoLogin")
        return axios.put(`${API_BASE_URL}/putKakaoInfo`,kakaoId)
    },

     
  // 자동이체 리스트 가져오기
  getAutoTransfers: async () => {
    try {
      return await axios.get(`${BASE_URL}/auto-transfers`, {
        headers: {
          'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
        }
      });
    } catch (error) {
      console.error('자동이체 리스트 조회 오류:', error);
      throw error;
    }
  },

  // 자동이체 데이터 저장
  saveAutoTransfer: async (autoTransferData) => {
    try {
      return await axios.post(`${BASE_URL}/auto-transfers`, autoTransferData, {
        headers: {
          'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
        }
      });
    } catch (error) {
      console.error('자동이체 데이터 저장 오류:', error);
      throw error;
    }
  },

  // 대출 상품 페이징 처리하여 가져오기
  fetchLoanProductsPaged: async (page, size) => {
    try {
      return await axios.get(`${BASE_URL}/products/loans/page`, {
        "getPage" : page,
        "getSize" : size
      });
    } catch (error) {
      console.error('대출 상품 페이징 조회 오류:', error);
      throw error;
    }
  },

  // 사용자 계좌 정보 가져오기 (토큰 필요)
  getUserAccounts: async () => {
    try {
      return await axios.get(`${BASE_URL}/products/loans/account`, {
        headers: {
          'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
        }
      });
    } catch (error) {
      console.error('사용자 계좌 정보 조회 오류:', error);
      throw error;
    }
  },

  saveLoanJoin: async (loanData, token) => {
    try {
      return await axios.post(`${BASE_URL}/products/loans/save`, loanData, {
        headers: {
          Authorization: `Bearer ${token}` // JWT 토큰을 Authorization 헤더에 포함
        }
      });
    } catch (error) {
      console.error('LoanJoin 저장 실패:', error);
      throw error;
    }
  },

  getActiveLoans: async () => {
    try {
      return await axios.get(`${BASE_URL}/products/loans/userLoans`, {
        headers: {
          Authorization: `Bearer ${token}` // Authorization 헤더에 JWT 추가
        }
      });
    } catch (error) {
      console.error('대출 정보 조회 오류:', error);
      throw error;
    }
  },

  processRepayment: async (repaymentData, token) => {
    try {
      const response = await axios.post(`${BASE_URL}/products/loans/repayment`, 
      repaymentData, // 객체로 데이터를 전달
      {
        headers: {
          Authorization: `Bearer ${token}` // 헤더로 토큰 전달
        }
      });
      return response.data;
    } catch (error) {
      console.error('상환 처리 오류:', error);
      throw error;
    }

  },
  // 적금 상품 페이징 처리하여 가져오기
  fetchDepositProductsPaged: async (page, size) => {
    try {
      return await axios.get(`${BASE_URL}/products/deposits/page`, {
        "getPage" : page,
        "getSize" : size
      });
    } catch (error) {
      console.error('대출 상품 페이징 조회 오류:', error);
      throw error;
    }
  },
  
    
};

export default apiSer;