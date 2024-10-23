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
    kakaoLogin : (code) => {
        console.log("info : " + code)
        console.log("kakaoLogin")
        return axios.get(`${API_BASE_URL}/doKakaoLogin`+ '/' +code)
    },
    findUserId: (datas) => {
    console.log("info : " + datas);
    console.log("kakaoLogin");
    return axios.get(`${API_BASE_URL}/findUserId`, {
        params: {
            name: datas.name,
            hp: datas.hp
        }
        });
    },
    resetPassword:(datas) => {
        console.log("info : " + datas);
        return axios.put(`${API_BASE_URL}/resetPassword`,datas)
    },
    getUserInfo: (userNo,token) => {
        console.log("info:" + userNo);
        console.log("token : "+ token);
        return axios.get(`${API_BASE_URL}/getUserInfo`+ '/' + userNo,token)
    },
    changePassword:(data) => {
        console.log("userPw : " + data);
        console.log("token : " + token);
        return axios.put(`${API_BASE_URL}/changePassword`,data,{
        headers: {
          'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
        }
      })
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
      return await axios.get(`${BASE_URL}/products/deposits/findAccount`, {
        headers: {
          'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
        }
      });
    } catch (error) {
      console.error('사용자 계좌 정보 조회 오류:', error);
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


  // 사용자 예적금 정보 가져오기 (토큰 필요)
  getUsersDeposit: async () => {
    try {
      return await axios.get(`${BASE_URL}/products/deposits/findDeposit`, {
        headers: {
          'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
        }
      });
    } catch (error) {
      console.error('사용자 계좌 정보 조회 오류:', error);
      throw error;
    }
  },
   // 적금상품 가입
   saveDepositJoin: async (depositData, token) => {
    try {
      return await axios.post(`${BASE_URL}/products/deposits/savings`, depositData, {
        headers: {
          Authorization: `Bearer ${token}` // JWT 토큰을 Authorization 헤더에 포함
        },
      });
    } catch (error) {
      console.error('LoanJoin 저장 실패:', error);
      throw error; // 에러 발생 시 상위로 전달
    }
  },

  // 정기예금상품 가입
  savingsJoin: async (depositData, token) => {
    try {
      return await axios.post(`${BASE_URL}/products/deposits/deposit`, depositData, {
        headers: {
          Authorization: `Bearer ${token}` // JWT 토큰을 Authorization 헤더에 포함
        },
      });
    } catch (error) {
      console.error('LoanJoin 저장 실패:', error);
      throw error; // 에러 발생 시 상위로 전달
    }
  },

  // 정기예금 가입 정보를 저장하는 메서드
  saveAccount: async (depositData, token) => {
    try {
      return await axios.post(`${BASE_URL}/products/deposits/account`, depositData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('적금 가입 오류:', error);
      throw error;
    }
  },

  // 긴급 출금 API 호출
  emergencyWithdraw: async (withdrawData, token) => {
    try {
        return await axios.post(`${BASE_URL}/products/deposits/emergencyWithdraw`, withdrawData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('긴급 출금 오류:', error);
        throw error;
    }
},

// 정기예금상품 가입
savingsReceive: async (depositData, token) => {
  try {
    return await axios.post(`${BASE_URL}/products/deposits/ReceivedPaid`, depositData, {
      headers: {
        Authorization: `Bearer ${token}` // JWT 토큰을 Authorization 헤더에 포함
      },
    });
  } catch (error) {
    console.error('LoanJoin 저장 실패:', error);
    throw error; // 에러 발생 시 상위로 전달
  }
},
  getUserPhoneNumber: async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/products/deposits/phone`, { // BASE_URL을 명시적으로 추가
        headers: {
          Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 포함
        },
      });
      return response.data; // 유저의 휴대폰 번호 반환
    } catch (error) {
      console.error('휴대폰 번호 정보를 불러오는 중 오류 발생:', error);
      throw error; // 에러 발생 시 상위로 전달
    }
  },
  checkPassword: async (token, accountNumber, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/products/deposits/checkPassword`, {
            accountNumber,
            password
        }, {
            headers: {
                Authorization: `Bearer ${token}` // JWT 토큰 추가
            }
        });
        return response;
    } catch (error) {
        console.error('비밀번호 확인 중 오류 발생:', error);
        throw error;
    }
  }
}

export default apiSer;