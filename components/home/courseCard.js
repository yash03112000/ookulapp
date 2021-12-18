import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	Dimensions,
	ActivityIndicator,
} from 'react-native';
import Constants from 'expo-constants';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { BuyCart } from '../BuyCart';
import { Button } from 'react-native-paper';
import { isCourseEnrolled } from '../../axios/learnpress';
import * as SecureStore from 'expo-secure-store';
import { useDispatch } from 'react-redux';
import { cartUpdate, reloadApp } from '../../reducers/authSlice';

const { manifest } = Constants;

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const classes = StyleSheet.create({
	head: {
		// height: 400,
		width: 250,
		// backgroundColor: 'yellow',
		margin: 5,
		padding: 2,
		// boxShadow: '10px 10px 30px silver',
		elevation: 3,
		// shadowColor: 'black',
		borderColor: 'black',
	},
	imgdiv: {
		height: 150,
	},
	img: {
		height: '100%',
		width: '100%',
		resizeMode: 'center',
	},
	title: {
		fontSize: 15,
		color: 'black',
		fontWeight: 'bold',
		padding: 3,
	},
	subtitle: {
		fontSize: 10,
		color: 'black',
		fontWeight: 'normal',
		padding: 2,
	},
	condiv: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-around',
		// backgroundColor: 'blue',
		height: 150,
		marginHorizontal: 4,
		// width: 0.62 * width,
	},
	pricediv: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
	},
});

export default function CourseCard({
	item: data,
	navigation,
	pageScreen,
	cart,
	token,
}) {
	// const router = useRouter();
	// console.log("data", data);

	const [loading, setLoading] = useState(true);
	// const [cart, setCart] = useState([]);
	const [enrolled, setEnrolled] = useState(false);
	const dispatch = useDispatch();

	// console.log(loading);

	useEffect(async () => {
		try {
			let flag = true;
			if (pageScreen !== 'CourseDetails') {
				if (flag) setLoading(false);
			} else {
				const isStudentEnrolled = await isCourseEnrolled(token, data.ID);
				if (flag) setEnrolled(isStudentEnrolled);
				if (flag) setLoading(false);
			}

			return () => {
				flag = false;
			};
		} catch (e) {
			console.log(e);
		}
	}, []);

	const enter = () => {
		console.log('start of single course screen', pageScreen);
		data['from'] = pageScreen;

		navigation.navigate('CourseDetails', data);
	};
	const enter2 = () => {
		console.log('start of single course screen', pageScreen);
		data['from'] = pageScreen;

		navigation.navigate('Home', {
			screen: 'CourseDetails',
			params: data,
		});
	};

	const remove = async () => {
		console.log('you clicked remove from Cart button');
		// navigation.push('Home', {
		// 	screen: 'Cart',
		// });
		try {
			// var cart = await SecureStore.getItemAsync('cart');
			var cart = await SecureStore.getItemAsync('cart');
			cart = JSON.parse(cart);
			var a = cart.filter((e) => e.ID !== data.ID);
			await SecureStore.setItemAsync('cart', JSON.stringify(a));

			dispatch(cartUpdate(a.length));
			dispatch(reloadApp());
			setLoading(false);
		} catch (e) {
			console.log(e);
		}
	};
	// console.log(pageScreen);

	return (
		<>
			{loading ? (
				<ActivityIndicator size="large" color="#0000ff" />
			) : (
				<View>
					{pageScreen === 'CourseDetails' && (
						<View style={classes.head}>
							<TouchableHighlight
								style={classes.imgdiv}
								// onPress={() => router.replace(`/course/${data._id}`)}
								onPress={enter}
							>
								{data.mediaLink.wooGsLink == '' ? (
									<Image
										source={{
											uri: 'https://storage.googleapis.com/media.ookul.co/ookulco/2021/07/3557f685-course-featured-image-100x100.jpg',
										}}
										style={classes.img}
									/>
								) : (
									<Image
										source={{
											uri: data.mediaLink.originalLink,
										}}
										style={classes.img}
									/>
								)}
							</TouchableHighlight>
							<View style={classes.condiv}>
								<View>
									<Text style={classes.title}>{data.post_title}</Text>
								</View>
								<View
									style={{
										borderBottomColor: 'gray',
										borderBottomWidth: 1,
									}}
								>
									<Text style={classes.subtitle}>{data.short_description}</Text>
								</View>
								<View>
									<Text style={{ color: 'gray', padding: 3 }}>
										{'Number of Lesson/Notes: ' + data.wpCourseMeta.count_items}
									</Text>
								</View>
								<View
									style={{
										borderBottomColor: 'gray',
										borderBottomWidth: 1,
									}}
								>
									<Text style={{ color: 'gray', padding: 3 }}>
										{'Students Enrolled: ' + data.wpCourseMeta._lp_students}
									</Text>
								</View>
							</View>
							<BuyCart {...{ navigation, data, enrolled, cart, pageScreen }} />
						</View>
					)}
					{(pageScreen === 'CourseSingle' || pageScreen == 'Cart') && (
						<View
							style={{
								height: 200,
								width,
								// padding: 2,
								marginVertical: 6,
								backgroundColor: 'white',
								// elevation: 3,
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							<View
								style={{
									// height: '70%',
									width: width,

									backgroundColor: '#faf8f2',
									flex: 3,
								}}
							>
								<TouchableHighlight
									// onPress={() => router.replace(`/course/${data._id}`)}
									onPress={enter2}
								>
									<View
										style={{
											display: 'flex',
											flexDirection: 'row',
											// backgroundColor: 'red',
										}}
									>
										<View style={{ flex: 1 }}>
											{data.mediaLink.wooGsLink == '' ? (
												<Image
													source={{
														uri: 'https://storage.googleapis.com/media.ookul.co/ookulco/2021/07/3557f685-course-featured-image-100x100.jpg',
													}}
													style={classes.img}
												/>
											) : (
												<Image
													source={{
														uri: data.mediaLink.originalLink,
													}}
													style={classes.img}
												/>
											)}
										</View>

										<View
											style={{
												display: 'flex',
												flexDirection: 'column',
												justifyContent: 'center',
												alignItems: 'center',
												flex: 2,
											}}
										>
											<View>
												<Text style={classes.title}>{data.post_title}</Text>
											</View>
											<View
												style={
													{
														// borderBottomColor: 'gray',
														// borderBottomWidth: 1,
													}
												}
											>
												<Text style={classes.subtitle}>
													{data.short_description}
												</Text>
											</View>
										</View>
									</View>
								</TouchableHighlight>
							</View>

							{pageScreen === 'Cart' && (
								<View style={{ flex: 1 }}>
									<Button onPress={remove}>Remove From Cart</Button>
								</View>
							)}
						</View>
					)}
				</View>
			)}
		</>
	);
}
