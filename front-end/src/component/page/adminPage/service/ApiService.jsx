import axios from 'axios';
import localStorage from 'localStorage';
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';

const token = localStorage.getItem("token");
const ApiService = {

  get: async (url) => {
    try {
      return await axios.get(`${BASE_URL}` + '/admin' + `${url}`,{
            headers: {
                'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
            }
        });
    } catch (error) {
      console.error('GET 요청 오류:', error);
      throw error; // 필요 시 오류를 다시 던질 수 있습니다.
    }
  },
  post: async (url, data) => {
    try {
      return await axios.post(`${BASE_URL}${url}`, data,{
            headers: {
                'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
            }
        });
    } catch (error) {
      console.error('POST 요청 오류:', error);
      throw error;
    }
  },
  put: async (url, data) => {
    try {
      return await axios.put(`${BASE_URL}` + '/admin' + `${url}`, data,{
            headers: {
                'Authorization': `Bearer ${token}` // Authorization 헤더에 JWT 추가
            }
        });
    } catch (error) {
      console.error('PUT 요청 오류:', error);
      throw error;
    }
  },
  delete: async (url) => {
    try {
      return await axios.delete(`${BASE_URL}` + '/admin' + `${url}`);
    } catch (error) {
      console.error('DELETE 요청 오류:', error);
      throw error;
    }
  }
};

export default ApiService;
