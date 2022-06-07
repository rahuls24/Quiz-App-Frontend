import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface AuthState {
	isAuthorize: boolean;
	token: string | null | undefined;
}
const initialState: AuthState = {
	isAuthorize: false,
	token: null,
};
export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		authorizeUser: (state, action: PayloadAction<string>) => {
            console.log(action.payload)
			state.isAuthorize = true;
			state.token = action.payload;
		},
		unauthorizedUser: state => {
			state.isAuthorize = false;
			state.token = null;
		},
	},
});
export const { authorizeUser, unauthorizedUser } = authSlice.actions;

export const selectIsAuthorize = (state: RootState) => state.auth.isAuthorize;
export const selectAuthToken = (state: RootState) => state.auth.token;

export default authSlice.reducer;
