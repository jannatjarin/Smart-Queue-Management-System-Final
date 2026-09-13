import axios, {
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios";

const apiUrl =
    process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {

    throw new Error(
        "NEXT_PUBLIC_API_URL is not defined"
    );

}

const api = axios.create(
    {
        baseURL: apiUrl,
    }
);

interface RetryRequestConfig
    extends InternalAxiosRequestConfig {

    _retry?: boolean;

}

let refreshPromise:
    Promise<string> | null = null;


const clearTokens = () => {

    if (
        typeof window === "undefined"
    ) {

        return;

    }

    localStorage.removeItem(
        "access_token"
    );

    localStorage.removeItem(
        "refresh_token"
    );

};


api.interceptors.request.use(
    (config) => {

        if (
            typeof window !== "undefined"
        ) {

            const token =
                localStorage.getItem(
                    "access_token"
                );

            if (token) {

                config.headers.Authorization =
                    `Bearer ${token}`;

            }

        }

        return config;

    }
);


api.interceptors.response.use(
    (response) => response,

    async (
        error: AxiosError
    ) => {

        const originalRequest =
            error.config as
            RetryRequestConfig | undefined;

        if (
            !originalRequest ||
            error.response?.status !== 401 ||
            originalRequest._retry
        ) {

            return Promise.reject(
                error
            );

        }

        const requestUrl =
            originalRequest.url ?? "";

        const isAuthRequest =
            requestUrl.includes(
                "/auth/login"
            ) ||
            requestUrl.includes(
                "/auth/register"
            ) ||
            requestUrl.includes(
                "/auth/refresh"
            ) ||
            requestUrl.includes(
                "/auth/forgot-password"
            ) ||
            requestUrl.includes(
                "/auth/reset-password"
            );

        if (isAuthRequest) {

            return Promise.reject(
                error
            );

        }

        if (
            typeof window === "undefined"
        ) {

            return Promise.reject(
                error
            );

        }

        const refreshToken =
            localStorage.getItem(
                "refresh_token"
            );

        if (!refreshToken) {

            clearTokens();

            window.location.replace(
                "/login"
            );

            return Promise.reject(
                error
            );

        }

        originalRequest._retry =
            true;

        try {

            if (!refreshPromise) {

                refreshPromise =
                    axios.post(
                        `${apiUrl}/auth/refresh`,
                        {
                            refresh_token:
                                refreshToken,
                        }
                    )
                        .then(
                            (response) => {

                                const newAccessToken =
                                    response.data
                                        .access_token as string;

                                localStorage.setItem(
                                    "access_token",
                                    newAccessToken
                                );

                                return newAccessToken;

                            }
                        )
                        .finally(
                            () => {

                                refreshPromise =
                                    null;

                            }
                        );

            }

            const newAccessToken =
                await refreshPromise;

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return api(
                originalRequest
            );

        }

        catch (refreshError) {

            clearTokens();

            window.location.replace(
                "/login"
            );

            return Promise.reject(
                refreshError
            );

        }

    }
);


export default api;