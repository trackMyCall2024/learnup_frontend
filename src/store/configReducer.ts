import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user";
import globalReducer from "./global";
import directoryReducer from "./directory";

export const store = configureStore({
    reducer: {
        global: globalReducer,
        user: userReducer,
        directory: directoryReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
});

export type RootState = ReturnType<typeof store.getState>;