import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, List } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { cartUpdate } from '../reducers/authSlice';
/**
 * @author
 * @function CourseDetails
 **/
export const CourseAccess = ({ navigation, course: data }) => {
	const [status, setStatus] = useState('');
	const dispatch = useDispatch();

	useEffect(async () => {
		try {
			var cart = await SecureStore.getItemAsync('cart');
			// console.log(cart);
			cart = JSON.parse(cart);

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
		} catch (e) {
			console.log(e);
		}
	}, []);

	const goToCartHandler = async () => {
		console.log('you clicked Go to Cart button');
		navigation.navigate('Home', {
			screen: 'Cart',
		});
	};

	const addToCartHandler = async () => {
		console.log('you clicked Add to Cart button');
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
						<Button
							onPress={addToCartHandler}
							mode="contained"
							style={{ padding: 5 }}
						>
							Add To Cart
						</Button>
					</View>
				)}
			</View>
		</View>
	);
};
