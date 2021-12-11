import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Text, View, Dimensions, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axiosInstance from '../axios/orgin';
import { loginOutUpdate } from '../reducers/authSlice';
import { Button } from 'react-native-paper';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

/**
 * @author
 * @function ProfileScreen
 **/
export const ProfileScreen = () => {
	const dispatch = useDispatch();
	const logoutHandler = () => {
		SecureStore.deleteItemAsync('token');
		dispatch(loginOutUpdate());
	};

	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState({});

	useEffect(async () => {
		try {
			const token = await SecureStore.getItemAsync('token');
			const res = await axiosInstance.post('/user', { token });
			// console.log(res);
			setUser(res.data);
			setLoading(false);
		} catch (e) {
			console.log(e);
			alert(e);
		}
	}, []);
	return loading ? (
		<View>
			<ActivityIndicator size="large" color="#0000ff" />
		</View>
	) : (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				width,
				height,
				flexDirection: 'column',
			}}
		>
			<View
				style={{ display: 'flex', flex: 1, backgroundColor: 'skyblue', width }}
			></View>
			<View
				style={{
					zIndex: 5,
					flex: 2,
					backgroundColor: 'white',
					width,
				}}
			>
				<View
					style={{
						display: 'flex',
						flexDirection: 'column',
						marginTop: 100,
						width: 0.9 * width,
						// backgroundColor: 'red',
						// paddingHorizontal: 20,
					}}
				>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							// justifyContent: 'space-around',
							padding: 10,
							marginVertical: 5,
						}}
					>
						<View>
							<Text style={{ fontSize: 25 }}>Name : </Text>
						</View>
						<View>
							<Text style={{ fontSize: 25 }}>
								{user.first_name + ' ' + user.last_name}
							</Text>
						</View>
					</View>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							// justifyContent: 'space-around',
							padding: 10,
							marginVertical: 5,
						}}
					>
						<View>
							<Text style={{ fontSize: 25 }}>Phone : </Text>
						</View>
						<View>
							<Text style={{ fontSize: 25 }}>{user.phone}</Text>
						</View>
					</View>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							// justifyContent: 'space-around',
							padding: 10,
							marginVertical: 5,
						}}
					>
						<View>
							<Text style={{ fontSize: 25 }}>Email : </Text>
						</View>
						<View>
							<Text style={{ fontSize: 25 }}>{user.email}</Text>
						</View>
					</View>
				</View>
				<View style={{ alignItems: 'center', marginTop: 20 }}>
					<Button
						mode="contained"
						style={{ padding: 5, width: 0.5 * width }}
						onPress={logoutHandler}
					>
						LogOut
					</Button>
				</View>
			</View>
			<View
				style={{
					position: 'absolute',
					// left: 0.4 * width,
					top: 0.17 * height,
					zIndex: 300,
					backgroundColor: 'white',
					padding: 40,
					borderRadius: 100,
				}}
			>
				<Ionicons name="md-person-sharp" size={80} color="black" />
			</View>
		</View>
	);
};
