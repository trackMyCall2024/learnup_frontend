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
            title: Page| RowPage | null;
        };
        next: {
            _id: string; // Next course ID, chapter ID, section ID to get data
            title: Page| RowPage | null;
            isOpen: boolean;
        };
    };
}

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
    },
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
        setPreviousPage: (state: GlobalState, action: PayloadAction<GlobalState['page']['previous']>) => {
            state.page.previous = action.payload;
            return state;
        },
    },
});

export const { setCurrentPage, setNextPage, setPreviousPage } = userSlice.actions;

export default userSlice.reducer;
