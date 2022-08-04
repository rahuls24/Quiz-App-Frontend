import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@ReduxStore/store';

export interface IAuthAlertState {
    flag: boolean;
    severity: 'error' | 'warning' | 'success';
    autoHideDuration: number;
}
export interface IUSerDetails {
    _id: string;
    name: string;
    email: string;
    role: 'examiner' | 'examinee';
    isVerified: boolean;
}

export interface AuthState {
    isAuthorize: boolean;
    token: string | null | undefined;
    authAlertMsg: string;
    authAlertState: {
        flag: boolean;
        severity: 'error' | 'warning' | 'success';
        autoHideDuration: number;
    };
    userDetails: null | IUSerDetails;
}
const initialState: AuthState = {
    isAuthorize: false,
    token: null,
    authAlertMsg: 'Something went Wrong',
    authAlertState: {
        flag: false,
        severity: 'error',
        autoHideDuration: 6000,
    },
    userDetails: null,
};
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authorizeUser: (state, action: PayloadAction<string>) => {
            state.isAuthorize = true;
            state.token = action.payload;
        },
        unauthorizedUser: (state) => {
            state.isAuthorize = false;
            state.token = null;
        },
        setAuthAlertMsg: (state, action: PayloadAction<string>) => {
            state.authAlertMsg = action.payload;
        },
        setAuthAlertState: (state, action: PayloadAction<IAuthAlertState>) => {
            state.authAlertState = action.payload;
        },
        setUserDetails: (state, action) => {
            state.userDetails = action.payload;
        },
    },
});
export const {
    authorizeUser,
    unauthorizedUser,
    setAuthAlertMsg,
    setAuthAlertState,
    setUserDetails,
} = authSlice.actions;

export const selectIsAuthorize = (state: RootState) => state.auth.isAuthorize;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthAlertMsg = (state: RootState) => state.auth.authAlertMsg;
export const selectAuthAlertState = (state: RootState) =>
    state.auth.authAlertState;
export const selectUserDetails = (state: RootState) => state.auth.userDetails;
export default authSlice.reducer;
