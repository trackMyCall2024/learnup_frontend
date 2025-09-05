import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Page } from '../interface.global';
import { DirectoryType } from '../Page/Course/interface.directory';

// Fonction pour déterminer la page à partir de l'URL de manière plus robuste
const getCurrentPageFromURL = (): Page => {
    const pathname = window.location.pathname;
    const pathSegments = pathname.split('/').filter((segment) => segment !== '');

    if (pathSegments.length === 0) return Page.Dashboard;

    const firstSegment = pathSegments[0];

    switch (firstSegment) {
        case 'dashboard':
            return Page.Dashboard;
        case 'courses':
            return Page.Courses;
        case 'chapters':
            return Page.Chapters;
        case 'sections':
            return Page.Sections;
        case 'section':
            return Page.Section;
        case 'social':
            return Page.Social;
        case 'profile':
            return Page.Profile;
        case 'blocker':
            return Page.Blocker;
        case 'settings':
            return Page.Settings;
        default:
            return Page.Dashboard;
    }
};

const currentPage = getCurrentPageFromURL();

export interface GlobalState {
    page: {
        next: {
            _id: string; // Next course ID, chapter ID, section ID to get data
            title: Page | RowPage | null;
            isOpen: boolean;
        };
        isHalfPageIsOpen: boolean;
    };
    navbar: {
        isEnlarged: boolean;
    };
    lesson: {
        isZoomed: boolean;
    };
    recorder: {
        isOpen: boolean;
    };
    deleteModal: {
        isOpen: boolean;
        isLoading: boolean;
        content: {
            _id: string;
            name: string;
            type: DirectoryType;
        };
    };
    errorModal: {
        isOpen: boolean;
        title: string;
        message: string;
    };
}

// Fonction pour charger les données du localStorage
const loadRecorderFromStorage = () => {
    try {
        const stored = localStorage.getItem('recorderModal');
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                isOpen: parsed.isOpen ?? true,
            };
        }
    } catch (error) {
        console.warn('Erreur lors du chargement du localStorage:', error);
    }
    return {
        isOpen: true,
    };
};

const initialState: GlobalState = {
    page: {
        next: {
            _id: '',
            title: null,
            isOpen: false,
        },
        isHalfPageIsOpen: false,
    },
    navbar: {
        isEnlarged: true,
    },
    lesson: {
        isZoomed: false,
    },
    recorder: loadRecorderFromStorage(),
    deleteModal: {
        isOpen: false,
        isLoading: false,
        content: {
            _id: '',
            name: '',
            type: DirectoryType.Course,
        },
    },
    errorModal: {
        isOpen: false,
        title: '',
        message: '',
    },
};

export type RowPage = Page.Courses | Page.Chapters | Page.Sections;

export const userSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        // Half page
        setNextPage: (state: GlobalState, action: PayloadAction<GlobalState['page']['next']>) => {
            state.page.next = action.payload;
            return state;
        },
        setNavbarEnlarged: (
            state: GlobalState,
            action: PayloadAction<GlobalState['navbar']['isEnlarged']>,
        ) => {
            state.navbar.isEnlarged = action.payload;
            return state;
        },
        setIsHalfPageIsOpen: (
            state: GlobalState,
            action: PayloadAction<GlobalState['page']['isHalfPageIsOpen']>,
        ) => {
            state.page.isHalfPageIsOpen = action.payload;
            return state;
        },
        setIsLessonZoomed: (
            state: GlobalState,
            action: PayloadAction<GlobalState['lesson']['isZoomed']>,
        ) => {
            state.lesson.isZoomed = action.payload;
            return state;
        },
        setIsRecorderOpen: (
            state: GlobalState,
            action: PayloadAction<GlobalState['recorder']['isOpen']>,
        ) => {
            state.recorder.isOpen = action.payload;
            // Sauvegarder en localStorage
            try {
                const stored = localStorage.getItem('recorderModal')
                    ? JSON.parse(localStorage.getItem('recorderModal')!)
                    : {};
                const updated = { ...stored, isOpen: action.payload };
                localStorage.setItem('recorderModal', JSON.stringify(updated));
            } catch (error) {
                console.warn('Erreur lors de la sauvegarde en localStorage:', error);
            }
            return state;
        },
        setDeleteModalContent: (
            state: GlobalState,
            action: PayloadAction<GlobalState['deleteModal']['content']>,
        ) => {
            state.deleteModal.content = action.payload;
            return state;
        },
        setErrorModalOpen: (
            state: GlobalState,
            action: PayloadAction<{
                isOpen: GlobalState['errorModal']['isOpen'];
                title: GlobalState['errorModal']['title'];
                message: GlobalState['errorModal']['message'];
            }>,
        ) => {
            state.errorModal.isOpen = action.payload.isOpen;
            state.errorModal.title = action.payload.title;
            state.errorModal.message = action.payload.message;
            return state;
        },
        setDeleteModalOpen: (
            state: GlobalState,
            action: PayloadAction<GlobalState['deleteModal']['isOpen']>,
        ) => {
            state.deleteModal.isOpen = action.payload;
            return state;
        },
        setDeleteModalClose: (state: GlobalState) => {
            state.deleteModal.isOpen = false;
            state.deleteModal.content = {
                _id: '',
                name: '',
                type: DirectoryType.Course,
            };
            return state;
        },
        setDeleteModalIsLoading: (
            state: GlobalState,
            action: PayloadAction<GlobalState['deleteModal']['isLoading']>,
        ) => {
            state.deleteModal.isLoading = action.payload;
            return state;
        },
        setErrorModalClose: (state: GlobalState) => {
            state.errorModal.isOpen = false;
            state.errorModal.message = '';
            return state;
        },
    },
});

export const {
    setNextPage,
    setNavbarEnlarged,
    setIsHalfPageIsOpen,
    setIsLessonZoomed,
    setIsRecorderOpen,
    setDeleteModalContent,
    setDeleteModalOpen,
    setDeleteModalClose,
    setDeleteModalIsLoading,
    setErrorModalOpen,
    setErrorModalClose,
} = userSlice.actions;

export default userSlice.reducer;
