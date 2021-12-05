import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Text, View, Button, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import axiosInstance from '../axios/orgin';
import * as SecureStore from 'expo-secure-store';
import RazorpayCheckout from 'react-native-razorpay';
import { RAZORPAY_KEY } from '../config/devProduction';

/**
 * @author
 * @function SettingsScreen
 **/
export const ProfileScreen = () => {
	const dispatch = useDispatch();
	const [form, setForm] = useState({
		first_name: '',
		last_name: '',
		address_1: '',
		address_2: '',
		city: '',
		state: '',
		postcode: '',
		country: '',
		email: '',
		phone: '',
	});

	useEffect(async () => {
		const token = await SecureStore.getItemAsync('token');
		const res = await axiosInstance.post('/user', { token });
		const json = res.data.billing;
		setForm({
			first_name: json.first_name,
			last_name: json.last_name,
			address_1: json.address_1,
			address_2: json.address_2,
			city: json.city,
			state: json.state,
			postcode: json.postcode,
			country: json.country,
			email: json.email,
			phone: json.phone,
		});
	}, []);

	const submit = async () => {
		try {
			console.log('Buy Now');
			const token = await SecureStore.getItemAsync('token');
			// console.log(form);
			let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
			if (reg.test(form.email)) {
				const res = await axiosInstance.put('/user', {
					token,
					data: {
						billing: form,
					},
				});
				const res2 = await axiosInstance.post('/user', { token });
				// console.log(token)
				// console.log(res.data)
				const json = res2.data.billing;
				if (
					json.first_name == '' ||
					json.last_name == '' ||
					json.address_1 == '' ||
					json.address_2 == '' ||
					json.city == '' ||
					json.state == '' ||
					json.postcode == '' ||
					json.country == '' ||
					json.email == '' ||
					json.phone == ''
				) {
					// alert('Please Complete Your Profile For Purchase')
					Alert.alert('Alert', 'Please Complete Your Profile For Purchase', [
						{
							text: 'Okay',
							onPress: () => console.log('Okay Pressed'),
						},
					]);
				} else {
					var cart = await SecureStore.getItemAsync('cart');
					// console.log(cart);
					cart = JSON.parse(cart);
					var item = [];
					cart.forEach((a) => {
						var b = {};
						b['courseId'] = a.ID;
						b['name'] = a.post_name;
						b['salePrice'] = a.wpCourseMeta._lp_sale_price;
						item.push(b);
					});
					// console.log(item);

					const detailToRazor = {
						payment_method: 'bacs',
						payment_method_title: 'Mobile App Direct Bank Transfer',
						customer_id: res.data.id,
						billing: json,
						courseItems: item,
					};
					// console.log(detailToRazor);
					// console.log('what');
					const order_raw = await axiosInstance.post('/orders', {
						detailToRazor,
						token,
					});
					const order = order_raw.data;
					// console.log(order);
					// console.log(order.id);
					var options = {
						description: 'OOkul Course',
						image: 'https://i.imgur.com/3g7nmJC.png',
						currency: 'INR',
						key: RAZORPAY_KEY,
						amount: (parseInt(order.total, 10) * 100).toString(),
						name: order.billing.first_name + ' ' + order.billing.last_name,
						// order_id: order.order_key, //Replace this with an order_id created using Orders API.
						prefill: {
							email: order.billing.email,
							contact: order.billing.phone,
							name: order.billing.first_name + ' ' + order.billing.last_name,
						},
						theme: { color: '#53a20e' },
					};
					RazorpayCheckout.open(options)
						.then(async (data) => {
							// handle success
							console.log(order.id);
							var bod = {
								status: 'completed',
								payment_method: 'razorpay',
								payment_method_title: 'Credit Card/Debit Card/NetBanking',
								transaction_id: data.razorpay_payment_id,
								customer_ip_address: '27.5.214.252',
								customer_user_agent:
									'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
								created_via: 'Mobile-checkout',
								customer_note: '',
								date_completed: Date.now(),
								date_paid: Date.now(),
							};
							var res = await axiosInstance.put(`/orders/${order.id}`, {
								bod,
								token,
							});
							alert(`Success: ${res.status}`);
						})
						.catch((error) => {
							// handle failure
							console.log(error);
							alert(`Error: ${error.code} | ${error.description}`);
						});
				}
				// console.log(res.data.billing);
			} else {
				alert('Enter Correct Email ID');
			}
		} catch (e) {
			console.log(e);
			alert(e);
		}
	};

	return (
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
				<TextInput
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
				/>
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
			<Button title="Submit" onPress={submit} />
		</ScrollView>
	);
};
