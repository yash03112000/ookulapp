import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button, List } from 'react-native-paper';
import { CourseAccess } from '../components/CourseAccess';
import axiosInstance from '../axios/orgin';
import * as SecureStore from 'expo-secure-store';
import { useSelector, useDispatch } from 'react-redux';
import { cartUpdate, reloadApp } from '../reducers/authSlice';

/**
 * @author
 * @function CourseDetails
 **/
export const BuyCart = ({ navigation, data, enrolled, cart, pageScreen }) => {
	// console.log("wpcoursemeta", wpCourseMeta);

	const [status, setStatus] = useState('');
	const dispatch = useDispatch();
	const reload = useSelector((state) => state.auth.reload);
	// console.log(reload);

	useEffect(async () => {
		try {
			if (enrolled) setStatus('done');
			else {
				// var cart = await SecureStore.getItemAsync('cart');
				// // console.log(cart);
				// cart = JSON.parse(cart);
				// console.log(cart);

				if (cart) {
					if (cart.filter((e) => e.ID === data.ID).length > 0) {
						// setInCart(true);
						setStatus('go');
					} else {
						// setInCart(false);
						setStatus('add');
					}
				} else {
					// setInCart(false);
					setStatus('add');
				}
			}
		} catch (e) {
			console.log(e);
		}
	}, [reload]);

	const enter = () => {
		// console.log("start of single course screen", pageScreen);

		// console.log(data);
		// console.log(pageScreen);

		navigation.navigate(pageScreen, data);
		// navigation.push("coursescreen", {
		//   // screen: 'Test',
		//   params: { id: data.slug },
		// });
	};

	const goToCartHandler = async () => {
		console.log('you clicked Go to Cart button');
		navigation.navigate('Home', {
			screen: 'Cart',
		});
	};

	const addToCartHandler = async () => {
		console.log('you clicked Add to Cart button');
		// navigation.push('Home', {
		// 	screen: 'Cart',
		// });
		try {
			var cart = await SecureStore.getItemAsync('cart');
			console.log(cart);
			cart = JSON.parse(cart);
			// console.log(cart);
			if (cart) {
				if (cart.filter((e) => e.ID === data.ID).length > 0) {
					alert('Already In Cart');
				} else {
					// console.log(data);
					cart.push(data);
					await SecureStore.setItemAsync('cart', JSON.stringify(cart));
					// setInCart(true);
					setStatus('go');
					dispatch(cartUpdate(cart.length));
				}
			} else {
				// console.log(data);
				cart = [];
				cart.push(data);
				await SecureStore.setItemAsync('cart', JSON.stringify(cart));
				// setInCart(true);
				setStatus('go');
				dispatch(cartUpdate(cart.length));
			}
		} catch (e) {
			console.log(e);
		}
	};

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
					{status == 'go' ? (
						<Button
							onPress={goToCartHandler}
							mode="contained"
							style={{ padding: 5 }}
						>
							Go To Cart
						</Button>
					) : (
						<View>
							{status == 'add' ? (
								<Button
									onPress={addToCartHandler}
									mode="contained"
									style={{ padding: 5 }}
								>
									Add To Cart
								</Button>
							) : (
								<Button onPress={enter} mode="contained" style={{ padding: 5 }}>
									Enter
								</Button>
							)}
						</View>
					)}
				</View>
			</View>
		</View>
	);
};
