import axios from 'axios';
import { Auth0Client, User } from '@auth0/auth0-spa-js';
import { Row } from '../Page/Course/interface.directory';
import { Page, SectionProps } from '../Page/Section/interface.type';
import { HistoryType } from '../components/atoms/Row';
import {
    ChatResponse,
    ChunkResponse,
    DirectoryRequest,
    DirectoryResponse,
    NoteResponse,
    PageResponse,
    ResumeResponse,
} from './api.type';

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

// FETCH MANY DIRECTORIES
export const getRows = async (
    controller: string,
    filterId: string,
    filterSearch = '',
    pagination: number,
    limit: number,
) => {
    const query = `search=${filterSearch}&type=${controller}&pagination=${pagination}&limit=${limit}&parentID=${filterId}`;
    const res = await api.get(`directory?${query}`);
    return res.data;
};

export const getHistory = async (historyType: HistoryType, userID: string) => {
    const res = await api.get<Row[]>(`history/${userID}?directory_type=${historyType}`);
    return res.data;
};

export const putHistory = async (historyType: string, historyId: string, filterId: string) => {
    const res = await api.put<any>(`history/${filterId}`, {
        history_type: historyType,
        history_id: historyId,
    });

    return res.data;
};

// FETCH ONE DIRECTORY
export const getDirectory = async (parentId: string) => {
    const res = await api.get<DirectoryResponse>(`directory/${parentId}`);
    return res.data;
};

export const getResume = async (sectionId: string) => {
    const res = await api.get<ResumeResponse>(`resume/${sectionId}`);
    return res.data;
};

export const getNote = async (sectionId: string) => {
    const res = await api.get<NoteResponse>(`note/${sectionId}`);
    return res.data;
};

export const getChat = async (sectionId: string) => {
    const res = await api.get<ChatResponse[]>(`chat/${sectionId}`);
    return res.data;
};

export const getPages = async (sectionId: string) => {
    const res = await api.get<Page[]>(`page/${sectionId}`);
    return res.data;
};

export const uploadAudio = async (formData: FormData) => {
    console.log('@@uploadAudio - formData entries:');
    for (const [key, value] of Array.from(formData.entries())) {
        console.log(key, value);
    }

    const res = await api.post('/file/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // Important !
        },
    });

    // Axios retourne directement la réponse, pas res.ok
    console.log('@@uploadAudio - response:', res);
    return res;
};

export const createDirectory = async (directory: DirectoryRequest) => {
    const res = await api.post<DirectoryResponse>('/directory', directory);
    return res.data;
};

export const createResume = async (sectionId: string) => {
    const res = await api.post<ResumeResponse>(`/resume`, { section: sectionId, data: '' });
    return res.data;
};

export const createNote = async (sectionId: string) => {
    const res = await api.post<NoteResponse>(`/note`, { section: sectionId, data: '' });
    return res.data;
};
