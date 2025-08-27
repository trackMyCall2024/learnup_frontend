import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Page } from '../interface.global';

const path = `${window.location.origin}${window.location.pathname}`;
const currentPage = path.split('/')[3] ?? Page.Dashboard;

export interface GlobalState {
    page: {
        current: {
            title: Page;
        };
        previous: {
            _id: string; // Previous course ID, chapter ID, section ID to get data
            title: Page | RowPage | null;
        };
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
        current: {
            title: currentPage as Page,
        },
        previous: {
            _id: '',
            title: null,
        },
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
};

export type RowPage = Page.Courses | Page.Chapters | Page.Sections;

export const userSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        // TODO - merge 3 methods to 1 method -> set with switch case
        setCurrentPage: (
            state: GlobalState,
            action: PayloadAction<GlobalState['page']['current']>,
        ) => {
            state.page.current = action.payload;
            return state;
        },
        // Half page
        setNextPage: (state: GlobalState, action: PayloadAction<GlobalState['page']['next']>) => {
            state.page.next = action.payload;
            return state;
        },
        setPreviousPage: (
            state: GlobalState,
            action: PayloadAction<GlobalState['page']['previous']>,
        ) => {
            state.page.previous = action.payload;
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
    },
});

export const {
    setCurrentPage,
    setNextPage,
    setPreviousPage,
    setNavbarEnlarged,
    setIsHalfPageIsOpen,
    setIsLessonZoomed,
    setIsRecorderOpen,
} = userSlice.actions;

export default userSlice.reducer;
