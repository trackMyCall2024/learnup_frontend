import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Page } from '../interface.global';

const path = `${window.location.origin}${window.location.pathname}`;
const currentPage = path.split('/')[3] ?? Page.Dashboard;

export interface GlobalState {
    page: {
        current: {
            title: Page;
        };
        next: {
            _id: string; // Next course ID, chapter ID, section ID to get data
            title: RowPage|null;
            isOpen: boolean;
        };
    };
    history: {
        [Page.Courses]: boolean;
        [Page.Chapters]: boolean;
        [Page.Sections]: boolean;
    };
}

const initialState: GlobalState = {
    page: {
        current: {
            title: currentPage as Page,
        },
        next: {
            _id: '',
            title: null,
            isOpen: false,
        },
    },
    history: {
        [Page.Courses]: false,
        [Page.Chapters]: false,
        [Page.Sections]: false,
    },
};

export type RowPage = Page.Courses | Page.Chapters | Page.Sections;

export const userSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setCurrentPage: (state: GlobalState, action: PayloadAction<GlobalState['page']['current']>) => {
            state.page.current = action.payload;
            return state;
        },
        setNextPage: (state: GlobalState, action: PayloadAction<GlobalState['page']['next']>) => {
            state.page.next = action.payload;
            return state;
        },
        setHistory: (
            state: GlobalState,
            action: PayloadAction<{ updatedPage: RowPage; haveHistory: boolean }>,
        ) => {
            state.history[action.payload.updatedPage] = action.payload.haveHistory;
            return state;
        },
    },
});

export const { setCurrentPage, setNextPage } = userSlice.actions;

export default userSlice.reducer;
