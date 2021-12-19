import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	loginLoading: true,
	loginSuccess: false,
	loginFail: false,
	logoutSuccess: false,
	emailId: '',
	netStatus: true,
	cartCount: 0,
	reload: 0,
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
			state.netStatus = true;

			// state.userToken = action.payload;
			//   state.loginFail = false;
			//   state.logoutSuccess = false;
		},
		loginFailUpdate: (state) => {
			state.loginSuccess = false;
			state.loginLoading = false;
			state.loginFail = true;
			state.netStatus = true;
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
			state.loginLoading = false;
			// state.netStatus = false;
		},
		cartUpdate: (state, actions) => {
			state.cartCount = actions.payload;
			// if (actions.payload === 0) state.reload++;
		},
		reloadApp: (state) => {
			state.reload++;
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
	cartUpdate,
	reloadApp,
} = authSlice.actions;

export default authSlice.reducer;
