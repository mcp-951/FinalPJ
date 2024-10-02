// services/authService.js
import axios from 'axios';

const login = async (credentials) => {
  const response = await axios.post('/api/login', credentials);
  return response.data; // 서버에서 받은 토큰 반환
};

export default { login };
