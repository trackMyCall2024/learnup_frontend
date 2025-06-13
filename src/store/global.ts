import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Page } from "../interface.global";

export interface GlobalState {
    page: {
        title: string,
        index: number
    }
}

const initialState: GlobalState = {
    page: {
        title: Page.Courses,
        index: 1
    }
};

export const userSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setPage: (state: GlobalState, action: PayloadAction<GlobalState['page']>) => {
            state.page = action.payload;
            return state;
        },
    },
});

export const { setPage } = userSlice.actions;

export default userSlice.reducer;
