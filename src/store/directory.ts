import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Page } from '../interface.global';
import { Row } from '../Page/Course/interface.directory';

interface CurrentHistory {
    type: string;
    data: Row;
}

export interface DirectoryState {
    history: {
        current: CurrentHistory | null;
    };
}

const initialState: DirectoryState = {
    history: {
        current: null,
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
    },
});

export const { setCurrentHistory } = directorySlice.actions;

export default directorySlice.reducer;
