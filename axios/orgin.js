import axios from 'axios';


const axiosInstance = axios.create({
    baseURL: 'https://masterapi.ookul.co/api/v1',
    // baseURL: 'http://localhost:8080/api/v1',
    credentials:'include',
    headers: {
        'Authorization': `baber oii5LFIs8BkMx48VyHjdZgZdvp0vGZinjGcwM6PlfHv7FlRhpz` 
    }
})

export default axiosInstance;