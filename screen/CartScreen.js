import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	ActivityIndicator,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import CourseCard from '../components/home/courseCard';
import { useNavigation } from '@react-navigation/native';
import { Button, List } from 'react-native-paper';

/**
 * @author
 * @function Cart
 **/
export const Cart = (props) => {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigation = useNavigation();

	useEffect(async () => {
		try {
			var cart = await SecureStore.getItemAsync('cart');
			cart = JSON.parse(cart);
			if (cart) setItems(cart);
			setLoading(false);
		} catch (e) {
			console.log(e);
		}
	}, []);

	const billingHandler = () => {
		navigation.navigate('Profile', {
			screen: 'CheckoutScreen',
		});
	};
	// console.log(items);

	const { container } = styles;
	return loading ? (
		<View style={container}>
			<ActivityIndicator size="large" color="#0000ff" />
		</View>
	) : (
		<View style={container}>
			{items.length == 0 ? (
				<Text>Cart is Empty</Text>
			) : (
				<ScrollView style={{}}>
					{items.map((item) => {
						// console.log(item);
						return (
							<CourseCard
								key={item.ID}
								{...{ item, navigation, pageScreen: 'Cart' }}
							/>
						);
					})}
					<Button
						onPress={billingHandler}
						mode="contained"
						style={{ padding: 5 }}
					>
						Buy Now
					</Button>
				</ScrollView>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// flexDirection: 'row',
		// justifyContent: 'center',
		// alignItems: 'center',
	},
});
