import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://masterapi.ookul.co/api/v1',
    // baseURL: 'http://localhost:8080/api/v1',
    credentials:'include'
    // headers: {
    //     'authorization': ''
    // }
})

export default axiosInstance;