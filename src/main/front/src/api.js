import axios from 'axios';

const api = axios.create({
    baseURL: '/',
    headers: {
        "Content-Type": "application/json",
        withCredentials: true
    }
});

// 요청 인터셉터 설정
api.interceptors.request.use(
    config => {
        // 요청을 보내기 전에 수행할 작업
        // 예: 토큰을 헤더에 추가
        const token = localStorage.getItem('token');
        console.log(token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        // 요청 오류가 발생했을 때 작업
        return Promise.reject(error);
    }
);

// 응답 인터셉터 설정
api.interceptors.response.use(
    response => {
        // 응답 데이터를 가공하거나 로그를 남길 수 있음
        return response;
    },
    error => {
        // 응답 오류가 발생했을 때 작업
        // 예: 인증 오류 처리
        if (error.response && error.response.status === 401) {
            // 예: 로그인 페이지로 리다이렉트
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
