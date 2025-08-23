import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Row } from '../Page/Course/interface.directory';

export interface RecordManagerState {
    selectedCourseId: string | null;
    selectedChapterId: string | null;
    courses: Row[];
    chapters: Row[];
    isLoadingCourses: boolean;
    isLoadingChapters: boolean;
    isModalOpen: boolean;
}

const initialState: RecordManagerState = {
    selectedCourseId: null,
    selectedChapterId: null,
    courses: [],
    chapters: [],
    isLoadingCourses: false,
    isLoadingChapters: false,
    isModalOpen: false,
};

export const recordManagerSlice = createSlice({
    name: 'recordManager',
    initialState,
    reducers: {
        setSelectedCourseId: (state, action: PayloadAction<string | null>) => {
            state.selectedCourseId = action.payload;
            // Reset chapter selection when course changes
            state.selectedChapterId = null;
            state.chapters = [];
        },
        setSelectedChapterId: (state, action: PayloadAction<string | null>) => {
            state.selectedChapterId = action.payload;
        },
        setCourses: (state, action: PayloadAction<Row[]>) => {
            state.courses = action.payload;
        },
        setChapters: (state, action: PayloadAction<Row[]>) => {
            state.chapters = action.payload;
        },
        setLoadingCourses: (state, action: PayloadAction<boolean>) => {
            state.isLoadingCourses = action.payload;
        },
        setLoadingChapters: (state, action: PayloadAction<boolean>) => {
            state.isLoadingChapters = action.payload;
        },
        setModalOpen: (state, action: PayloadAction<boolean>) => {
            state.isModalOpen = action.payload;
        },
        resetRecordManager: (state) => {
            state.selectedCourseId = null;
            state.selectedChapterId = null;
            state.chapters = [];
            state.isModalOpen = false;
        },
    },
});

export const {
    setSelectedCourseId,
    setSelectedChapterId,
    setCourses,
    setChapters,
    setLoadingCourses,
    setLoadingChapters,
    setModalOpen,
    resetRecordManager,
} = recordManagerSlice.actions;

export default recordManagerSlice.reducer;
