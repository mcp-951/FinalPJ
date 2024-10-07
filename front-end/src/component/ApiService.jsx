import axios from 'axios';

const API_BASE_URL = "http://localhost:8081";

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


};

export default apiSer;