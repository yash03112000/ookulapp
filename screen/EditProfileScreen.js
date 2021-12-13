import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import axiosInstance from '../axios/orgin';
import * as SecureStore from 'expo-secure-store';

/**
 * @author
 * @function SettingsScreen
 **/
export const EditProfileScreen = () => {
	const dispatch = useDispatch();
	const [form, setForm] = useState({
		first_name: '',
		last_name: '',
		// address_1: '',
		// address_2: '',
		// city: '',
		// state: '',
		// postcode: '',
		// country: '',
		email: '',
		phone: '',
	});

	const [load, setLoad] = useState(true);

	useEffect(async () => {
		const token = await SecureStore.getItemAsync('token');
		const res = await axiosInstance.post('/user', { token });
		const json = res.data;
		// console.log(json);
		setForm({
			first_name: json.first_name,
			last_name: json.last_name,
			// address_1: json.address_1,
			// address_2: json.address_2,
			// city: json.city,
			// state: json.state,
			// postcode: json.postcode,
			// country: json.country,
			email: json.email,
			phone: json.billing.phone,
		});
		setLoad(false);
	}, []);

	const submit = async () => {
		try {
			setLoad(true);
			console.log('clicked');
			const token = await SecureStore.getItemAsync('token');
			console.log(form);
			let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
			if (reg.test(form.email)) {
				const res = await axiosInstance.put('/user', {
					token,
					data: {
						first_name: form.first_name,
						last_name: form.last_name,
						email: form.email,
						billing: {
							phone: form.phone,
						},
					},
				});
				console.log(res.data);
			} else {
				alert('Enter Correct Email ID');
			}
			setLoad(false);
		} catch (e) {
			console.log(e);
			alert(e);
		}
	};

	return load ? (
		<ActivityIndicator size="large" color="#0000ff" />
	) : (
		<ScrollView>
			{/* <Text>Profile Screen!</Text> */}
			{/* <Button title="Sign out" onPress={logoutHandler} /> */}
			<View>
				<TextInput
					label="First Name*"
					value={form.first_name}
					mode="outlined"
					onChangeText={(text) =>
						setForm((prev) => ({ ...prev, ['first_name']: text }))
					}
				/>
				<TextInput
					label="Last Name*"
					value={form.last_name}
					mode="outlined"
					onChangeText={(text) =>
						setForm((prev) => ({ ...prev, ['last_name']: text }))
					}
				/>
				{/* <TextInput
					label="address_1*"
					value={form.address_1}
					mode="outlined"
					onChangeText={(text) =>
						setForm((prev) => ({ ...prev, ['address_1']: text }))
					}
				/>
				<TextInput
					label="address_2*"
					value={form.address_2}
					mode="outlined"
					onChangeText={(text) =>
						setForm((prev) => ({ ...prev, ['address_2']: text }))
					}
				/>
				<TextInput
					label="City*"
					value={form.city}
					mode="outlined"
					onChangeText={(text) =>
						setForm((prev) => ({ ...prev, ['city']: text }))
					}
				/>
				<TextInput
					label="State*"
					value={form.state}
					mode="outlined"
					onChangeText={(text) =>
						setForm((prev) => ({ ...prev, ['state']: text }))
					}
				/>
				<TextInput
					label="Postcode*"
					value={form.postcode}
					mode="outlined"
					onChangeText={(text) =>
						setForm((prev) => ({ ...prev, ['postcode']: text }))
					}
				/>
				<TextInput
					label="Country*"
					value={form.country}
					mode="outlined"
					onChangeText={(text) =>
						setForm((prev) => ({ ...prev, ['country']: text }))
					}
				/> */}
				<TextInput
					label="Email*"
					value={form.email}
					mode="outlined"
					onChangeText={(text) =>
						setForm((prev) => ({ ...prev, ['email']: text }))
					}
				/>
				<TextInput
					label="Phone*"
					value={form.phone}
					mode="outlined"
					onChangeText={(text) =>
						setForm((prev) => ({ ...prev, ['phone']: text }))
					}
				/>
			</View>
			<Button
				onPress={submit}
				mode="contained"
				style={{ padding: 5, margin: 5 }}
			>
				Submit
			</Button>
		</ScrollView>
	);
};
