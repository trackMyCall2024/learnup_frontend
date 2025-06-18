import axios from 'axios';
import { Auth0Client, User } from '@auth0/auth0-spa-js';
import { Row } from '../Page/Course/interface.directory';
import { SectionProps } from '../Page/Section/interface.type';

const auth0 = new Auth0Client({
    domain: 'dev-gied5dxzv0v4e4pa.us.auth0.com',
    clientId: 'djaxQ10FCMs03JQeqxqMsDG04iquX54k',
    cacheLocation: 'localstorage',
    useRefreshTokens: true,
});

const api = axios.create({
    baseURL: process.env.URL_BACKEND || 'http://localhost:3000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Si le token est expiré ou invalide (401 ou 403)
        if (error.response && [401, 403].includes(error.response.status)) {
            console.debug('⚠️ Token invalide ou expiré');
            // return logout();
            auth0.logout({
                logoutParams: {
                    returnTo: window.location.origin,
                },
            });
        }

        return error;
    },
);

export function setAuthToken(token: string) {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
}

export const getUser = async (user: User) => {
    const res = await api.post(`get_user`, user);
    return res.data;
};

export const getRows = async (controller: string, filterId: string, filterSearch = '') => {
    const res = await api.get(`${controller}/${filterId}?search=${filterSearch}`);
    return res.data;
};

export const getSection = async (sectionId: string) => {
    const res = await api.get<SectionProps>(`section/single/${sectionId}`);
    return res.data;
};

export const getHistory = async (historyType: string, filterId: string) => {
    const res = await api.get<Row[]>(`history/${filterId}?history_type=${historyType}`);
    return res.data;
};

export const putHistory = async (historyType: string, historyId: string, filterId: string) => {
    const res = await api.put<any>(`history/${filterId}`, {
        history_type: historyType,
        history_id: historyId,
    });

    return res.data;
};
