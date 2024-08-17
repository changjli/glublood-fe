import axios from "axios";

const apiClient = axios.create({
    baseURL: `http://10.0.2.2:8000`,
    // cors 
    headers: {
        'Access-Control-Allow-Origin': `*`,
        'Access-Control-Allow-Methods': 'GET, HEAD, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'ApiKey': `${process.env.PUBLIC_API_KEY}`,
    },
    timeout: 10000,
})

apiClient.interceptors.response.use(
    function (response) {
        return response
    },
    function (error) {
        console.log('Interceptor Error:', error)
        if (error.response.status == 401) {
            // Unauthorized
        } else if (error.response.status == 403) {
            // Forbidden
        }
        return Promise.reject(error)
    }
)
export default apiClient