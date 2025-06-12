import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {}

const initialState: UserState = {};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state: UserState, action: PayloadAction<{ user: UserState }>) => {
            state = action.payload.user;
            return state;
        },
        getUser: (state: UserState) => state,
    },
});

export const { setUser, getUser } = userSlice.actions;

export default userSlice.reducer;
