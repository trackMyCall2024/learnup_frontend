import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum Role {
    Admin = "admin",
    User = "user"
}

export enum Sub {
    freemium = "freemium",
    smartPlus = "smart+",
    smartPremium = "smart premium",
}

export interface Subscription {
    name: Sub;
    isActivate: boolean;
}

export interface University {
    name: string;
    educationName: string;
    educationLevel: number;
}

export interface Location {
    country: string;
    city: string;
}

export interface UserState {
    _id: string;
    email: string;
    firstname: string;
    lastname: string;
    age: number;
    role: "user" | "admin";
    sub: Subscription;
    university: University;
    location: Location;
}

const initialState: UserState = {
    _id: '684bee907d050341b200b5fa',
    email: 'feltenezechiel1@gmail.com',
    firstname: 'Ezechiel',
    lastname: 'Felten',
    age: 22,
    role: Role.User,
    sub: {
        name: Sub.freemium,
        isActivate: true,
    },
    university: {
        name: 'Hetic',
        educationName: 'Bachelor informatique',
        educationLevel: 3
    },
    location: {
        country: 'France',
        city: 'Paris',
    }
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state: UserState, action: PayloadAction<{ user: UserState }>) => {
            state = action.payload.user;
            return state;
        },
    },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
