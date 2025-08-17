// import axios from 'axios';

// const baseURL = import.meta.env.VITE_API_BASE_URL;

// const axiosInstance = axios.create({
//     baseURL,
// });

// axiosInstance.defaults.headers.common['skip_zrok_interstitial'] = 'true';

// export default axiosInstance;


import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.defaults.headers.common['skip_zrok_interstitial'] = 'true';

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('access');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        console.error("Request error: ", error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if ((error.response?.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refresh');
            if (refreshToken) {
                try {
                    delete axiosInstance.defaults.headers.common['Authorization'];

                    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
                        { refreshToken: refreshToken }, {
                        headers: {
                            'skip_zrok_interstitial': 'true',
                        },
                    }
                    );
                    const newAccessToken = response.data?.accessToken;
                    if (newAccessToken) {
                        localStorage.setItem('access', newAccessToken);

                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                        // Retry the original request
                        return axiosInstance(originalRequest);
                    }
                } catch (refreshError) {
                    alert("Session expired. Please log in again.");
                    localStorage.removeItem('access');
                    localStorage.removeItem('refresh');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                console.error("No refresh token available. Redirecting to login.");
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;