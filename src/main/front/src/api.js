import axios from 'axios';

const api = axios.create({
    baseURL: '/',
    headers: {
        "Content-Type": "application/json",
        withCredentials: true
    }
});

let isRefreshing = false;
let refreshSubscribers = [];

function onRrefreshed(token) {
    refreshSubscribers.map(cb => cb(token));
    refreshSubscribers = [];
}

function subscribeTokenRefresh(cb) {
    refreshSubscribers.push(cb);
}

// 요청 인터셉터 설정
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 설정
api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh(token => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        resolve(api(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axios.post('/api/refreshToken', {}, { withCredentials: true });
                console.log("response data : ", data);
                localStorage.setItem('token', data);
                onRrefreshed(data);
                originalRequest.headers['Authorization'] = `Bearer ${data}`;
                return api(originalRequest);
            } catch (refreshError) {
                try {
                    axios.get('/api/auth/Logout', {
                        withCredentials: true
                    });
                    localStorage.removeItem('token');
                    window.location.reload();
                    alert("다시 로그인해주세요.");
                } catch (error) {
                    alert('다시 시도해주세요.');
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default api;