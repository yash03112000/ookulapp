import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button, List } from 'react-native-paper';
import RazorpayCheckout from 'react-native-razorpay';
import { RAZORPAY_KEY } from '../config/devProduction';
import axiosInstance from '../axios/orgin';
import * as SecureStore from 'expo-secure-store';

/**
 * @author
 * @function CourseDetails
 **/
export const BuyCart = ({ navigation, data }) => {
	// console.log("wpcoursemeta", wpCourseMeta);

	const buyNowHandler = async () => {
		console.log('you clicked buynow button');
		//prepare detail to send razorpay

		try {
			const token = await SecureStore.getItemAsync('token');
			const res = await axiosInstance.post('/user', { token });
			// console.log(token)
			// console.log(res.data)
			const json = res.data.billing;
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
						text: 'Not Now',
						onPress: () => console.log('Cancel Pressed'),
						style: 'cancel',
					},
					{
						text: 'Go To Setting',
						onPress: () => {
							navigation.navigate('Settings', {
								screen: 'ProfileScreen',
							});
						},
					},
				]);
			} else {
				const detailToRazor = {
					payment_method: 'bacs',
					payment_method_title: 'Mobile App Direct Bank Transfer',
					customer_id: res.data.id,
					billing: json,
					courseItems: [
						{
							courseId: data.ID,
							name: data.post_name,
							salePrice: data.wpCourseMeta._lp_sale_price,
						},
					],
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
		} catch (e) {
			console.log(e);
			alert(e);
		}
		//
		// alert(`buyNowHandler Clicked`);
	};

	// const addToCartHandler = () => {
	//   // navigation.navigate("Cart", { courseId: "courseId" });
	// };

	return (
		<View>
			<View>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-around',
						alignContent: 'center',
						alignItems: 'center',
						margin: 2,
						fontSize: 25,
					}}
				>
					<Text style={{ fontSize: 25 }}>Price:</Text>
					<Text
						style={{
							textDecorationLine: 'line-through',
							textDecorationStyle: 'solid',
						}}
					>
						{'\u20B9'}
						{data.wpCourseMeta._lp_price}
					</Text>
					<Text style={{ fontSize: 25 }}>
						{'\u20B9'}
						{data.wpCourseMeta._lp_sale_price}
					</Text>
				</View>
				<View style={{ margin: 2 }}>
					<Button
						onPress={buyNowHandler}
						mode="contained"
						style={{ padding: 5 }}
					>
						BUY NOW
					</Button>
					{/* <View>
            <Button
              onPress={addToCartHandler}
              style={{ borderColor: "#2596be", borderWidth: 2, margin: 2 }}
              mode="outlined"
              icon="cart"
            >
              ADD to CART
            </Button>
          </View> */}
				</View>
			</View>
		</View>
	);
};
