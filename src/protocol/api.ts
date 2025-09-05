import axios from 'axios';
import { Auth0Client, User } from '@auth0/auth0-spa-js';
import { DirectoryType, Row } from '../Page/Course/interface.directory';
import { Page } from '../Page/Section/interface.type';
import { HistoryType } from '../components/atoms/Row';
import {
    ChatResponse,
    DirectoryRequest,
    DirectoryResponse,
    NoteResponse,
    NoteRequest,
    ResumeRequest,
    ResumeResponse,
    PageRequest,
    PageResponse,
} from './api.type';
import config from '../config';

const auth0 = new Auth0Client({
    domain: 'dev-gied5dxzv0v4e4pa.us.auth0.com',
    clientId: 'djaxQ10FCMs03JQeqxqMsDG04iquX54k',
    cacheLocation: 'localstorage',
    useRefreshTokens: true,
});

const nestServer = axios.create({
    baseURL: config.URL_BACKEND,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const pythonServer = axios.create({
    baseURL: config.URL_PYTHON,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

nestServer.interceptors.response.use(
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
        nestServer.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete nestServer.defaults.headers.common['Authorization'];
    }
}

export const getUser = async (user: User) => {
    const res = await nestServer.post(`get_user`, user);
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
    const res = await nestServer.get(`directory?${query}`);
    return res.data;
};

export const getParents = async (child_id: string) => {
    const res = await nestServer.get(`directory/parents/${child_id}`);
    return res.data;
};

export const getHistory = async (historyType: HistoryType, userID: string) => {
    const res = await nestServer.get<Row[]>(`history/${userID}?directory_type=${historyType}`);
    return res.data;
};

export const putHistory = async (historyType: string, historyId: string, filterId: string) => {
    const res = await nestServer.put<any>(`history/${filterId}`, {
        history_type: historyType,
        history_id: historyId,
    });

    return res.data;
};

// FETCH ONE DIRECTORY
export const getDirectory = async (parentId: string) => {
    const res = await nestServer.get<DirectoryResponse>(`directory/${parentId}`);
    return res.data;
};

export const checkDirectoryExists = async (parentId: string) => {
    const res = await nestServer.get<boolean>(`directory/exists/${parentId}`);
    console.log('@@checkDirectoryExists', res.data);
    return res.data;
};

export const getResume = async (sectionId: string) => {
    const res = await nestServer.get<ResumeResponse>(`resume/${sectionId}`);
    return res.data;
};

export const getNote = async (sectionId: string) => {
    const res = await nestServer.get<NoteResponse>(`note/${sectionId}`);
    return res.data;
};

export const getChat = async (sectionId: string) => {
    const res = await nestServer.get<ChatResponse[]>(`chat/${sectionId}`);
    return res.data;
};

export const getPages = async (sectionId: string) => {
    const res = await nestServer.get<Page[]>(`page/${sectionId}`);
    return res.data;
};

export const createTempFile = async ({
    sectionId,
    index,
    filename,
}: {
    sectionId: string;
    index: number;
    filename: string;
}) => {
    const res = await nestServer.post('/file', { sectionId, index, filename });
    return res.data;
};

export const sendToTranscriptionQueue = async ({
    audio_base64,
    audio_format,
    tmp_file_id,
    is_last_page,
}: {
    audio_base64: string;
    audio_format: string;
    tmp_file_id: string;
    is_last_page: boolean;
}) => {
    const res = await pythonServer.post('/transcribe', {
        audio_base64,
        audio_format,
        tmp_file_id,
        is_last_page,
    });
    return res.data;
};

export const createDirectory = async (
    directory: DirectoryRequest,
    tmp_id?: string,
): Promise<{ directory: DirectoryResponse; tmp_id?: string }> => {
    const res = await nestServer.post<DirectoryResponse>('/directory', directory);
    return { directory: res.data, tmp_id: tmp_id ?? '' };
};

export const createResume = async (sectionId: string) => {
    const res = await nestServer.post<ResumeResponse>(`/resume`, { section: sectionId, data: '' });
    return res.data;
};

export const createNote = async (sectionId: string) => {
    const res = await nestServer.post<NoteResponse>(`/note`, { section: sectionId, data: '' });
    return res.data;
};

export const createDefaultPage = async (sectionId: string, tmp_id?: string): Promise<{ page: PageResponse; tmp_id: string }> => {
    const res = await nestServer.post<PageResponse>(`/page`, {
        section: sectionId,
        data: '',
        title: 'New page',
    });
    return { page: res.data, tmp_id: tmp_id ?? '' };
};

export const deleteDirectory = async (directoryId: string) => {
    const res = await nestServer.delete(`/directory/${directoryId}`);
    return res.data;
};

export const deleteResume = async (resumeId: string) => {
    const res = await nestServer.delete(`/resume/${resumeId}`);
    return res.data;
};

export const deleteNote = async (noteId: string) => {
    const res = await nestServer.delete(`/note/${noteId}`);
    return res.data;
};

export const deletePage = async (pageId: string) => {
    const res = await nestServer.delete(`/page/${pageId}`);
    return res.data;
};

export const updateDirectory = async (directoryId: string, directory: DirectoryRequest) => {
    const res = await nestServer.put(`/directory/${directoryId}`, directory);
    return res.data;
};

export const updateResume = async (resumeId: string, resume: ResumeRequest) => {
    const res = await nestServer.put(`/resume/${resumeId}`, resume);
    return res.data;
};

export const updateNote = async (noteId: string, note: NoteRequest) => {
    const res = await nestServer.put(`/note/${noteId}`, note);
    return res.data;
};

export const updatePage = async (pageId: string, page: PageRequest) => {
    const res = await nestServer.put(`/page/${pageId}`, page);
    return res.data;
};