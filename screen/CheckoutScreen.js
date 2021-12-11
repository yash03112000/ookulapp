import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Text, View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Divider, Button } from 'react-native-paper';
import axiosInstance from '../axios/orgin';
import * as SecureStore from 'expo-secure-store';
import RazorpayCheckout from 'react-native-razorpay';
import { RAZORPAY_KEY } from '../config/devProduction';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { cartUpdate } from '../reducers/authSlice';
import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;

export const CheckoutScreen = () => {
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
	const navigation = useNavigation();
	const [loading, setLoading] = useState(true);
	const [cart, setCart] = useState([]);
	const [couponDiscount, setCouponDiscount] = useState(0.0);
	const [coupon, setCoupon] = useState('');

	useEffect(async () => {
		try {
			if (isFocused) {
				var cart = await SecureStore.getItemAsync('cart');
				cart = JSON.parse(cart);
				setCart(cart);
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
				setLoading(false);
			}
		} catch (e) {
			alert(e);
			console.log(e);
		}
	}, [isFocused]);

	const isFocused = useIsFocused();

	const removeFromCartHandler = async () => {
		console.log('you clicked remove from Cart button');
		// navigation.push('Home', {
		// 	screen: 'Cart',
		// });
		try {
			// var cart = await SecureStore.getItemAsync('cart');
			await SecureStore.setItemAsync('cart', JSON.stringify([]));
			dispatch(cartUpdate(0));
			navigation.navigate('My Courses');
			setLoading(false);
		} catch (e) {
			console.log(e);
		}

		//prepare detail to send razorpay
	};

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
					const amount = (parseInt(order.total, 10) * 100).toString();
					var options = {
						description: 'OOkul Course',
						image: 'https://i.imgur.com/3g7nmJC.png',
						currency: 'INR',
						key: RAZORPAY_KEY,
						amount: amount,
						name: order.billing.first_name + ' ' + order.billing.last_name,
						// order_id: order.order_key, //Replace this with an order_id created using Orders API.
						prefill: {
							email: order.billing.email,
							contact: order.billing.phone,
							name: order.billing.first_name + ' ' + order.billing.last_name,
						},
						theme: { color: '#53a20e' },
					};
					if (amount > 0) {
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
								bod['token'] = token;
								// console.log(bod);
								setLoading(true);

								var res = await axiosInstance.put(`/orders/${order.id}`, bod);
								// alert(`Success: ${res.status}`);
								if (res.status == 200) {
									removeFromCartHandler();
								}
							})
							.catch((error) => {
								// handle failure
								console.log(error);
								alert(`Error: ${error.code} | ${error.description}`);
							});
					} else {
						var bod = {
							status: 'completed',
							payment_method: 'Free Course',
							payment_method_title: 'Free Course',
							transaction_id: 'Free Course',
							customer_ip_address: '27.5.214.252',
							customer_user_agent:
								'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
							created_via: 'Mobile-checkout',
							customer_note: '',
							date_completed: Date.now(),
							date_paid: Date.now(),
						};
						bod['token'] = token;
						// console.log(bod);
						setLoading(true);

						var update = await axiosInstance.put(`/orders/${order.id}`, bod);
						if (update.status == 200) {
							removeFromCartHandler();
						}
					}
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

	const price = () => {
		var sum = 0;
		cart.forEach((item) => {
			sum += parseFloat(item.wpCourseMeta._lp_price);
		});
		return sum;
	};
	const salePrice = () => {
		var sum = 0;
		cart.forEach((item) => {
			sum += parseFloat(item.wpCourseMeta._lp_sale_price);
		});
		return sum;
	};

	return loading ? (
		<View>
			<ActivityIndicator size="large" color="#0000ff" />
		</View>
	) : (
		<ScrollView>
			<View
				style={{
					display: 'flex',
					flexDirection: 'column',
					// backgroundColor: 'red',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<View
					style={{
						width: 0.95 * width,
						// backgroundColor: 'blue',
						overflow: 'hidden',
					}}
				>
					{cart.map((item, i) => {
						return (
							<View
								key={i}
								style={{
									paddingVertical: 20,
									backgroundColor: 'white',
									marginVertical: 5,
								}}
							>
								<View
									style={{
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'space-between',
										marginVertical: 10,
										paddingHorizontal: 5,
									}}
								>
									<View style={{ flex: 1 }}>
										<Text style={{ fontWeight: 'bold', fontSize: 17 }}>
											Product:
										</Text>
									</View>
									<View style={{ flex: 3 }}>
										<Text style={{ fontSize: 15 }}>{item.post_name}</Text>
									</View>
								</View>
								<View
									style={{
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'space-between',
										paddingHorizontal: 5,
									}}
								>
									<View style={{ flex: 1 }}>
										<Text style={{ fontWeight: 'bold', fontSize: 17 }}>
											Total:
										</Text>
									</View>
									<View
										style={{
											flex: 3,
											alignItems: 'flex-end',
										}}
									>
										<Text style={{ fontSize: 15 }}>
											{'\u20B9'}
											{item.wpCourseMeta._lp_sale_price}
										</Text>
									</View>
								</View>
							</View>
						);
					})}
				</View>
				<View
					style={{
						width: 0.95 * width,
						overflow: 'hidden',
						marginVertical: 5,
						backgroundColor: 'white',
					}}
				>
					<View>
						<Text
							style={{
								fontSize: 17,
								color: 'grey',
								padding: 10,
								fontWeight: 'bold',
							}}
						>
							PRICE DETAILS
						</Text>
					</View>
					<Divider />
					<View>
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
								marginVertical: 10,
							}}
						>
							<View style={{ flex: 1 }}>
								<Text style={{ fontWeight: 'bold', fontSize: 17, padding: 10 }}>
									Price:
								</Text>
							</View>
							<View style={{ flex: 3, alignItems: 'flex-end' }}>
								<Text style={{ fontSize: 17, padding: 10 }}>
									{'\u20B9'} {price()}
								</Text>
							</View>
						</View>
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
								marginVertical: 10,
							}}
						>
							<View style={{ flex: 1 }}>
								<Text style={{ fontWeight: 'bold', fontSize: 17, padding: 10 }}>
									Discount:
								</Text>
							</View>
							<View style={{ flex: 3, alignItems: 'flex-end' }}>
								<Text
									style={{
										fontSize: 17,
										padding: 10,
										color: 'green',
									}}
								>
									{'\u20B9'}
									{price() - salePrice() + couponDiscount}
								</Text>
							</View>
						</View>
					</View>
					<Divider />
					<View>
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
								marginVertical: 10,
							}}
						>
							<View style={{ flex: 1 }}>
								<Text style={{ fontWeight: 'bold', fontSize: 17, padding: 10 }}>
									Total Price:
								</Text>
							</View>
							<View style={{ flex: 3, alignItems: 'flex-end' }}>
								<Text style={{ fontSize: 17, padding: 10, fontWeight: 'bold' }}>
									{'\u20B9'}
									{salePrice() - couponDiscount}
								</Text>
							</View>
						</View>
					</View>
				</View>
				<View
					style={{
						width: 0.95 * width,
						overflow: 'hidden',
						marginVertical: 5,
						backgroundColor: 'white',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<View style={{ flex: 1, marginHorizontal: 5 }}>
						<TextInput
							label="Coupon Code"
							value={coupon}
							mode="outlined"
							onChangeText={(text) => setCoupon(text)}
							style={{ height: 40 }}
						/>
					</View>
					<View style={{ flex: 1 }}>
						<Button
							style={{ height: 40 }}
							mode="contained"
							onPress={() => {
								alert('Soon');
							}}
						>
							Apply Coupon
						</Button>
					</View>
				</View>
				<View
					style={{
						width: 0.95 * width,
						overflow: 'hidden',
						marginVertical: 5,
						backgroundColor: 'white',
					}}
				>
					<View>
						<Text
							style={{
								fontSize: 17,
								color: 'grey',
								padding: 10,
								fontWeight: 'bold',
							}}
						>
							BILLING DETAILS
						</Text>
					</View>
					<Divider />
					<View>
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								// justifyContent: 'space-between',
								marginTop: 5,
								marginBottom: 1,
							}}
						>
							<View style={{ flex: 1 }}>
								<TextInput
									label="First Name*"
									value={form.first_name}
									mode="outlined"
									onChangeText={(text) =>
										setForm((prev) => ({ ...prev, ['first_name']: text }))
									}
								/>
							</View>
							<View style={{ flex: 1 }}>
								<TextInput
									label="Last Name*"
									value={form.last_name}
									mode="outlined"
									onChangeText={(text) =>
										setForm((prev) => ({ ...prev, ['last_name']: text }))
									}
								/>
							</View>
						</View>
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								// justifyContent: 'space-between',
								marginVertical: 1,
							}}
						>
							<View style={{ flex: 1 }}>
								<TextInput
									label="address_1"
									value={form.address_1}
									mode="outlined"
									onChangeText={(text) =>
										setForm((prev) => ({ ...prev, ['address_1']: text }))
									}
								/>
							</View>
						</View>
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								// justifyContent: 'space-between',
								marginVertical: 1,
							}}
						>
							<View style={{ flex: 1 }}>
								<TextInput
									label="address_2"
									value={form.address_2}
									mode="outlined"
									onChangeText={(text) =>
										setForm((prev) => ({ ...prev, ['address_2']: text }))
									}
								/>
							</View>
						</View>
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								// justifyContent: 'space-between',
								marginTop: 5,
								marginBottom: 1,
							}}
						>
							<View style={{ flex: 1 }}>
								<TextInput
									label="City"
									value={form.city}
									mode="outlined"
									onChangeText={(text) =>
										setForm((prev) => ({ ...prev, ['city']: text }))
									}
								/>
							</View>
							<View style={{ flex: 1 }}>
								<TextInput
									label="State*"
									value={form.state}
									mode="outlined"
									onChangeText={(text) =>
										setForm((prev) => ({ ...prev, ['state']: text }))
									}
								/>
							</View>
						</View>
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								// justifyContent: 'space-between',
								marginTop: 5,
								marginBottom: 1,
							}}
						>
							<View style={{ flex: 1 }}>
								<TextInput
									label="Postcode*"
									value={form.postcode}
									mode="outlined"
									onChangeText={(text) =>
										setForm((prev) => ({ ...prev, ['postcode']: text }))
									}
								/>
							</View>
							<View style={{ flex: 1 }}>
								<TextInput
									label="Country*"
									value={form.country}
									mode="outlined"
									onChangeText={(text) =>
										setForm((prev) => ({ ...prev, ['country']: text }))
									}
								/>
							</View>
						</View>
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								// justifyContent: 'space-between',
								marginTop: 5,
								marginBottom: 1,
							}}
						>
							<View style={{ flex: 1 }}>
								<TextInput
									label="Email*"
									value={form.email}
									mode="outlined"
									onChangeText={(text) =>
										setForm((prev) => ({ ...prev, ['email']: text }))
									}
								/>
							</View>
							<View style={{ flex: 1 }}>
								<TextInput
									label="Phone*"
									value={form.phone}
									mode="outlined"
									onChangeText={(text) =>
										setForm((prev) => ({ ...prev, ['phone']: text }))
									}
								/>
							</View>
						</View>
					</View>
				</View>
				<View
					style={{
						width: 0.95 * width,
						overflow: 'hidden',
						marginVertical: 5,
						backgroundColor: 'white',
					}}
				>
					<Button style={{ padding: 5 }} mode="contained" onPress={submit}>
						Place Order
					</Button>
				</View>
			</View>
		</ScrollView>
	);
};
