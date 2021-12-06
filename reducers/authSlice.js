import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	loginLoading: false,
	loginSuccess: false,
	loginFail: false,
	logoutSuccess: false,
	emailId: '',
	netStatus: true,
};

const authSlice = createSlice({
	name: 'login-logout',
	initialState,
	reducers: {
		loginLoadingUpdate: (state) => {
			state.loginLoading = true;
		},
		loginSuccessUpdate: (state) => {
			state.loginLoading = false;
			state.loginSuccess = true;
			// state.userToken = action.payload;
			//   state.loginFail = false;
			//   state.logoutSuccess = false;
		},
		loginFailUpdate: (state) => {
			state.loginSuccess = false;
			state.loginLoading = false;
			state.loginFail = true;
		},
		loginOutUpdate: (state) => {
			state.loginSuccess = false;
			state.logoutSuccess = true;
			state.emailId = '';
		},
		emailIdUpdate: (state, actions) => {
			state.emailId = actions.payload;
		},
		netUpdate: (state, actions) => {
			// console.log(actions.payload);
			state.netStatus = actions.payload;
			// state.netStatus = false;
		},
	},
});
export const {
	loginLoadingUpdate,
	loginSuccessUpdate,
	loginFailUpdate,
	loginOutUpdate,
	emailIdUpdate,
	netUpdate,
} = authSlice.actions;

export default authSlice.reducer;
