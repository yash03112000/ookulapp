import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	ActivityIndicator,
	Dimensions,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import CourseCard from '../components/home/courseCard';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Button, List } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { cartUpdate, reloadApp } from '../reducers/authSlice';

/**
 * @author
 * @function Cart
 **/
export const Cart = (props) => {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigation = useNavigation();
	const isFocused = useIsFocused();
	const dispatch = useDispatch();

	useEffect(async () => {
		try {
			if (isFocused) {
				setLoading(true);
				var cart = await SecureStore.getItemAsync('cart');
				cart = JSON.parse(cart);
				if (cart) setItems(cart);
				setLoading(false);
			}
		} catch (e) {
			console.log(e);
		}
	}, [isFocused]);

	const billingHandler = () => {
		navigation.navigate('Profile', {
			screen: 'CheckoutScreen',
		});
	};
	const remove = async (data) => {
		console.log('you clicked remove from Cart button');
		// navigation.push('Home', {
		// 	screen: 'Cart',
		// });
		try {
			setLoading(true);
			var cart = await SecureStore.getItemAsync('cart');
			cart = JSON.parse(cart);
			var a = cart.filter((e) => e.ID !== data.ID);
			setItems(a);
			await SecureStore.setItemAsync('cart', JSON.stringify(a));
			dispatch(cartUpdate(a.length));
			dispatch(reloadApp());
			setLoading(false);
		} catch (e) {
			console.log(e);
		}
	};
	// console.log(items);

	const { container } = styles;
	return loading ? (
		<View style={container}>
			<ActivityIndicator size="large" color="#0000ff" />
		</View>
	) : (
		<View style={{}}>
			{items.length == 0 ? (
				<Text>Cart is Empty</Text>
			) : (
				<View
					style={{ flexDirection: 'column', justifyContent: 'space-between' }}
				>
					<View style={{ height: 0.75 * height }}>
						<ScrollView>
							{items.map((item) => {
								// console.log(item);
								return (
									<CourseCard
										key={item.ID}
										{...{ item, navigation, pageScreen: 'Cart', remove }}
									/>
								);
							})}
						</ScrollView>
					</View>

					<View style={{}}>
						<Button
							onPress={billingHandler}
							mode="contained"
							style={{ padding: 5, marginVertical: 10 }}
						>
							Buy Now
						</Button>
					</View>
				</View>
			)}
		</View>
	);
};
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// flexDirection: 'row',
		// justifyContent: 'center',
		// alignItems: 'center',
	},
});
