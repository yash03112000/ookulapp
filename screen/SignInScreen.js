import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
	ActivityIndicator,
	Colors,
	TextInput,
	Button,
	Divider,
} from 'react-native-paper';
import { GOOGLE_CLIENT_ID } from '../config/devProduction';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import axiosInstance from '../axios/orgin';
import { useDispatch } from 'react-redux';
import { loginSuccessUpdate } from '../reducers/authSlice';
import * as SecureStore from 'expo-secure-store';

const useProxy = false;
const redirectUri = AuthSession.makeRedirectUri({
	useProxy,
});

console.log(GOOGLE_CLIENT_ID);
WebBrowser.maybeCompleteAuthSession();

export const SignInScreen = (props) => {
	const dispatch = useDispatch();

	const [request, response, promptAsync] = Google.useAuthRequest({
		// expoClientId: GOOGLE_CLIENT_ID,
		// iosClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
		androidClientId: GOOGLE_CLIENT_ID,
		// webClientId:GOOGLE_CLIENT_ID,
	});

	const tokenFromServer = (access_token, user) => {
		// console.log("hello form start of tokenfrom server", access_token);
		console.log(user);
		axiosInstance
			.post('/user/googlelogin/android', { access_token, user })
			.then(async (userDataFromBackEnd) => {
				const jwtUserToken = await SecureStore.setItemAsync(
					'token',
					userDataFromBackEnd.data.jwtToken
					// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6NTk0LCJlbWFpbCI6InZpcG5rckBnbWFpbC5jb20iLCJuYW1lIjoidmlwaW4ga3VtYXIiLCJpYXQiOjE2MzU1MjI2Mzd9.XSoKcC_KnkuLXoff3BHsZItI8AzpM4N-y2wjTG8rdXI"
				);
				dispatch(loginSuccessUpdate());
				console.log(
					'userDataFromBackEnd.data.isUserInDB<<',
					userDataFromBackEnd.data.isUserInDB,
					userDataFromBackEnd.data.jwtToken
				);
				// console.log("jwt token received from backend", UserDataFromBackEnd.data);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	React.useEffect(async () => {
		if (response?.type === 'success') {
			const { authentication } = response;
			// console.log(authentication);
			initial(authentication.accessToken);
		}
	}, [response]);

	const initial = async (accessToken) => {
		// console.log(accessToken);
		try {
			const userInfoResponse = await fetch(
				'https://www.googleapis.com/userinfo/v2/me',
				{
					headers: { Authorization: `Bearer ${accessToken}` },
				}
			);
			const user = await userInfoResponse.json();
			// console.log(authentication.accessToken)
			const token = await tokenFromServer(accessToken, user);
			// var res = await fetch(`/auth/googleapp`, {
			//   method: 'POST',
			//   headers: {
			//     'Content-Type': 'application/json',
			//   },
			//   body: JSON.stringify({ profile: user, accessToken }),
			// });
			// res = await res.json();
			// console.log(res);
			// AsyncStorage.setItem('token', res.accesstoken).then(() => {
			//   navigation.replace('Tab');
			// });
		} catch (e) {
			console.log(e);
		}
	};

	// console.log(response);

	const google = async () => {
		promptAsync({ useProxy });
	};

	return (
		<View style={styles.container}>
			<Text style={styles.msg}>Welcome to OOkul</Text>
			<Text style={styles.header}>Select to Login</Text>
			<Divider />
			<View style={styles.btnbox}>
				{/* <Button
          mode="contained"
          style={styles.fb}
          icon="facebook"
          onPress={facebook}
        >
          SignIn with FaceBook
        </Button> */}
				<Button
					mode="contained"
					color="black"
					style={styles.google}
					icon="google"
					onPress={google}
				>
					SignIn with Google
				</Button>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	loginContainer: {
		marginTop: 100,
	},
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
	},
	msg: {
		color: '#0088cc',
		fontWeight: 'bold',
		fontSize: 35,
		marginBottom: '20%',
	},
	header: {
		color: 'black',
		fontWeight: 'bold',
		fontSize: 10,
		// flex:1
	},
	fb: {
		backgroundColor: '#1A538A',
		width: 250,
		color: 'white',
		marginBottom: 5,
	},
	google: {
		backgroundColor: '#3F7EE8',
		width: 250,
		color: 'black',
	},
	submit: {
		backgroundColor: '#A436F1',
		width: 250,
		color: 'black',
		marginTop: 20,
	},
	main: {
		// backgroundColor:'green',
		width: 250,
	},
	btnbox: {
		display: 'flex',
		flexDirection: 'column',
		margin: 5,
		// backgroundColor:'green',
		// flex:1
		// marginTop:20,
		// marginBottom:10
	},
});
