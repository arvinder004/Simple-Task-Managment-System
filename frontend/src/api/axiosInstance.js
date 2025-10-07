import axios from 'axios';
require('dotenv').config()

const BASE_URL = process.env.BASE_URL

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": 'application/json'
    }
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api;