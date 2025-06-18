import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Page } from '../interface.global';
import { Row } from '../Page/Course/interface.directory';

interface CurrentHistory {
    type: string;
    data: Row;
}

export interface CurrentItemId {
    [Page.Courses]: string;
    [Page.Chapters]: string;
    [Page.Sections]: string;
}

export interface DirectoryState {
    history: {
        current: CurrentHistory | null;
    };
    currentItemId: CurrentItemId;
}

const initialState: DirectoryState = {
    history: {
        current: null,
    },
    currentItemId: {
        [Page.Courses]: '',
        [Page.Chapters]: '',
        [Page.Sections]: '',
    },
};

export const directorySlice = createSlice({
    name: 'directory',
    initialState,
    reducers: {
        setCurrentHistory: (
            state: DirectoryState,
            action: PayloadAction<DirectoryState['history']['current']>,
        ) => {
            state.history.current = action.payload;
            return state;
        },

        setCurrentItem: (
            state: DirectoryState,
            action: PayloadAction<Partial<DirectoryState['currentItemId']>>,
        ) => {
            const newCurrentItemId = action.payload;
            state.currentItemId = { ...state.currentItemId, ...newCurrentItemId };
            return state;
        },
    },
});

export const { setCurrentHistory, setCurrentItem } = directorySlice.actions;

export default directorySlice.reducer;
